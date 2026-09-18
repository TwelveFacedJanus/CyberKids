// src/data/messenger/stories/class7.ts
import { ASSETS } from "../assets";
import type { Story } from "../../../types/messenger";

export const class7Story: Story = {
  id: "class7",
  chatId: "class7",
  autoStart: true,
  initialMessages: [
    {
      type: "meme",
      from: "them",
      img: ASSETS.memes.m1,
      caption: "когда сделал домашку за 5 минут до урока",
      senderName: "Дима Котов",
      senderAvatar: ASSETS.avatars.class_m1,
    },
    {
      type: "text",
      from: "them",
      text: "😂😂😂 ЖИЗА",
      senderName: "Настя П.",
      senderAvatar: ASSETS.avatars.class_m2,
    },
    {
      type: "meme",
      from: "them",
      img: ASSETS.memes.m2,
      caption: "училка по физре сегодня",
      senderName: "Артём Носов",
      senderAvatar: ASSETS.avatars.class_m3,
    },
    {
      type: "text",
      from: "them",
      text: "кто зумом сегодня контрольную писал",
      senderName: "Настя П.",
      senderAvatar: ASSETS.avatars.class_m2,
    },
    {
      type: "meme",
      from: "them",
      img: ASSETS.memes.m3,
      senderName: "Дима Котов",
      senderAvatar: ASSETS.avatars.class_m1,
    },
    {
      type: "text",
      from: "them",
      text: "ору 💀💀💀",
      senderName: "Лиза К.",
      senderAvatar: ASSETS.avatars.class_m4,
    },
  ],
  choices: [],
};