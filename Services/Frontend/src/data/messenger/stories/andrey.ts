// src/data/messenger/stories/andrey.ts
import type { Story } from "../../../types/messenger";

export const andreyStory: Story = {
  id: "andrey",
  chatId: "andrey",
  choiceTitle: "Друг прислал ссылку на игру",
  choiceDescription:
    "Андрей утверждает, что нашёл новую игру и уже её скачал. Он просит тебя перейти по ссылке. Как поступишь?",
  initialMessages: [
    {
      type: "text",
      from: "them",
      text: "БРООО 😎 Я нашёл новую игру!\nОна сейчас у всех популярна.\nСкачай, пока бесплатно!",
    },
    {
      type: "text",
      from: "them",
      text: "🔗 https://game-super-free.ru/download",
    },
    {
      type: "text",
      from: "them",
      text: "Я уже скачал, всё норм. Переходи!",
    },
  ],
  initialChoices: [
    {
      label: "✅ Не открывать ссылку",
      shortLabel: "Не открывать",
      hint: "Безопаснее — сначала проверь, что это за сайт",
      icon: "🛡️",
      style: "good",
      messages: [
        {
          type: "text",
          from: "them",
          text: "Братан, НЕ СКАЧИВАЙ!!! У меня комп начал сильно тупить, я перепроверил что случилось — у меня теперь 67 вирусов на компе 😬",
        },
      ],
      setProgress: "andrey",
      evidence: {
        type: "card",
        from: "them",
        tone: "gray",
        icon: "🔎",
        title: "Улика №1 найдена: подозрительная ссылка 🔗",
        ruleLabel: "Правило",
        rule: "Не переходи по неизвестным ссылкам, даже если их прислал знакомый человек.",
      },
      checkComplete: true,
    },
    {
      label: "❌ Открыть ссылку",
      shortLabel: "Открыть",
      hint: "Может быть опасно — ссылка от неизвестного сайта",
      icon: "⚠️",
      style: "bad",
      messages: [
        {
          type: "card",
          from: "them",
          tone: "gray",
          icon: "🎮",
          title: "Игра почти установлена!",
          text: "Для продолжения войдите в свой аккаунт. Введите логин и пароль.",
        },
        {
          type: "card",
          from: "them",
          tone: "red",
          icon: "⚠️",
          title: "Стоп!",
          text: "Ты оказался на подозрительном сайте. Не вводи туда свои данные.",
        },
      ],
      returnToChoice: "andrey-main",
    },
  ],
  choices: [
    {
      id: "andrey-main",
      title: "Друг прислал ссылку на игру",
      description:
        "Андрей утверждает, что нашёл новую игру и уже её скачал. Как поступишь?",
      options: [
        {
          label: "✅ Не открывать ссылку",
          shortLabel: "Не открывать",
          hint: "Безопаснее — сначала проверь, что это за сайт",
          icon: "🛡️",
          style: "good",
          messages: [
            {
              type: "text",
              from: "them",
              text: "Братан, НЕ СКАЧИВАЙ!!! У меня комп начал сильно тупить — у меня теперь 67 вирусов 😬",
            },
          ],
          setProgress: "andrey",
          evidence: {
            type: "card",
            from: "them",
            tone: "gray",
            icon: "🔎",
            title: "Улика №1 найдена: подозрительная ссылка 🔗",
            ruleLabel: "Правило",
            rule: "Не переходи по неизвестным ссылкам, даже если их прислал знакомый человек.",
          },
          checkComplete: true,
        },
        {
          label: "❌ Открыть ссылку",
          shortLabel: "Открыть",
          hint: "Может быть опасно — ссылка от неизвестного сайта",
          icon: "⚠️",
          style: "bad",
          messages: [
            {
              type: "card",
              from: "them",
              tone: "gray",
              icon: "🎮",
              title: "Игра почти установлена!",
              text: "Для продолжения войдите в свой аккаунт.",
            },
            {
              type: "card",
              from: "them",
              tone: "red",
              icon: "⚠️",
              title: "Стоп!",
              text: "Ты оказался на подозрительном сайте. Не вводи туда свои данные.",
            },
          ],
          returnToChoice: "andrey-main",
        },
      ],
    },
  ],
};