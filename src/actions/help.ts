import { Message, MessageEmbed } from "discord.js";
import { servers } from "../data/server";
import { hunterbotLogo } from "../constant/config";

export default {
  name: "help",
  execute: (message: Message): void => {
    const server = servers[message.guild.id];
    if (!server) {
      message.channel.send("❌ Error!");
    }
    const messageEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Guide for using Hunterbot")
      .setAuthor(`Request by ${message.member.displayName}`)
      .addField("!help", 'Show user guide for using Hunterbot')
      .addField("!play|!p", `Play a song on Youtube  [!play name/url]`)
      .addField("!sc", 'Play a song on SoundCloud')
      .addField("!np", 'Get current song info')
      .addField("!pause", 'Pause current song')
      .addField("!resume", 'Resume current song')
      .addField("!skip|!next", 'Play next song')
      .addField("!stop", 'Stop and leave voice channel')
      .addField("!clear", 'Clear music playlist')
      .addField("!queue", 'Get playlist info')
      .addField("!loop", 'Loop current song')
      .addField("!rm", `Remove the music in playlist by position [!rm position_in_playlist]`)
      .setFooter(`Hunterbot © ${new Date().getFullYear()}`, hunterbotLogo);
    message.channel.send(messageEmbed)
    .then()
    .catch(() => {
      message.channel.send("❌ Error!");
    })
  },
};
