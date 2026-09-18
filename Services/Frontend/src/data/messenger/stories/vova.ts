// src/data/messenger/stories/vova.ts
import { ASSETS } from "../assets";
import type { Story } from "../../../types/messenger";

export const vovaStory: Story = {
  id: "vova",
  chatId: "vova",
  hidden: true,
  autoStart: true,
  listenToOpenModal: true,
  choiceTitle: "Незнакомец обещает приз",
  choiceDescription:
    "Вова А14 пишет, что ты выиграл 100 000 ₽ в его конкурсе, и просит номер твоей банковской карты для получения приза.",
  initialMessages: [
    {
      type: "audio",
      from: "them",
      src: ASSETS.audio.vova1,
      duration: "0:04",
      transcript: "Привет! 🎉 Ты выиграл в моём конкурсе!",
    },
    {
      type: "audio",
      from: "them",
      src: ASSETS.audio.vova2,
      duration: "0:05",
      transcript: "Твой приз составляет целых сто тысяч рублей! 🪙🔥",
    },
    {
      type: "audio",
      from: "them",
      src: ASSETS.audio.vova3,
      duration: "0:06",
      transcript:
        "Чтобы получить приз, просто отправь мне номер своей банковской карты.",
    },
  ],
  initialChoices: [
    {
      label: "🚫 Не отправлять данные",
      shortLabel: "Не отправлять",
      hint: "Настоящие конкурсы не просят данные карты",
      icon: "🛡️",
      style: "good",
      messages: [
        {
          type: "audio",
          from: "them",
          src: ASSETS.audio.vova_good,
          duration: "0:07",
          transcript:
            "Подожди, никаких данных карты отправлять не нужно 😅 Настоящие конкурсы не должны требовать банковские данные через личные сообщения.",
        },
        {
          type: "card",
          from: "them",
          tone: "gray",
          icon: "🔍",
          title: "",
          text: "Хочешь проверить конкурс?",
        },
      ],
      setProgress: "vova",
      evidence: {
        type: "card",
        from: "them",
        tone: "gray",
        icon: "🔎",
        title: "Улика №3 найдена: подозрительный конкурс 🎁",
        ruleLabel: "Правило",
        rule: 'Не отправляй банковские данные ради «приза», особенно если тебя неожиданно объявили победителем.',
      },
      checkComplete: true,
    },
    {
      label: "💳 Отправить номер карты",
      shortLabel: "Отправить карту",
      hint: "Опасно — так данные попадут мошенникам",
      icon: "💳",
      style: "bad",
      messages: [
        { type: "text", from: "me", text: "💳 4532 12XX XXXX XXXX" },
        {
          type: "audio",
          from: "them",
          src: ASSETS.audio.vova_bad,
          duration: "0:05",
          transcript: "Спасибо! А теперь ещё срок действия и код с обратной стороны.",
        },
        {
          type: "card",
          from: "them",
          tone: "red",
          icon: "🚨",
          title: "СТОП!",
          text: "Ты уже отправил банковские данные мошеннику.",
        },
      ],
      returnToChoice: "vova-main",
    },
  ],
  choices: [
    {
      id: "vova-main",
      title: "Незнакомец обещает приз",
      description:
        "Вова А14 пишет, что ты выиграл 100 000 ₽, и просит номер карты. Как поступишь?",
      options: [
        {
          label: "🚫 Не отправлять данные",
          shortLabel: "Не отправлять",
          hint: "Настоящие конкурсы не просят данные карты",
          icon: "🛡️",
          style: "good",
          messages: [
            {
              type: "audio",
              from: "them",
              src: ASSETS.audio.vova_good,
              duration: "0:07",
              transcript:
                "Никаких данных карты отправлять не нужно 😅",
            },
          ],
          setProgress: "vova",
          evidence: {
            type: "card",
            from: "them",
            tone: "gray",
            icon: "🔎",
            title: "Улика №3 найдена: подозрительный конкурс 🎁",
            ruleLabel: "Правило",
            rule: "Не отправляй банковские данные ради «приза».",
          },
          checkComplete: true,
        },
        {
          label: "💳 Отправить номер карты",
          shortLabel: "Отправить карту",
          hint: "Опасно — так данные попадут мошенникам",
          icon: "💳",
          style: "bad",
          messages: [
            { type: "text", from: "me", text: "💳 4532 12XX XXXX XXXX" },
            {
              type: "card",
              from: "them",
              tone: "red",
              icon: "🚨",
              title: "СТОП!",
              text: "Ты отправил данные карты мошеннику.",
            },
          ],
          returnToChoice: "vova-main",
        },
      ],
    },
  ],
};