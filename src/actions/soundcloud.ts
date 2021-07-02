import { Message, MessageEmbed } from "discord.js";

import { servers } from "../data/server";
import { getTrackDetails, getPlaylist } from "../services/soundcloud";
import { formatTimeRange } from "../utils/time";
import { soundcloudPlaylistRegex } from "../constant/regex";
import { playAudio } from "./playAudio";
import { Platform } from "../services/types";
import { misabotLogo, platforms } from "../constant/config";

export default {
  name: "soundcloud",
  execute: (message: Message, content: string): void => {
    if (!content)
      message.channel.send(
        "❌ You need to provide an SoundCloud URL or name of tracks\n\n✅ Ex: !play Shape of You"
      );
    else {
      if (!servers[message.guild.id])
        servers[message.guild.id] = {
          queue: [],
        };
      const server = servers[message.guild.id];

      const paths = content.match(soundcloudPlaylistRegex);
      if (paths) {
        getPlaylist(paths[0])
          .then((result) => {
            const resources = result.resources;

            const messageEmbed = new MessageEmbed()
              .setColor("#0099ff")
              .setURL(paths[0])
              .setTitle(result.title)
              .setAuthor(
                `➕ Add playlist to order by ${message.member.displayName}`,
                platforms[Platform.SOUNDCLOUD.toString()].uri
              )
              .setThumbnail(result.thumbnail)
              .addFields(
                { name: "Author", value: result.author, inline: true },
                {
                  name: "Video count",
                  value: resources.length,
                  inline: true,
                }
              )
              .setFooter(`Misabot © ${new Date().getFullYear()}`, misabotLogo);

            message.channel.send(messageEmbed).then(() => {
              if (!message.guild.voice) {
                server.queue = [];
                resources.forEach((resource) => {
                  server.queue.push({
                    requester: message.member.displayName,
                    resource: resource,
                  });
                });
                server.playing = null;
                message.member.voice.channel.join().then((connection) => {
                  playAudio(connection, message);
                });
              } else if (!message.guild.voice.connection) {
                server.queue = [];
                resources.forEach((resource) => {
                  server.queue.push({
                    requester: message.member.displayName,
                    resource: resource,
                  });
                });
                server.playing = null;
                message.member.voice.channel.join().then((connection) => {
                  playAudio(connection, message);
                });
              } else {
                resources.forEach((resource) => {
                  server.queue.push({
                    requester: message.member.displayName,
                    resource: resource,
                  });
                });
              }
            });
          })
          .catch((e) => {
            message.channel.send(JSON.stringify(e));
          });
      } else
        getTrackDetails(content)
          .then((result) => {
            const messageEmbed = new MessageEmbed()
              .setURL(result.url)
              .setColor("#0099ff")
              .setTitle(result.title)
              .setAuthor(
                `Add to order by ${message.member.displayName}`,
                platforms[Platform.SOUNDCLOUD.toString()].uri
              )
              .setThumbnail(result.thumbnail)
              .addFields(
                { name: "Channel", value: result.author, inline: true },
                {
                  name: "Length",
                  value: formatTimeRange(result.length),
                  inline: true,
                },
                {
                  name: "Position in order",
                  value: server.queue.length + 1,
                  inline: true,
                }
              )
              .setFooter(`Misabot © ${new Date().getFullYear()}`, misabotLogo);

            message.channel.send(messageEmbed).then(() => {
              if (!message.guild.voice) {
                server.queue = [];
                server.queue.push({
                  requester: message.member.displayName,
                  resource: result,
                });
                server.playing = null;
                message.member.voice.channel.join().then((connection) => {
                  playAudio(connection, message);
                });
              } else if (!message.guild.voice.connection) {
                server.queue = [];
                server.queue.push({
                  requester: message.member.displayName,
                  resource: result,
                });
                server.playing = null;
                message.member.voice.channel.join().then((connection) => {
                  playAudio(connection, message);
                });
              } else {
                server.queue.push({
                  requester: message.member.displayName,
                  resource: result,
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
