// src/context/MessengerContext.tsx
import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type {
  Chat,
  ChatFilter,
  Message,
  Choice,
  QuestProgress,
} from "../types/messenger";
import { sleep, pad } from "../components/messenger/utils";
import { ASSETS } from "../data/messenger/assets";

// ============ STATE ============
interface State {
  chats: Record<string, Chat>;
  chatOrder: string[];
  activeChatId: string | null;
  filterMode: ChatFilter;
  progress: QuestProgress;
  clock: { h: number; m: number };
  pendingChoice: {
    chatId: string;
    title: string;
    description?: string;
    options: Choice[];
  } | null;
}

type Action =
  | { type: "SET_ACTIVE"; payload: string | null }
  | { type: "SET_FILTER"; payload: ChatFilter }
  | { type: "ADD_MESSAGE"; payload: { chatId: string; message: Message } }
  | { type: "SET_MESSAGES"; payload: { chatId: string; messages: Message[] } }
  | { type: "MARK_READ"; payload: string }
  | { type: "REVEAL_CHAT"; payload: string }
  | {
      type: "SET_CHOICES";
      payload: { chatId: string; choices: Choice[] | null };
    }
  | { type: "SET_PROGRESS"; payload: Partial<QuestProgress> }
  | { type: "TICK_CLOCK" }
  | {
      type: "SET_PENDING_CHOICE";
      payload: State["pendingChoice"];
    }
  | { type: "CLEAR_PENDING_CHOICE" }
  | { type: "MARK_STORY_STARTED"; payload: string }
  | { type: "MARK_STORY_DONE"; payload: string }
  | {
      type: "MARK_MESSAGE_LISTENED";
      payload: { chatId: string; messageId: string };
    }
  | {
      type: "SET_CHAT_PENDING_CHOICE";
      payload: { chatId: string; pending: Chat["pendingChoice"] };
    }
  | { type: "RESET" };

function createInitialState(): State {
  const chats: Record<string, Chat> = {
    andrey: {
      id: "andrey",
      name: "Андрей",
      status: "был(-а) в сети недавно",
      avatarKey: ASSETS.avatars.andrey,
      hidden: false,
      unread: 0,
      messages: [],
      locked: false,
      choices: null,
    },
    mama: {
      id: "mama",
      name: "Мама",
      status: "была в сети недавно",
      avatarKey: ASSETS.avatars.mama,
      hidden: false,
      unread: 0,
      messages: [],
      locked: false,
      choices: null,
    },
    class7: {
      id: "class7",
      name: "7 Ы класс",
      status: "24 участника",
      avatarKey: ASSETS.avatars.class7,
      hidden: false,
      unread: 0,
      messages: [],
      locked: false,
      choices: null,
      isGroup: true,
    },
    fsb: {
      id: "fsb",
      name: "Сотрудник ФСБ",
      status: "на связи",
      avatarKey: ASSETS.avatars.fsb,
      hidden: false,
      unread: 0,
      messages: [],
      locked: false,
      choices: null,
    },
    vova: {
      id: "vova",
      name: "Вова А14",
      status: "был(-а) в сети только что",
      avatarKey: ASSETS.avatars.vova,
      hidden: true,
      unread: 0,
      messages: [],
      locked: false,
      choices: null,
    },
  };

  return {
    chats,
    chatOrder: ["andrey", "mama", "class7", "fsb", "vova"],
    activeChatId: null,
    filterMode: "all",
    progress: { andrey: false, mama: false, vova: false },
    clock: { h: 16, m: 39 },
    pendingChoice: null,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ACTIVE":
      return { ...state, activeChatId: action.payload };

    case "SET_FILTER":
      return { ...state, filterMode: action.payload };

    case "ADD_MESSAGE": {
      const { chatId, message } = action.payload;
      const chat = state.chats[chatId];
      if (!chat) return state;

      const shouldIncrementUnread =
        message.type !== "daysep" &&
        "from" in message &&
        message.from !== "me" &&
        state.activeChatId !== chatId;

      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: {
            ...chat,
            messages: [...chat.messages, message],
            unread: shouldIncrementUnread ? chat.unread + 1 : chat.unread,
          },
        },
      };
    }

    case "SET_MESSAGES": {
      const { chatId, messages } = action.payload;
      const chat = state.chats[chatId];
      if (!chat) return state;
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: { ...chat, messages },
        },
      };
    }

    case "MARK_READ":
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload]: { ...state.chats[action.payload], unread: 0 },
        },
      };

    case "REVEAL_CHAT":
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload]: {
            ...state.chats[action.payload],
            hidden: false,
            _flash: true,
          },
        },
      };

    case "SET_CHOICES": {
      const { chatId, choices } = action.payload;
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: { ...state.chats[chatId], choices },
        },
      };
    }

    case "SET_PROGRESS":
      return { ...state, progress: { ...state.progress, ...action.payload } };

    case "TICK_CLOCK": {
      let { h, m } = state.clock;
      m += 1 + Math.floor(Math.random() * 3);
      if (m >= 60) {
        m -= 60;
        h = (h + 1) % 24;
      }
      return { ...state, clock: { h, m } };
    }

    case "SET_PENDING_CHOICE":
      return { ...state, pendingChoice: action.payload };

    case "CLEAR_PENDING_CHOICE":
      return { ...state, pendingChoice: null };

    case "MARK_STORY_STARTED":
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload]: {
            ...state.chats[action.payload],
            storyStarted: true,
          },
        },
      };

    case "MARK_STORY_DONE":
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload]: {
            ...state.chats[action.payload],
            storyDone: true,
          },
        },
      };

    case "MARK_MESSAGE_LISTENED": {
      const { chatId, messageId } = action.payload;
      const chat = state.chats[chatId];
      if (!chat) return state;
      const messages = chat.messages.map((m) =>
        m.id === messageId && m.type === "audio" ? { ...m, listened: true } : m,
      );
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: { ...chat, messages },
        },
      };
    }

    case "SET_CHAT_PENDING_CHOICE": {
      const { chatId, pending } = action.payload;
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: { ...state.chats[chatId], pendingChoice: pending },
        },
      };
    }

    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}

// ============ CONTEXT ============
interface MessengerContextValue {
  state: State;
  dispatch: Dispatch<Action>;
  nextTime: () => string;
  addMessage: (
    chatId: string,
    msg: Omit<Message, "time" | "id"> & { time?: string; id?: string },
    opts?: { typing?: boolean },
  ) => Promise<void>;
  setChoices: (chatId: string, choices: Choice[] | null) => void;
  revealChat: (chatId: string) => void;
  openChat: (chatId: string) => void;
  showChoiceModal: (params: {
    chatId: string;
    title: string;
    description?: string;
    options: Choice[];
  }) => void;
  hideChoiceModal: () => void;
  markMessageListened: (chatId: string, messageId: string) => void;
  setChatPendingChoice: (
    chatId: string,
    pending: Chat["pendingChoice"],
  ) => void;
  openPendingChoiceModal: (chatId: string) => void;
}

const MessengerContext = createContext<MessengerContextValue | undefined>(
  undefined,
);

export function MessengerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const nextTime = (): string => {
    let { h, m } = state.clock;
    m += 1 + Math.floor(Math.random() * 3);
    if (m >= 60) {
      m -= 60;
      h = (h + 1) % 24;
    }
    return pad(h) + ":" + pad(m);
  };

  const addMessage = async (
    chatId: string,
    msg: Omit<Message, "time" | "id"> & { time?: string; id?: string },
    opts: { typing?: boolean } = {},
  ): Promise<void> => {
    const time = msg.time || nextTime();
    const id =
      msg.id || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const fullMsg = { ...msg, time, id } as Message;

    const showTyping =
      opts.typing !== false && "from" in fullMsg && fullMsg.from === "them";

    if (showTyping) {
      await sleep(400 + Math.random() * 300);
    }

    dispatch({ type: "ADD_MESSAGE", payload: { chatId, message: fullMsg } });
  };

  const setChoices = (chatId: string, choices: Choice[] | null) => {
    dispatch({ type: "SET_CHOICES", payload: { chatId, choices } });
  };

  const revealChat = (chatId: string) => {
    dispatch({ type: "REVEAL_CHAT", payload: chatId });
  };

  const openChat = (chatId: string) => {
    dispatch({ type: "SET_ACTIVE", payload: chatId });
    dispatch({ type: "MARK_READ", payload: chatId });
  };

  const showChoiceModal = (params: {
    chatId: string;
    title: string;
    description?: string;
    options: Choice[];
  }) => {
    dispatch({ type: "SET_PENDING_CHOICE", payload: params });
  };

  const hideChoiceModal = () => {
    dispatch({ type: "CLEAR_PENDING_CHOICE" });
  };

  const markMessageListened = (chatId: string, messageId: string) => {
    dispatch({
      type: "MARK_MESSAGE_LISTENED",
      payload: { chatId, messageId },
    });
  };

  const setChatPendingChoice = (
    chatId: string,
    pending: Chat["pendingChoice"],
  ) => {
    dispatch({
      type: "SET_CHAT_PENDING_CHOICE",
      payload: { chatId, pending },
    });
  };

  const openPendingChoiceModal = (chatId: string) => {
    const chat = state.chats[chatId];
    if (!chat?.pendingChoice) return;

    const { title, description, options } = chat.pendingChoice;

    // Показываем модалку
    showChoiceModal({
      chatId,
      title,
      description,
      options: options.map((opt) => ({
        ...opt,
        action: () => {
          // Очищаем pendingChoice
          dispatch({
            type: "SET_CHAT_PENDING_CHOICE",
            payload: { chatId, pending: null },
          });
          opt.action();
        },
      })),
    });

    // Очищаем pendingChoice в чате
    dispatch({
      type: "SET_CHAT_PENDING_CHOICE",
      payload: { chatId, pending: null },
    });
  };

  return (
    <MessengerContext.Provider
      value={{
        state,
        dispatch,
        nextTime,
        addMessage,
        setChoices,
        revealChat,
        openChat,
        showChoiceModal,
        hideChoiceModal,
        markMessageListened,
        setChatPendingChoice,
        openPendingChoiceModal,
      }}
    >
      {children}
    </MessengerContext.Provider>
  );
}

export function useMessenger(): MessengerContextValue {
  const ctx = useContext(MessengerContext);
  if (!ctx)
    throw new Error("useMessenger must be used within MessengerProvider");
  return ctx;
}
