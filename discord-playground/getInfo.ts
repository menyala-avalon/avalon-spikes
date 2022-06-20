// @ts-nocheck
// discord.js playground

import discord from "discord.js"
import dotenv from "dotenv"
dotenv.config();
import util from "util"
const exec = util.promisify(require('child_process').exec);

const DISCORD_TOKEN = process.env.DISCORD_TOKEN

const bot = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"] });

async function fetchGuildsInformation(bot) {
    const guilds = await bot.guilds.fetch()

    const allInfo = await Promise.all(guilds.map(async (guild) => {
        const fetchedGuild = await guild.fetch()
        const channelsManager = fetchedGuild.channels
        const channels = await channelsManager.fetch()
        const channelsOutput = (await Promise.all(channels.map(async (channel) => {
            return `channel: ${channel.name} ${channel.id}`
        }))).join("\n")

        const output = `guild: ${fetchedGuild.name} ${fetchedGuild.id}
${channelsOutput}
`
        console.log(output)

        return {
            guild: guild,
            channels: channels.map(channel => {
                return {
                    name: channel.name,
                    id: channel.id
                }
            })
        }
    }))

    console.log(JSON.stringify(allInfo, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
        , 2))

    const commands = allInfo.flatMap(g => {
        const { channels, guild } = g

        const guildCmd = `podman run --rm -v /Users/joel.lim/Downloads/chatbot-data:/app/out tyrrrz/discordchatexporter:stable export -t tyrrrz/discordchatexporter:stable export -t ${DISCORD_TOKEN} -c ${guild.id}`

        return channels.map(channel => {
            return `podman run --rm -v /Users/joel.lim/Downloads/chatbot-data:/app/out tyrrrz/discordchatexporter:stable export -t tyrrrz/discordchatexporter:stable export -t ${DISCORD_TOKEN} -c ${channel.id}`
        }).concat(guildCmd)
    })

    await Promise.all(commands.map(async(cmd) => {
        const { stdout, stderr } = await exec('ls');
        console.log(stdout)
    }))
    console.log("finished")
}

async function main() {
    console.log("connecting bot")
    await bot.login(DISCORD_TOKEN)
    console.log(bot.toJSON())
    await fetchGuildsInformation(bot)
}

main()