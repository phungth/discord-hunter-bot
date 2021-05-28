"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylist = exports.getVideoDetails = void 0;
const ytsr_1 = __importDefault(require("ytsr"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const ytpl_1 = __importDefault(require("ytpl"));
const regex_1 = require("../constant/regex");
// Tìm video bằng từ khoá và trả về id video nếu tìm thấy hoặc trả về tin nhắn lỗi.
const searchVideo = (keyword) => {
    try {
        return ytsr_1.default(keyword, { pages: 1 })
            .then((result) => {
            const filteredRes = result.items.filter((e) => e.type === "video");
            if (filteredRes.length === 0)
                throw "🔎 Can't find video!";
            const item = filteredRes[0];
            return item.id;
        })
            .catch((error) => {
            throw error;
        });
    }
    catch (e) {
        throw "❌ Invalid params";
    }
};
// Lấy thông tin của 1 video bằng nội dung truyền vào. URL hoặc từ khoá
const getVideoDetails = (content) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedContent = content.match(regex_1.youtubeVideoRegex);
    let id = "";
    if (!parsedContent) {
        id = yield searchVideo(content);
    }
    else {
        id = parsedContent[1];
    }
    const url = `https://www.youtube.com/watch?v=${id}`;
    return ytdl_core_1.default
        .getInfo(url)
        .then((result) => {
        return {
            title: result.videoDetails.title,
            length: parseInt(result.videoDetails.lengthSeconds, 10),
            author: result.videoDetails.author.name,
            thumbnail: result.videoDetails.thumbnails[result.videoDetails.thumbnails.length - 1].url,
            url,
        };
    })
        .catch(() => {
        throw "❌ Error";
    });
});
exports.getVideoDetails = getVideoDetails;
// Lấy danh sách video và thông tin 1 playlist
const getPlaylist = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = url.split("?")[1].split("=")[1];
        const playlist = yield ytpl_1.default(id);
        const resources = [];
        playlist.items.forEach((item) => {
            resources.push({
                title: item.title,
                thumbnail: item.bestThumbnail.url,
                author: item.author.name,
                url: item.shortUrl,
                length: item.durationSec,
            });
        });
        return {
            title: playlist.title,
            thumbnail: playlist.bestThumbnail.url,
            author: playlist.author.name,
            resources,
        };
    }
    catch (e) {
        throw "❌ Invalid playlist!";
    }
});
exports.getPlaylist = getPlaylist;
