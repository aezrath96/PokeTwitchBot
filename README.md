# PokeTwitchBot
 Pokemon Twitch Bot In Development

Clone the project:

`git clone https://github.com/SwyftPain/PokeTwitchBot`

Create `.env` file and fill in (EDIT) data:

```
MYSQL_HOST = "YOUR MYSQL HOST"
MYSQL_USER = "YOUR MYSQL USERNAME"
MYSQL_PASSWORD = "YOUR MYSQL PASSWORD"
MYSQL_DATABASE = "YOUR MYSQL DATABASE"
TWITCH_BOT_CHANNEL = "YOUR BOT NAME"
TWITCH_CHANNEL_NAME = "YOUR TWITCH CHANNEL"
TWITCH_OAUTH_TOKEN = "oauth:BOT OAUTH TOKEN"
```

You can get Oauth token here:
[here](https://twitchapps.com/tmi/)

In cmd, do:

`npm install && npm start`

For all bugs and suggestions/edits, see:
[issues](https://github.com/SwyftPain/PokeTwitchBot/issues)

When i feel like this is developed enough for use, i will publish a release.

Use `database.sql` file for database structure.
This does assume you already have your own MySQL database.

I am personally hosting mine through: [xampp](https://www.apachefriends.org/index.html)
