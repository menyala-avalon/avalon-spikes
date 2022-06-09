// @ts-nocheck
// discord.js playground

import discord from "discord.js"
import dotenv from "dotenv"
import { analyseSentiment } from "./sentiment"
dotenv.config();

const bot = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"] });

bot.on('messageCreate', async (msg) => {
    const content = msg.content

    async function analyseSentiment(content) {
        const { score } = await analyseSentiment(content)
        msg.channel.send(`I heard you "${content} ${score} ${score > 0 ? "POSITIVE" : "NEGATIVE"}`)
    }

    if (!msg.author.bot) {
        console.log(`bot received ${content}`)
        // await analyseSentiment(content)
    }
})

async function sendMessageToFirstChannel(guild, msg) {
    const channels = await guild.channels.fetch()
    const channel = Array.from(channels.values()).find(channel => {
        return channel.type == "GUILD_TEXT"
    })
    channel.send(msg);
}

bot.on('guildMemberAdd', member => {
    sendMessageToFirstChannel(member.guild, JSON.stringify(member, null, 2))
})

bot.on('presenceUpdate', async (oldPresence, newPresence) => {
    const { status, clientStatus, userId } = newPresence;

    const msg = `user${userId} new status: ${status}, clientStatus: ${JSON.stringify(clientStatus, null, 2)}}`;
    sendMessageToFirstChannel(newPresence.guild, msg)
});

bot.on('interactionCreate', async (interaction) => {
    console.log("interactionCreate")
});

bot.on('ready', () => {
    console.log("bot is ready")
})

let testBotChannels = {}

async function fetchGuildsInformation(bot) {
    const guilds = await bot.guilds.fetch()

    guilds.each(async (guild) => {
        const fetchedGuild = await guild.fetch()
        const channelsManager = fetchedGuild.channels
        const channels = await channelsManager.fetch()
        const channelsOutput = (await Promise.all(channels.map(async (channel) => {
            if (channel.name == "test-bot") {
                testBotChannels[guild.id] = channel
            }

            return `channel: ${channel.name}
${channel.members.map(member => {
                return member.displayName
            }).join("\n")}
`
        }))).join("\n")

        const output = `guild: ${fetchedGuild.name}
${channelsOutput}
`
        testBotChannels[guild.id]?.send(output)
    })
}

async function main() {
    console.log("connecting bot")
    await bot.login(process.env.DISCORD_TOKEN)

    await fetchGuildsInformation(bot)
    setInterval(() => { fetchGuildsInformation(bot) }, 20000)
}

main()