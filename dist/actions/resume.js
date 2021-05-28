"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../data/server");
exports.default = {
    name: "resume",
    execute: (message) => {
        const server = server_1.servers[message.guild.id];
        if (server) {
            if (server.dispatcher && server.playing) {
                server.dispatcher.resume();
                message.channel.send("⏯ OK tiếp tục");
            }
            else
                message.channel.send("❌ Không có bài nào đang bật!");
        }
        else
            message.channel.send("❌ Không có bài nào đang bật!");
    },
};
