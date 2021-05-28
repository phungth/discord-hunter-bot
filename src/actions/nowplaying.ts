import { Message, MessageEmbed } from "discord.js";

import { formatTimeRange } from "../utils/time";
import { servers } from "../data/server";

export default {
  name: ["nowplaying"],
  execute: (message: Message): void => {
    const server = servers[message.guild.id];
    if (server) {
      if (!server.playing) {
        message.channel.send("❌ Không có bài nào hết ba ơi!");
      } else {
        const song = server.playing.song;
        const messageEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(song.resource.title)
          .setAuthor(`Playing 🎵 `)
          .setThumbnail(song.resource.thumbnail)
          .addFields(
            { name: "Channel", value: song.resource.author, inline: true },
            {
              name: "Length",
              value: formatTimeRange(song.resource.length),
              inline: true,
            }
          )
        message.channel.send(messageEmbed);
      }
    } else {
      message.channel.send("❌ Không có bài nào hết ba ơi!");
    }
  },
};
