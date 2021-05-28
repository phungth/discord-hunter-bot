"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../data/server");
exports.default = {
    name: "clear",
    execute: (message) => {
        const server = server_1.servers[message.guild.id];
        if (server) {
            server.queue = [];
            message.channel.send("🧹 Ok tao xóa hết rồi đó!");
        }
        else {
            message.channel.send("❌ Không có bài nào sao xóa ba!");
        }
    },
};
