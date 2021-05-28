import express from "express";
import path from "path";
import herokuAwake from "heroku-awake";
import { Client } from "discord.js";
import play from "./actions/play";
import skip from "./actions/skip";
import nowplaying from "./actions/nowplaying";
import pause from "./actions/pause";
import resume from "./actions/resume";
import stop from "./actions/stop";
import clear from "./actions/clear";

const port = process.env.PORT || 3000;
const server = express();
const url = "https://hunterbot-phungth.herokuapp.com/"; // Đường dẫn của app bạn trên Heroku

const bot = (): void => {
  const client = new Client();
  const token = process.env.TOKEN;
  const prefix = "!";
  // Đây là tiền tố trước mỗi lệnh mà ta ra hiệu cho bot từ khung chat.
  // Lệnh có dạng như sau "!play Nhạc Đen Vâu", "!pause",...

  client.on("message", (message) => {
    const args = message.content.substring(prefix.length).split(" ");
    const content = message.content.substring(prefix.length + args[0].length);

    if (message.content[0] === "!") {
      switch (args[0]) {
        case play.name:
          play.execute(message, content);
          break;
        case skip.name:
          skip.execute(message);
          break;
        case nowplaying.name.toString():
          nowplaying.execute(message);
          break;
        case pause.name:
          pause.execute(message);
          break;
        case resume.name:
          resume.execute(message);
          break;
        case stop.name:
          stop.execute(message);
          break;
        case clear.name:
          clear.execute(message);
          break;
        // More short command
        case "np":
          nowplaying.execute(message);
          break;
        case "fs":
          skip.execute(message);
          break;
      }
    }
  });

  client.on("ready", () => {
    console.log("🏃‍♀️ Hunterbot is online! 💨");
  });

  client.once("reconnecting", () => {
    console.log("🔗 Reconnecting!");
  });

  client.once("disconnect", () => {
    console.log("🛑 Disconnect!");
  });

  client.login(token);
};

server.disable("x-powered-by");

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

server.listen(port, () => {
  bot();
  herokuAwake(url);
  console.log(`🚀 Server is running on port ${port} ✨`);
});
