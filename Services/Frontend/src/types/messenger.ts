// src/types/messenger.ts

export type MessageFrom = "me" | "them";
export type ChatFilter = "all" | "unread";

export interface Chat {
  id: string;
  name: string;
  status: string;
  avatarKey?: string;
  hidden: boolean;
  unread: number;
  messages: Message[];
  locked: boolean;
  choices: Choice[] | null;
  isGroup?: boolean;
  _flash?: boolean;
  storyStarted?: boolean;
  storyDone?: boolean;
  listenDone?: boolean;
  pendingChoice?: {
    title: string;
    description?: string;
    options: StoryOption[];
  } | null;
}

export type Message =
  | TextMessage
  | AudioMessage
  | MemeMessage
  | LessonCardMessage
  | TransferMessage
  | RecapMessage
  | QuizMessage
  | DaySepMessage;

interface BaseMessage {
  id: string;
  time?: string;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  from: MessageFrom;
  text: string;
  fromChoice?: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export interface AudioMessage extends BaseMessage {
  type: "audio";
  from: MessageFrom;
  src: string;
  duration?: string;
  transcript?: string;
  senderName?: string;
  senderAvatar?: string;
  listened?: boolean;
  requiresListen?: boolean;
}

export interface MemeMessage extends BaseMessage {
  type: "meme";
  from: MessageFrom;
  img: string;
  caption?: string;
  senderName?: string;
  senderAvatar?: string;
}

export interface LessonCardMessage extends BaseMessage {
  type: "card";
  from: MessageFrom;
  tone: "green" | "red" | "blue" | "gray";
  icon?: string;
  title?: string;
  text?: string;
  rule?: string;
  ruleLabel?: string;
  button?: { label: string; action: string };
}

export interface TransferMessage extends BaseMessage {
  type: "transfer";
  from: MessageFrom;
  amount: string;
  to: string;
}

export interface RecapMessage extends BaseMessage {
  type: "recap";
  from: MessageFrom;
  items: Array<{ icon: string; title: string; text: string }>;
}

export interface QuizMessage extends BaseMessage {
  type: "quiz";
  from: MessageFrom;
  question: string;
  options: Array<{ label: string; correct: boolean }>;
}

export interface DaySepMessage {
  id: string;
  type: "daysep";
  text: string;
}

export interface Choice {
  label: string;
  shortLabel?: string;
  hint?: string;
  icon?: string;
  style: "good" | "bad" | "neutral";
  action: () => void | Promise<void>;
}

export interface QuestProgress {
  andrey: boolean;
  mama: boolean;
  vova: boolean;
}

export interface QuestState {
  chats: Record<string, Chat>;
  chatOrder: string[];
  activeChatId: string | null;
  filterMode: ChatFilter;
  progress: QuestProgress;
  clock: { h: number; m: number };
}

// ============ STORY ENGINE ============

export interface Story {
  id: string;
  chatId: string;
  hidden?: boolean;
  autoStart?: boolean;
  listenToOpenModal?: boolean;
  choiceTitle?: string;
  choiceDescription?: string;
  initialMessages?: Omit<Message, "time">[];
  initialChoices?: StoryOption[];
  choices: StoryChoiceSet[];
  finalScene?: (messenger: any) => Promise<void>;
}

export interface StoryChoiceSet {
  id: string;
  title: string;
  description?: string;
  options: StoryOption[];
}

export interface StoryOption {
  label: string;
  shortLabel?: string;
  hint?: string;
  icon?: string;
  style: "good" | "bad" | "neutral";
  hideText?: boolean;
  messages?: Omit<Message, "time">[];
  setProgress?: keyof QuestProgress;
  evidence?: Omit<Message, "time">;
  revealChat?: string;
  returnToChoice?: string;
  checkComplete?: boolean;
}