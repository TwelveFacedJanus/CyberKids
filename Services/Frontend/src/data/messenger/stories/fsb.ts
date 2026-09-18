// src/data/messenger/stories/fsb.ts
import type { Story } from "../../../types/messenger";

export const fsbStory: Story = {
  id: "fsb",
  chatId: "fsb",
  autoStart: true,
  initialMessages: [
    {
      type: "text",
      from: "them",
      text: "Здравствуй. Я буду присматривать за твоей перепиской и присылать сюда разбор ситуаций после того, как ты сделаешь выбор в других чатах.\nВнимательно читай — здесь появятся все улики.",
    },
  ],
  choices: [],
  finalScene: async (messenger) => {
    await messenger.addMessage("fsb", {
      type: "text",
      from: "them",
      text: "🎉 Ты прошёл все проверки!",
    });

    await messenger.addMessage("fsb", {
      type: "recap",
      from: "them",
      items: [
        { icon: "🔗", title: "Ссылка", text: "Не открывай подозрительные ссылки." },
        { icon: "💸", title: "Деньги", text: "Всегда проверяй, кому отправляешь перевод." },
        { icon: "🎁", title: "Конкурс", text: "Не доверяй неожиданным «выигрышам»." },
      ],
    });

    await messenger.addMessage("fsb", {
      type: "card",
      from: "them",
      tone: "blue",
      icon: "🛡️",
      title: "Кибербезопасность",
      text: "Остановись. Проверь. Только потом действуй.",
    });

    await messenger.addMessage("fsb", {
      type: "quiz",
      from: "them",
      question: "Что объединяет все три ситуации?",
      options: [
        { label: "🔴 Нужно быстрее соглашаться", correct: false },
        {
          label:
            "🟢 Нельзя доверять сообщению только потому, что его прислал знакомый человек",
          correct: true,
        },
        { label: "🔵 Нужно всегда отправлять свои данные", correct: false },
      ],
    });
  },
};