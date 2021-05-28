import { Message } from "discord.js";

import { servers } from "../data/server";

export default {
  name: "resume",
  execute: (message: Message): void => {
    const server = servers[message.guild.id];
    if (server) {
      if (server.dispatcher && server.playing) {
        server.dispatcher.resume();
        message.channel.send("⏯ OK tiếp tục");
      } else message.channel.send("❌ Không có bài nào đang bật!");
    } else message.channel.send("❌ Không có bài nào đang bật!");
  },
};
