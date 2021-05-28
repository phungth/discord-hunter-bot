// Dừng phát nhạc và rời khỏi kênh thoại
import { Message } from "discord.js";

import { servers } from "../data/server";

export default {
  name: "stop",
  execute: (message: Message): void => {
    const server = servers[message.guild.id];

    if (message.guild.voice) {
      if (server) {
        if (server.dispatcher) {
          for (let i = server.queue.length - 1; i >= 0; i--) {
            server.queue.splice(i, 1);
          }
          server.playing = null;
          server.dispatcher.end();
          message.channel.send("Ok tao đã tắt hết và thoát voice rồi nha!");
        }
      } else message.channel.send("❌ Không có bài nào hết sao stop!");
      if (message.guild.voice.connection)
        message.guild.voice.connection.disconnect();
    } else message.channel.send("❌ Không có bài nào hết sao stop!");
  },
};
