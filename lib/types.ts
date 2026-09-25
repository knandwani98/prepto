export type KitStatus =
  | "queued"
  | "researching"
  | "generating"
  | "ready"
  | "failed";

export type QuestionCategory =
  | "behavioral"
  | "technical"
  | "role"
  | "company"
  | "curveball";

export type Difficulty = "easy" | "medium" | "hard";

export type FlashcardMark = "known" | "unknown";
export type SelfRating = "knew" | "kinda" | "didnt";

export interface CompanyBrief {
  name: string;
  whatTheyDo: string;
  culture: string;
  products: string[];
  hiringSignals: string[];
}

export interface RoleBreakdown {
  title: string;
  summary: string;
  mustHaves: string[];
  niceToHaves: string[];
  interviewLoop: string[];
  successLooksLike: string;
}

export interface KitQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  whyAsked: string;
  talkingPoints: string[];
  difficulty: Difficulty;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
}

export interface QuizItem {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
}

export interface ScheduleTask {
  id: string;
  label: string;
  relatedIds: string[];
}

export interface ScheduleDay {
  day: number;
  focus: string;
  tasks: ScheduleTask[];
}

export interface GeneratedKit {
  companyBrief: CompanyBrief;
  roleBreakdown: RoleBreakdown;
  questions: KitQuestion[];
  flashcards: Flashcard[];
  quiz: QuizItem[];
  schedule: ScheduleDay[];
}

export interface CrawledPage {
  url: string;
  title: string;
  text: string;
}

export interface SearchSnippet {
  title: string;
  url: string;
  description: string;
}

export interface KitInput {
  jobDescription: string;
  companyUrl: string;
  companyName?: string;
  daysUntilInterview: number;
}

export interface KitResearch {
  pages: CrawledPage[];
  snippets: SearchSnippet[];
  interviewProcessInferred: boolean;
}

export interface KitPractice {
  flashcards: Record<string, FlashcardMark>;
  quizResults: { questionId: string; correct: boolean; answeredAt: string }[];
  shortAnswerRatings: { questionId: string; rating: SelfRating }[];
}

export interface Kit {
  id: string;
  clerkUserId: string;
  status: KitStatus;
  input: KitInput;
  research?: KitResearch;
  kit?: GeneratedKit;
  error?: string;
  practice?: KitPractice;
  pinnedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KitListItem {
  id: string;
  status: KitStatus;
  pinnedAt?: string | null;
  createdAt: string;
  companyName: string | null;
  roleTitle: string | null;
}

export interface KitListPage {
  pinned: KitListItem[];
  kits: KitListItem[];
  nextCursor: string | null;
}

export type RegenerableSection = keyof GeneratedKit;

export interface CreateKitPayload {
  jobDescription: string;
  companyUrl: string;
  daysUntilInterview: number;
  companyName?: string;
}
