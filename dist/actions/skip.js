"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const time_1 = require("../utils/time");
const server_1 = require("../data/server");
exports.default = {
    name: "skip",
    execute: (message) => {
        const server = server_1.servers[message.guild.id];
        if (server) {
            if (server.dispatcher) {
                if (server.queue.length === 0) {
                    server.dispatcher.end();
                    server.playing = null;
                    message.channel.send("❌ Hết bài đề qua rồi!");
                }
                else {
                    const song = server.queue[0];
                    const messageEmbed = new discord_js_1.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(song.resource.title)
                        .setAuthor(`Skipped by ${message.member.displayName}`)
                        .setThumbnail(song.resource.thumbnail)
                        .addFields({ name: "Channel", value: song.resource.author, inline: true }, {
                        name: "Length",
                        value: time_1.formatTimeRange(song.resource.length),
                        inline: true,
                    });
                    message.channel
                        .send(messageEmbed)
                        .then(() => server.dispatcher.end());
                }
            }
            else
                message.channel.send("❌ Hết bài đề qua rồi!");
        }
        else {
            message.channel.send("❌ Hết bài đề qua rồi!");
        }
    },
};
