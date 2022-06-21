// @ts-nocheck
// discord.js playground

import discord from "discord.js"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config();
import util from "util"
const exec = util.promisify(require('child_process').exec);
import emojiStrip from "emoji-strip"
const program = "docker"
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

    const commands = allInfo.map(g => {
        const { channels, guild } = g

        const outputFormats = {
            // HtmlDark: "html", 
            // PlainText: "txt", 
            // Json: "json", 
            Csv: "csv"
        }

        const guildCmds = Object.entries(outputFormats).map(([_, format]) => { return `${program} run --rm -v /Users/joel.lim/Downloads/chatbot-data:/app/out tyrrrz/discordchatexporter:stable export -t ${DISCORD_TOKEN} -c ${guild.id} -o "/app/out/guild-${emojiStrip(guild.name)}-${guild.id}.${format}"` })
        return guildCmds
        return channels.flatMap(channel => {
            const channelNameSplit = channel.name.split("│")
            const channelName = channelNameSplit[channelNameSplit.length - 1]
            const fileIdentifier = emojiStrip(`guild-${guild.name.trim()}-channel-${channelName.trim()}-${channel.id}`)

            return Object.entries(outputFormats).map(([_, format]) => {
                return `${program} run --rm -v /Users/joel.lim/Downloads/chatbot-data:/app/out tyrrrz/discordchatexporter:stable export -t ${DISCORD_TOKEN} -c ${channel.id} -o "/app/out/${fileIdentifier}.${format}"`
            })
        }).concat(guildCmds)
    })

    console.log(commands)

    fs.writeFileSync("temp/importInfo.sh", commands.join("\n"));
    return
    await Promise.all(commands.map(async (cmd) => {
        console.log(cmd)
        // const { stdout, stderr } = await exec(cmd);
        // console.log(stdout)
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