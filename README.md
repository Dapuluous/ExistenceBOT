# Existence Discord BOT
I use this to practice writing clean code.  Not everything is clean, of course.

# .env files
There are variables you must fill in order to use the BOT properly.
| Variables | Description |
| ----------- | ----------- |
| CLIENT_ID | Your BOT's client ID |
| GUILD_ID | Your Discord server ID |
| TOKEN | Your BOT's token |
| OSU_CLIENT_ID | Your osu! account's OAuth client ID (v2) |
| OSU_CLIENT_SECRET | Your osu! account's OAuth client secret ID (v2) |
| OSU_V1_API_KEY | Your osu! account's API key (v1) |

# How to Run
1. Run the command `deploy-commands.js` first. Wait until process has finished
2. Run the command `node index.js`

The BOT is set up for server only use. If you want to make it global, make sure you adjust it yourself.

# Current Features (Slash Commands)
| Commands | Description |
| ----------- | ----------- |
| /ping | Returns "pong!" |
| /roll | Returns number between 1 to 100 |
| /set-osu \<nickname*> | Set your osu! nickname. Each account will only have 1 nickname |
| /beatmap | Returns beatmap info from osu! along with the expected PP for each mod combination |
| /profile \<mode*> \<nickname**> | Returns user's info based on their selected gamemode |

Notes: <br>
*: Required <br>
**: Optional
