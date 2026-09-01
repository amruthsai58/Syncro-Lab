// ─── Core Domain Types ─────────────────────────────────────────────────────

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Language = 'python' | 'java' | 'cpp' | 'javascript' | 'go';

export type VerdictStatus =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Runtime Error'
  | 'Compilation Error'
  | 'Pending'
  | 'Running';

export type RankTier =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Master';

// ─── User ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  displayName: string;
  deviceKey: string;
  rating: number;
  rankTier: RankTier;
  streakCount: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  createdAt: string;
  updatedAt: string;
  badges: Badge[];
  certificates?: Certificate[];
}

// ─── Problem ──────────────────────────────────────────────────────────────

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ProblemExample {
  input: string;
  output?: string | null;
  explanation?: string | null;
}

export interface StarterCode {
  python: string;
  java: string;
  cpp: string;
  javascript: string;
  go: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  tags: string[];
  companyTags: string[];
  hints: string[];
  starterCode: StarterCode;
  testCases: TestCase[];
  acceptanceRate: number;
  totalSubmissions: number;
  totalAccepted: number;
}

export interface ProblemListItem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  acceptanceRate: number;
  isSolved?: boolean;
  isAttempted?: boolean;
}

// ─── Submission ───────────────────────────────────────────────────────────

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  runtimeMs: number;
  memoryKb: number;
  actualOutput?: string;
  expectedOutput?: string;
  errorMessage?: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  problemSlug: string;
  language: Language;
  code: string;
  status: VerdictStatus;
  runtimeMs?: number;
  memoryKb?: number;
  testCaseResults?: TestCaseResult[];
  passedTestCases?: number;
  totalTestCases?: number;
  errorMessage?: string;
  createdAt: string;
}

// ─── Certificates ─────────────────────────────────────────────────────────

export type CertificateTier = 'easy' | 'medium' | 'hard';

export interface Certificate {
  id: string;
  tier: CertificateTier;
  title: string;
  subtitle: string;
  recipientName: string;
  recipientId: string;
  scorePercentage: number;
  solvedCount: number;
  totalRequired: number;
  issueDate: string;
  verificationCode: string;
  instructorName: string;
  instructorTitle: string;
}

export interface CertificateTrack {
  tier: CertificateTier;
  title: string;
  difficultyLabel: Difficulty;
  badgeTitle: string;
  description: string;
  requiredPercentage: number; // usually 80
  accentColor: string;
  bgGradient: string;
  icon: string;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    displayName: string;
    rating: number;
    rankTier: RankTier;
    totalSolved: number;
    streakCount: number;
  };
  ratingChange?: number;
}

// ─── Badge ────────────────────────────────────────────────────────────────

export type BadgeType =
  | 'first_solve'
  | 'streak_7'
  | 'streak_30'
  | 'hundred_problems'
  | 'speed_demon'
  | 'hard_mode'
  | 'polyglot';

export interface Badge {
  id: string;
  type: BadgeType;
  label: string;
  description: string;
  earnedAt: string;
  icon: string;
}

// ─── Filter State ─────────────────────────────────────────────────────────

export interface ProblemFilters {
  difficulty?: Difficulty | 'All';
  tags?: string[];
  search?: string;
  status?: 'All' | 'Solved' | 'Attempted' | 'Unsolved';
  page?: number;
}
