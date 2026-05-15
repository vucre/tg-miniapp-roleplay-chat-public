# TG Mini App - 角色扮演聊天室

基于 Telegram Mini App 的多角色扮演实时聊天应用。

## 功能特点

- 多个预设角色（魔法少女、赛博朋克黑客、古代武士、科幻AI、温柔女友）
- 实时聊天界面
- Telegram 用户一键登录
- 消息气泡 + 头像 + 时间戳
- 完整 Docker 部署支持

## 快速开始

```bash
git clone https://github.com/vucre/tg-miniapp-roleplay-chat-public.git
cd tg-miniapp-roleplay-chat-public
npm install
npm run dev
```

然后在 BotFather 设置 Web App URL 即可使用。

## Docker 部署

```bash
docker-compose up -d --build
```

详细配置请查看 `docker-compose.yml` 和 `Dockerfile`。

## 技术栈

- React 18 + Vite + TypeScript + Tailwind
- Telegram WebApp SDK
- Supabase (optional, 用于实时聊天)
- Docker + Nginx

## 授权

MIT