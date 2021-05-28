import { StreamDispatcher } from "discord.js";

import { Resource } from "../services/youtube";

export interface Song {
  requester: string;
  resource: Resource;
}

interface Server {
  [key: string]: {
    playing?: {
      song: Song;
      startedAt: number;
    };
    queue: Song[];
    dispatcher?: StreamDispatcher;
  };
}

export const servers: Server = {};
// Mỗi máy chủ ta tạo trên Discord có 1 Object Server riêng có key là id của máy chủ đó.
// Object này sẽ lưu danh sách các bài hát đang chờ được phát "queue".
// Bài hát đang phát "playing".
// Dispatcher quản lí việc stream từ server bot tới Discord.
