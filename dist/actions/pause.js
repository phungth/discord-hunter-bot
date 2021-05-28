"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../data/server");
exports.default = {
    name: "pause",
    execute: (message) => {
        const server = server_1.servers[message.guild.id];
        if (server) {
            if (server.dispatcher && server.playing) {
                message.channel.send("⏸ Ok tạm dừng").then(() => server.dispatcher.pause());
            }
        }
        else
            message.channel.send("❌ Không có hát thì pause cmm à!");
    },
};
