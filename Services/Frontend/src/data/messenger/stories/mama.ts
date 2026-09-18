// src/data/messenger/stories/mama.ts
import { ASSETS } from "../assets";
import type { Story } from "../../../types/messenger";

export const mamaStory: Story = {
  id: "mama",
  chatId: "mama",
  choiceTitle: "Мама просит срочно перевести деньги",
  choiceDescription:
    "Мама пишет, что стоит на кассе и ей не хватает 2000 ₽. Просит перевести на незнакомый номер как можно быстрее.",
  initialMessages: [
    {
      type: "text",
      from: "them",
      text: "Привет! Сынок, срочно переведи мне 2000 ₽ 🙏\nЯ сейчас на пункте выдачи OZON и у меня не хватает денег на счету. Тут в очереди за мной много людей, и я не хочу их задерживать.",
    },
    {
      type: "text",
      from: "them",
      text: "Вот номер, на который нужно отправить деньги:\n+7 999 123-45-67\n\nТолько быстро, пожалуйста!",
    },
  ],
  initialChoices: [
    {
      label: "📞 Позвонить маме и проверить",
      shortLabel: "Позвонить маме",
      hint: "Сначала убедись, что это действительно она",
      icon: "📞",
      style: "good",
      messages: [
        {
          type: "audio",
          from: "them",
          src: ASSETS.audio.mama_call,
          duration: "0:07",
          transcript:
            "Что? Я никаких денег не просила! 😳 Хорошо, что ты сначала проверил.",
        },
      ],
      setProgress: "mama",
      evidence: {
        type: "card",
        from: "them",
        tone: "gray",
        icon: "🔎",
        title: "Улика №2 найдена: неизвестный получатель 💸",
        ruleLabel: "Правило",
        rule: "Перед переводом всегда проверяй номер и имя получателя.",
      },
      revealChat: "vova",
      checkComplete: true,
    },
    {
      label: "💸 Сразу перевести",
      shortLabel: "Перевести деньги",
      hint: "Рискованно — номер может принадлежать мошенникам",
      icon: "💸",
      style: "bad",
      messages: [
        {
          type: "transfer",
          from: "me",
          amount: "2 000",
          to: "+7 999 123-45-67",
        },
        {
          type: "text",
          from: "them",
          text: "Какие деньги?! Я ничего не просила! Надеюсь, ты не успел перевести им деньги?",
        },
        {
          type: "card",
          from: "them",
          tone: "blue",
          icon: "🔎",
          title: "Проверка получателя",
          text: 'Имя получателя при переводе оказалось «Иван Петров», а не «Мама».',
        },
        {
          type: "card",
          from: "them",
          tone: "red",
          icon: "⚠️",
          title: "Ты попался!",
          text: "Даже если сообщение выглядит как сообщение от знакомого, сначала нужно проверить получателя.",
        },
      ],
      returnToChoice: "mama-main",
    },
  ],
  choices: [
    {
      id: "mama-main",
      title: "Мама просит срочно перевести деньги",
      description:
        "Мама пишет, что стоит на кассе и ей не хватает 2000 ₽. Как поступишь?",
      options: [
        {
          label: "📞 Позвонить маме и проверить",
          shortLabel: "Позвонить маме",
          hint: "Сначала убедись, что это действительно она",
          icon: "📞",
          style: "good",
          messages: [
            {
              type: "audio",
              from: "them",
              src: ASSETS.audio.mama_call,
              duration: "0:07",
              transcript:
                "Что? Я никаких денег не просила! 😳 Хорошо, что ты сначала проверил.",
            },
          ],
          setProgress: "mama",
          evidence: {
            type: "card",
            from: "them",
            tone: "gray",
            icon: "🔎",
            title: "Улика №2 найдена: неизвестный получатель 💸",
            ruleLabel: "Правило",
            rule: "Перед переводом всегда проверяй номер и имя получателя.",
          },
          revealChat: "vova",
          checkComplete: true,
        },
        {
          label: "💸 Сразу перевести",
          shortLabel: "Перевести деньги",
          hint: "Рискованно — номер может принадлежать мошенникам",
          icon: "💸",
          style: "bad",
          messages: [
            { type: "transfer", from: "me", amount: "2 000", to: "+7 999 123-45-67" },
            {
              type: "text",
              from: "them",
              text: "Какие деньги?! Я ничего не просила!",
            },
            {
              type: "card",
              from: "them",
              tone: "red",
              icon: "⚠️",
              title: "Ты попался!",
              text: "Сначала проверяй получателя, потом отправляй деньги.",
            },
          ],
          returnToChoice: "mama-main",
        },
      ],
    },
  ],
};