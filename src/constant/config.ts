import { Platform } from "../services/types";

export const prefix = "!";

export const defaultSCArtWork =
  "https://res.cloudinary.com/dumfvnj9f/image/upload/v1621600068/misabot-discord/58af04446c252499281ae91f_zzjc86.png";

export const soundCloudLogo =
  "https://res.cloudinary.com/dumfvnj9f/image/upload/v1621607196/misabot-discord/soundcloud_kfwdtz.png";

export const youtubeLogo =
  "https://res.cloudinary.com/dumfvnj9f/image/upload/v1621607197/misabot-discord/youtube_af1h05.png";

export const hunterbotLogo =
  "https://cdn.discordapp.com/app-icons/847747812238295040/28b06cd9ba94668eb0455847a3f0a712.png?size=128";

export const platforms = {
  [Platform.YOUTUBE.toString()]: {
    uri: youtubeLogo,
    name: "Youtube",
  },
  [Platform.SOUNDCLOUD.toString()]: {
    uri: soundCloudLogo,
    name: "SoundCloud",
  },
};
