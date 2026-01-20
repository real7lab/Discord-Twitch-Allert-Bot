# Easy Twitch Alert Bot

## Overview

**Easy Twitch Alert Bot** is a Discord bot that alerts a specified channel when a list of Twitch users goes live. It integrates with Twitch's API to check the online status of users and notify a Discord channel when they start streaming.

### Developed by

- **real7lab**
- [Discord Server](https://discord.gg/FzCpzcRnrz)

## Features

- Monitors specified Twitch users.
- Sends alerts to a Discord channel when any of these users go live.
- Configurable through a `config.json` file.

## Installation

### Prerequisites

- Node.js (v13)
- A Discord bot token
- Twitch API credentials

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/real7lab/Discord-Twitch-Allert-Bot.git
   cd Discord-Twitch-Allert-Bot
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure the Bot**

   Locate the `config.json` and fill in your credentials:

   ```json
   {
     "token": "YOUR_DISCORD_BOT_TOKEN",
     "clientid": "YOUR_DISCORD_CLIENT_ID",
     "TwitchClientID": "YOUR_TWITCH_CLIENT_ID",
     "TwitchClientSecret": "YOUR_TWITCH_CLIENT_SECRET"
   }
   ```

4. **Start the Bot**

   ```bash
   node index.js
   ```

## Configuration

### `config.json`

This file contains sensitive credentials and should be kept secure. Here’s what each field represents:

- **`token`**: Your Discord bot token. Obtain this from the [Discord Developer Portal](https://discord.com/developers/applications).
- **`clientid`**: Your Discord client ID. Used for identifying your bot application.
- **`TwitchClientID`**: Your Twitch client ID. Obtain this from the [Twitch Developer Console](https://dev.twitch.tv/console).
- **`TwitchClientSecret`**: Your Twitch client secret. Obtain this from the [Twitch Developer Console](https://dev.twitch.tv/console).

### `TwitchUsernames`

In the code, modify the `TwitchUsernames` array to include the Twitch usernames you want to monitor:

```js
const TwitchUsernames = ['user1', 'user2', 'user3', 'user4', 'user5'];
```

### `notified_streams.json`

This file is automatically created and managed by the bot. It stores information about streams that have already been notified.

## Usage

1. **Launch the Bot**: Run `node index.js` in your terminal.
2. **Monitor Alerts**: The bot will check every 10 seconds for live status of the specified Twitch users.
3. **Receive Notifications**: When a monitored user goes live, an alert will be sent to the specified Discord channel.

### Modifying Alerts

To customize how notifications are sent, modify the `channel.send` method in the `checkTwitchStatus` function. Replace the `channelliveId` with your target Discord channel ID.

## Error Handling

The bot logs errors to the console. Ensure you monitor the logs for any issues, especially related to API requests or file handling.

## Troubleshooting

- **Bot Not Responding**: Ensure your bot is online and connected to the Discord server. Check the console for errors.
- **API Issues**: Verify that your API credentials are correct and that you are using the correct endpoint.

## License

This project is developed by [Lab](https://discord.gg/visionn). 

For more details, please refer to our [official discord](https://discord.gg/visionn).

