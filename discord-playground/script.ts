// @ts-nocheck

import discord from "discord.js"
import dotenv from "dotenv"

dotenv.config();

const bot = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

bot.on('message', (msg) => {
    console.log(msg.content)
})

bot.login(process.env.DISCORD_TOKEN)