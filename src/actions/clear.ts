// Xoá toàn bộ list video đang đợi phát
import { Message } from "discord.js";

import { servers } from "../data/server";

export default {
  name: "clear",
  execute: (message: Message): void => {
    const server = servers[message.guild.id];
    if (server) {
      server.queue = [];
      message.channel.send("🧹 Ok tao xóa hết rồi đó!");
    } else {
      message.channel.send("❌ Không có bài nào sao xóa ba!");
    }
  },
};
