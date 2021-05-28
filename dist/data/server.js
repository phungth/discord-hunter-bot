"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servers = void 0;
exports.servers = {};
// Mỗi máy chủ ta tạo trên Discord có 1 Object Server riêng có key là id của máy chủ đó.
// Object này sẽ lưu danh sách các bài hát đang chờ được phát "queue".
// Bài hát đang phát "playing".
// Dispatcher quản lí việc stream từ server bot tới Discord.
