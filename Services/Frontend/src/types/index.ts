export type AgeGroup = 'junior' | 'middle' | 'senior'
export type TaskType =
  | 'dragdrop'
  | 'drag3d'
  | 'quiz'
  | 'sort'
  | 'true_false'
  | 'scenario'
  | 'theory_cards'
  | 'scam_banner'
  | 'scam_chat'
  | 'scam_chain'
  | 'scam_phishing'
  | 'scam_defender'
  | 'quick_test'

export interface User {
  id: string
  username: string
  full_name: string
  age_group: AgeGroup
  roles: string[]
  groups: string[]
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Task {
  id: string
  title: string
  description: string
  instructions: string
  topic: string
  imagePath?: string | null
  imageB64?: string | null
  task_type: TaskType
  age_groups: AgeGroup[]
  forbidden_groups: string[]
  points: number
  emoji: string
  color: string
  order: number
  is_enabled: boolean
}

export interface TaskFull extends Task {
  content: TaskContent
}

export interface Section {
  id: string
  label: string
  emoji?: string
  icon?: string
}

export interface Item {
  id: string
  text: string
  section: string
  emoji?: string
}

export interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  explanation?: string
}

export interface Statement {
  id: string
  statement: string
  is_true: boolean
  explanation?: string
}

export interface Scenario {
  id: string
  title: string
  description: string
  options: string[]
  correct: number
  explanation?: string
}

export interface TaskContent {
  sections?: Section[]
  items?: Item[]
  questions?: Question[]
  statements?: Statement[]
  scenarios?: Scenario[]
  cards?: TheoryCard[]
  title?: string
  description?: string
  examples?: string[]
  messages?: Array<{
    id: string;
    user: string;
    avatar: string;
    text: string;
    isScam: boolean;
    explanation?: string;
  }>;
  signs?: Array<{
    id: string;
    text: string;
    isSuspicious: boolean;
  }>;
  steps?: Array<{
    id: string;
    title?: string;
    emoji?: string;
    text?: string;
    description?: string;
    correct?: number;
    options?: string[];
    explanation?: string;
  }>;
  options?: string[][];
  test_title?: string;
}

export interface TheoryCard {
  id: string
  emoji: string
  title: string
  text: string
  color: string
}

export interface TheoryContent {
  title: string
  sections: Array<{ title: string; text: string }>
}

export interface Answer {
  key: string;
  value:
    | string
    | number
    | boolean
    | string[]
    | Record<string, unknown>;
}

export interface Result {
  id: string
  user_id: string
  task_id: string
  task_title: string
  task_type: string
  topic: string
  score: number
  max_score: number
  correct_count: number
  total_count: number
  completed_at: string
  answers?: AnswerDetail[]
  score_added?: number
}

export interface ResultDetailed extends Result {
  answers: AnswerDetail[]
  username: string
  full_name: string
}

export interface TopicStat {
  topic: string
  attempts: number
  avg_score_percent: number
  best_score_percent: number
}

export interface Stats {
  total_users: number
  total_attempts: number
  total_completed_tasks: number
  avg_score_percent: number
  by_age_group: Record<string, number>
  by_topic: TopicStat[]
  hardest_tasks: Array<{ task_id: string; title: string; attempts: number; avg_score_percent: number }>
}

export interface AnswerDetail {
  correct: boolean
  expected: unknown
  chosen: unknown
  item_id?: string
  question_id?: string
  statement_id?: string
  scenario_id?: string
}

export interface ResultWithDetails extends Result {
  answers: AnswerDetail[]
}

export interface Group {
  id: string
  name: string
  description: string
  user_ids: string[]
  user_count: number
  created_at: string
  created_by?: string
}

export interface GroupCreate {
  name: string
  description: string
  user_ids: string[]
}

export interface GroupUpdate {
  name?: string
  description?: string
  user_ids?: string[]
}