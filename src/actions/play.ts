import { Message, VoiceConnection, MessageEmbed } from "discord.js";
import ytdl from "ytdl-core";

import { servers } from "../data/server";
import { getVideoDetails, getPlaylist } from "../services/youtube";
import { formatTimeRange } from "../utils/time";
import { youtubePlaylistRegex } from "../constant/regex";

// Đảm nhiệm stream nhạc và chuyển bài khi kết thúc
const play = (connection: VoiceConnection, message: Message) => {
  const server = servers[message.guild.id];
  const song = server.queue[0];
  server.playing = {
    song,
    startedAt: new Date().getTime(),
  };

  server.dispatcher = connection.play(
    ytdl(song.resource.url, { filter: "audioonly" })
  );
  server.queue.shift();
  // Phát hiện việc bài hát kết thúc
  server.dispatcher.on("finish", () => {
    if (server.queue[0]) play(connection, message);
    else {
      server.playing = null;
      server.queue = [];
      connection.disconnect();
    }
  });
};

export default {
  name: "play",
  execute: (message: Message, content: string): void => {
    if (!content)
      message.channel.send(
        "❌ Mày phải ghi tên bài hát hoặc nhập cái link dô dcmm"
      );
    else if (!message.member.voice.channel)
      message.channel.send("❌ Mày dô voice đi rồi mới kêu tao hát đc!");
    else {
      if (!servers[message.guild.id])
        servers[message.guild.id] = {
          queue: [],
        };
      const server = servers[message.guild.id];

      const paths = content.match(youtubePlaylistRegex);
      if (paths) {
        getPlaylist(paths[0])
          .then((result) => {
            const resources = result.resources;
            resources.forEach((resource) => {
              server.queue.push({
                requester: message.member.displayName,
                resource: resource,
              });
            });

            const messageEmbed = new MessageEmbed()
              .setColor("#0099ff")
              .setTitle(result.title)
              .setAuthor(
                `Add playlist to order by ${message.member.displayName}`
              )
              .setThumbnail(result.thumbnail)
              .addFields(
                { name: "Author", value: result.author, inline: true },
                {
                  name: "Video count",
                  value: resources.length,
                  inline: true,
                }
              );

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
      } else
        getVideoDetails(content)
          .then((result) => {
            server.queue.push({
              requester: message.member.displayName,
              resource: result,
            });
            const messageEmbed = new MessageEmbed()
              .setColor("#0099ff")
              .setTitle(result.title)
              .setAuthor(`Add to order by ${message.member.displayName}`)
              .setThumbnail(result.thumbnail)
              .addFields(
                { name: "Channel", value: result.author, inline: true },
                {
                  name: "Length",
                  value: formatTimeRange(result.length),
                  inline: true,
                }
              )
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
