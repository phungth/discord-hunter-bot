"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const time_1 = require("../utils/time");
const server_1 = require("../data/server");
exports.default = {
    name: ["nowplaying"],
    execute: (message) => {
        const server = server_1.servers[message.guild.id];
        if (server) {
            if (!server.playing) {
                message.channel.send("❌ Không có bài nào hết ba ơi!");
            }
            else {
                const song = server.playing.song;
                const messageEmbed = new discord_js_1.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle(song.resource.title)
                    .setAuthor(`Playing 🎵 `)
                    .setThumbnail(song.resource.thumbnail)
                    .addFields({ name: "Channel", value: song.resource.author, inline: true }, {
                    name: "Length",
                    value: time_1.formatTimeRange(song.resource.length),
                    inline: true,
                });
                message.channel.send(messageEmbed);
            }
        }
        else {
            message.channel.send("❌ Không có bài nào hết ba ơi!");
        }
    },
};
