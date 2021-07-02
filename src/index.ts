import { config } from "dotenv";
config();

import express from "express";
import path from "path";
import herokuAwake from "heroku-awake";

import bot from "./bot";

const port = process.env.PORT || 5000;
const server = express();
const url = "https://hunterbot-phungth.herokuapp.com/";

server.disable("x-powered-by");
server.use(express.static(path.resolve(`${__dirname}/../public`)));

server.get("*", (_req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../public/index.html`));
});

server.listen(port, () => {
  bot();
  herokuAwake(url);
  console.log(`🚀 Server is running on port ${port} ✨`);
});
