// src/hooks/useStoryEngine.ts
import { useEffect, useRef } from "react";
import { useMessenger } from "../context/MessengerContext";
import { andreyStory } from "../data/messenger/stories/andrey";
import { mamaStory } from "../data/messenger/stories/mama";
import { vovaStory } from "../data/messenger/stories/vova";
import { fsbStory } from "../data/messenger/stories/fsb";
import { class7Story } from "../data/messenger/stories/class7";
import { api } from "../api/client";
import type { Story, StoryOption, Choice } from "../types/messenger";

const STORIES: Story[] = [andreyStory, mamaStory, vovaStory, fsbStory, class7Story];

const DELAY_BETWEEN_MESSAGES = 1200;
const DELAY_BEFORE_MODAL = 1500;
const DELAY_AFTER_CHOICE = 400;

export function useStoryEngine() {
  const messenger = useMessenger();
  const runningRef = useRef<Set<string>>(new Set());
  const shownModalsRef = useRef<Set<string>>(new Set());

  // 🆕 Следим за прослушкой аудио ТОЛЬКО в чатах с listenToOpenModal
  useEffect(() => {
    for (const story of STORIES) {
      if (!story.listenToOpenModal) continue;
      if (shownModalsRef.current.has(story.chatId)) continue;

      const chat = messenger.state.chats[story.chatId];
      if (!chat || !chat.pendingChoice || chat.hidden) continue;

      const audiosToListen = chat.messages.filter(
        (m) => m.type === "audio" && (m as any).requiresListen,
      );

      // Нет аудио — не наша забота
      if (audiosToListen.length === 0) continue;

      const listenedCount = audiosToListen.filter((m) => (m as any).listened).length;
      const allListened = listenedCount === audiosToListen.length;

      if (allListened) {
        console.log(
          `[ALEX] ✅ Все аудио прослушаны (${listenedCount}/${audiosToListen.length}), открываю модалку для ${story.chatId}`,
        );
        shownModalsRef.current.add(story.chatId);
        messenger.openPendingChoiceModal(story.chatId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messenger.state.chats]);

  const startStoryIfNeeded = async (chatId: string) => {
    const chat = messenger.state.chats[chatId];
    if (!chat) return;
    if (chat.storyStarted || chat.storyDone) return;
    if (runningRef.current.has(chatId)) return;

    const story = STORIES.find((s) => s.chatId === chatId);
    if (!story) return;

    runningRef.current.add(chatId);
    messenger.dispatch({ type: "MARK_STORY_STARTED", payload: chatId });
    await runStoryMessages(story);
    runningRef.current.delete(chatId);
  };

  const autoStartStories = async () => {
    for (const story of STORIES) {
      if (!story.autoStart) continue;
      const chat = messenger.state.chats[story.chatId];
      if (!chat || chat.hidden) continue;
      if (chat.storyStarted || chat.storyDone) continue;
      await startStoryIfNeeded(story.chatId);
    }
  };

  const runStoryMessages = async (story: Story) => {
    if (!story.initialMessages || story.initialMessages.length === 0) return;

    // Day separator
    await messenger.addMessage(
      story.chatId,
      { type: "daysep", text: "Сегодня" },
      { typing: false },
    );

    // Каждое сообщение
    for (let i = 0; i < story.initialMessages.length; i++) {
      const msg = story.initialMessages[i];

      if (i > 0 && msg.from === "them") {
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_MESSAGES));
      }

      // Добавляем requiresListen для аудио, если нужно
      const enrichedMsg =
        story.listenToOpenModal && msg.type === "audio"
          ? { ...msg, requiresListen: true, listened: false }
          : msg;

      await messenger.addMessage(story.chatId, enrichedMsg as any, {
        typing: false,
      });
    }

    // Откладываем модалку
    if (story.initialChoices && story.listenToOpenModal) {
      console.log(
        `[ALEX] Откладываю модалку для ${story.chatId} до прослушки аудио`,
      );
      messenger.setChatPendingChoice(story.chatId, {
        title: story.choiceTitle || "Прими решение",
        description: story.choiceDescription,
        options: story.initialChoices,
      });
      // Модалка откроется из useEffect, когда все аудио будут прослушаны
    } else if (story.initialChoices) {
      await new Promise((r) => setTimeout(r, DELAY_BEFORE_MODAL));
      showChoice(story, story.initialChoices, story.choiceTitle, story.choiceDescription);
    }
  };

  const showChoice = (
    story: Story,
    options: StoryOption[],
    title?: string,
    description?: string,
  ) => {
    const choices: Choice[] = options.map((opt) => ({
      ...opt,
      action: () => handleChoice(story, opt),
    }));

    messenger.showChoiceModal({
      chatId: story.chatId,
      title: title || "Прими решение",
      description,
      options: choices,
    });
  };

  const handleChoice = async (story: Story, opt: StoryOption) => {
    messenger.setChoices(story.chatId, null);

    if (!opt.hideText) {
      await messenger.addMessage(
        story.chatId,
        {
          type: "text",
          from: "me",
          text: opt.label,
          fromChoice: true,
        },
        { typing: false },
      );
      await new Promise((r) => setTimeout(r, DELAY_AFTER_CHOICE));
    }

    if (opt.messages) {
      for (const msg of opt.messages) {
        if (msg.from === "them") {
          await new Promise((r) => setTimeout(r, DELAY_BETWEEN_MESSAGES));
        }
        await messenger.addMessage(story.chatId, msg, { typing: false });
      }
    }

    if (opt.setProgress) {
      messenger.dispatch({
        type: "SET_PROGRESS",
        payload: { [opt.setProgress]: true },
      });
    }

    if (opt.evidence) {
      await messenger.addMessage("fsb", opt.evidence, { typing: false });
    }

    if (opt.revealChat) {
      messenger.revealChat(opt.revealChat);
      setTimeout(() => autoStartStories(), 500);
    }

    if (opt.returnToChoice) {
      const choiceSet = story.choices.find((c) => c.id === opt.returnToChoice);
      if (choiceSet) {
        await new Promise((r) => setTimeout(r, DELAY_BEFORE_MODAL));
        showChoice(story, choiceSet.options, choiceSet.title, choiceSet.description);
      }
    }

    if (opt.checkComplete) {
      await checkComplete();
    }

    if (opt.checkComplete || opt.setProgress) {
      messenger.dispatch({ type: "MARK_STORY_DONE", payload: story.chatId });
    }
  };

  const checkComplete = async () => {
    const { progress } = messenger.state;
    if (progress.andrey && progress.mama && progress.vova) {
      await fsbStory.finalScene?.(messenger);
      try {
        await api.post("/api/quests/alex/complete", { progress, score: 60 });
      } catch (e) {
        console.error("Не удалось сохранить прогресс квеста", e);
      }
    }
  };

  const init = async () => {
    console.log("[ALEX] Story engine ready");
    await autoStartStories();
  };

  return { init, startStoryIfNeeded, autoStartStories };
}