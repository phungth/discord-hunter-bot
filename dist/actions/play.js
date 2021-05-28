"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const server_1 = require("../data/server");
const youtube_1 = require("../services/youtube");
const time_1 = require("../utils/time");
const regex_1 = require("../constant/regex");
// Đảm nhiệm stream nhạc và chuyển bài khi kết thúc
const play = (connection, message) => {
    const server = server_1.servers[message.guild.id];
    const song = server.queue[0];
    server.playing = {
        song,
        startedAt: new Date().getTime(),
    };
    server.dispatcher = connection.play(ytdl_core_1.default(song.resource.url, { filter: "audioonly" }));
    server.queue.shift();
    // Phát hiện việc bài hát kết thúc
    server.dispatcher.on("finish", () => {
        if (server.queue[0])
            play(connection, message);
        else {
            server.playing = null;
            server.queue = [];
            connection.disconnect();
        }
    });
};
exports.default = {
    name: "play",
    execute: (message, content) => {
        if (!content)
            message.channel.send("❌ Mày phải ghi tên bài hát hoặc nhập cái link dô dcmm");
        else if (!message.member.voice.channel)
            message.channel.send("❌ Mày dô voice đi rồi mới kêu tao hát đc!");
        else {
            if (!server_1.servers[message.guild.id])
                server_1.servers[message.guild.id] = {
                    queue: [],
                };
            const server = server_1.servers[message.guild.id];
            const paths = content.match(regex_1.youtubePlaylistRegex);
            if (paths) {
                youtube_1.getPlaylist(paths[0])
                    .then((result) => {
                    const resources = result.resources;
                    resources.forEach((resource) => {
                        server.queue.push({
                            requester: message.member.displayName,
                            resource: resource,
                        });
                    });
                    const messageEmbed = new discord_js_1.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(result.title)
                        .setAuthor(`Add playlist to order by ${message.member.displayName}`)
                        .setThumbnail(result.thumbnail)
                        .addFields({ name: "Author", value: result.author, inline: true }, {
                        name: "Video count",
                        value: resources.length,
                        inline: true,
                    });
                    message.channel.send(messageEmbed).then(() => {
                        if (!message.guild.voice)
                            message.member.voice.channel.join().then((connection) => {
                                play(connection, message);
                            });
                        else if (!message.guild.voice.connection) {
                            message.member.voice.channel.join().then((connection) => {
                                play(connection, message);
                            });
                        }
                    });
                })
                    .catch((e) => {
                    message.channel.send(JSON.stringify(e));
                });
            }
            else
                youtube_1.getVideoDetails(content)
                    .then((result) => {
                    server.queue.push({
                        requester: message.member.displayName,
                        resource: result,
                    });
                    const messageEmbed = new discord_js_1.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(result.title)
                        .setAuthor(`Add to order by ${message.member.displayName}`)
                        .setThumbnail(result.thumbnail)
                        .addFields({ name: "Channel", value: result.author, inline: true }, {
                        name: "Length",
                        value: time_1.formatTimeRange(result.length),
                        inline: true,
                    })
                        .addField("Position in order", server.queue.length, true);
                    message.channel.send(messageEmbed).then(() => {
                        if (!message.guild.voice)
                            message.member.voice.channel.join().then((connection) => {
                                play(connection, message);
                            });
                        else if (!message.guild.voice.connection) {
                            message.member.voice.channel.join().then((connection) => {
                                play(connection, message);
                            });
                        }
                    });
                })
                    .catch((e) => {
                    message.channel.send(JSON.stringify(e));
                });
        }
    },
};
