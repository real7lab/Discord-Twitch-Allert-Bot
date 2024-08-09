/*
Easy Twitch Allert Bot

Developed by real7lab

discord.gg/visionn 
*/

//  MAIN 
const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require("./config.json");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_INVITES
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

// START BOT
client.once('ready', () => {
  console.log('Bot is online!');
  setInterval(() => {
    TwitchUsernames.forEach(username => {
      checkTwitchStatus(username);
    });
  }, 10000);
});

client.login(config.token);

const TwitchClientID = config.TwitchClientID;
const TwitchClientSecret = config.TwitchClientSecret;
const TwitchUsernames = ['user1', 'user2', 'user3', 'user4', 'user5'];

const notifiedStreamsFile = path.resolve(__dirname, 'notified_streams.json');

async function checkTwitchStatus(username) {
  try {
    const accessToken = await getTwitchAccessToken();
    const userResponse = await axios.get(`https://api.twitch.tv/helix/users`, {
      headers: {
        'Client-ID': TwitchClientID,
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        login: username
      }
    });

    if (userResponse.data.data.length === 0) {
      // console.log(`User ${username} not found`);
      return;
    }

    const userId = userResponse.data.data[0].id;

    const streamResponse = await axios.get(`https://api.twitch.tv/helix/streams`, {
      headers: {
        'Client-ID': TwitchClientID,
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        user_id: userId
      }
    });

    if (streamResponse.data.data.length > 0) {
      const stream = streamResponse.data.data[0];
      if (await hasBeenNotified(stream.user_name, stream.started_at)) {
        return;
      }

      await saveNotifiedStream(stream.user_name, stream.started_at);

      const embed = new MessageEmbed()
        .setAuthor({ name: `${username} is currently live!`, url: `https://www.twitch.tv/${username}` })
        .setColor('#9146ff')
        .setTitle(stream.title)
        .setURL(`https://www.twitch.tv/${username}`)
        .addFields(
          { name: '**Game:**', value: `\`\`\`yaml\n${stream.game_name}\`\`\``, inline: true },
          { name: '**Viewers:**', value: `\`\`\`yaml\n${stream.viewer_count}\`\`\``, inline: true }
        )
        .setImage(stream.thumbnail_url.replace('{width}', '400').replace('{height}', '225'))
        .setFooter(`Developed by Lab`)
        .setTimestamp();

      const channelliveId = ''; // channel where you want to log the embed
      const channel = client.channels.cache.get(channelliveId);

      if (channel) {
        setTimeout(() => {
          channel.send({
            content: `|| @everyone ||`, // content of the embed (you can change it easily)
            embeds: [embed]
          });
        }, 2000);
      } else {
        console.error(`Channel with ID ${channelliveId} not found`);
      }
    } else {
      // console.log(`${username} is currently not live.`);
    }
  } catch (error) {
    console.error(`An error occurred while checking Twitch status for ${username}:`, error);
  }
}

async function hasBeenNotified(username, startedAt) {
  try {
    const notifiedStreams = await readNotifiedStreams();
    return notifiedStreams.some(stream => stream.username === username && stream.started_at === startedAt);
  } catch (error) {
    console.error('Error checking notified streams:', error);
    return false;
  }
}

async function saveNotifiedStream(username, startedAt) {
  try {
    const notifiedStreams = await readNotifiedStreams();
    notifiedStreams.push({ username, started_at: startedAt });
    await writeNotifiedStreams(notifiedStreams);
  } catch (error) {
    console.error('Error saving notified stream:', error);
  }
}

async function readNotifiedStreams() {
  try {
    if (fs.existsSync(notifiedStreamsFile)) {
      const data = await fs.promises.readFile(notifiedStreamsFile, 'utf8');
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error reading notified streams file:', error);
    return [];
  }
}

async function writeNotifiedStreams(data) {
  try {
    await fs.promises.writeFile(notifiedStreamsFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing notified streams file:', error);
  }
}

async function getTwitchAccessToken() {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: TwitchClientID,
        client_secret: TwitchClientSecret,
        grant_type: 'client_credentials'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Twitch access token:', error);
    throw error;
  }
}

process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);
process.on('uncaughtExceptionMonitor', handleError);

function handleError(error) {
  console.error('Unhandled error:', error);
}
