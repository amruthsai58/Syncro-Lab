// ─── SYNCRO LAB Backend — Node.js + Express ───────────────────────────────
// Patterns used:
//  - Factory:     UserProfileFactory.create()
//  - Repository:  UserProfileRepository (in-memory store)
//  - Strategy:    Language-specific executor strategies
//  - Chain of Responsibility: JudgeOrchestrator pipeline steps
//  - Builder:     SubmissionBuilder
//  - Singleton:   DB store instances

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'syncrolab_dev_secret_change_in_prod_2026';
const JWT_EXPIRY = '30d';

const os = require('os');

// ─── Middleware ────────────────────────────────────────────────────────────

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Endpoint to get current server local network IP for mobile QR scanning
app.get('/api/network-info', (_req, res) => {
  const nets = os.networkInterfaces();
  let lanIp = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        lanIp = net.address;
        break;
      }
    }
  }
  res.json({ lanIp, port: 5173, backendPort: PORT });
});

// ─── In-Memory Stores (Repository pattern) ────────────────────────────────

/** @type {Map<string, object>} keyed by user id */
const userStore = new Map();
/** @type {Map<string, object>} keyed by device key — for session continuity */
const deviceStore = new Map();
/** @type {Map<string, object>} keyed by name (lowercase) */
const nameStore = new Map();
/** @type {Map<string, object>} keyed by submission id */
const submissionStore = new Map();

// ─── Factory: UserProfileFactory ──────────────────────────────────────────

const UserProfileFactory = {
  /**
   * Factory method — creates a new UserProfile entity.
   * Name collision handling: append numeric suffix if name already taken globally.
   */
  create(displayName, deviceKey) {
    let finalName = displayName.trim();
    const key = finalName.toLowerCase();

    // Name collision? append #N suffix
    if (nameStore.has(key)) {
      const existing = nameStore.get(key);
      if (existing.deviceKey !== deviceKey) {
        const suffix = Math.floor(Math.random() * 900 + 100);
        finalName = `${finalName}#${suffix}`;
      }
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const profile = {
      id,
      displayName: finalName,
      deviceKey,
      rating: 1200,
      rankTier: 'Bronze',
      streakCount: 0,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      createdAt: now,
      updatedAt: now,
      badges: [],
    };
    return profile;
  },
};

// ─── Repository: UserProfileRepository ────────────────────────────────────

const UserProfileRepository = {
  save(profile) {
    userStore.set(profile.id, profile);
    deviceStore.set(profile.deviceKey, profile);
    nameStore.set(profile.displayName.toLowerCase(), profile);
    return profile;
  },

  findByDeviceKey(deviceKey) {
    return deviceStore.get(deviceKey) || null;
  },

  findById(id) {
    return userStore.get(id) || null;
  },

  findAll() {
    return Array.from(userStore.values());
  },
};

// ─── JWT Service (Singleton) ───────────────────────────────────────────────

const JwtService = {
  issue(userId) {
    return jwt.sign({ sub: userId, iss: 'syncrolab' }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  },

  verify(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  },
};

// ─── Auth Middleware (Chain of Responsibility link) ────────────────────────

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }
  const token = authHeader.slice(7);
  const payload = JwtService.verify(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.userId = payload.sub;
  next();
}

// ─── Judge Engine (Strategy + Chain of Responsibility + Builder) ───────────

/**
 * Strategy interface: each language executor implements judge(code, problem)
 * In MVP, all simulate realistic verdicts with weighted randomness.
 */
const ExecutorStrategies = {
  python: { name: 'CPython 3.11', compile: false },
  java: { name: 'OpenJDK 21', compile: true },
  cpp: { name: 'GCC 13 -O2', compile: true },
  javascript: { name: 'Node.js 20', compile: false },
  go: { name: 'Go 1.21', compile: false },
};

/**
 * Abstract Factory: produces the correct executor config for a language.
 */
const LanguageExecutorFactory = {
  create(language) {
    const strategy = ExecutorStrategies[language];
    if (!strategy) throw new Error(`Unsupported language: ${language}`);
    return strategy;
  },
};

/**
 * Chain of Responsibility: JudgeOrchestrator steps.
 * Each step can short-circuit with a verdict or pass to next.
 */
const JudgePipeline = [
  // Step 1: Compile check (for compiled languages)
  function compileStep(ctx) {
    if (!ctx.executor.compile) return ctx; // skip for interpreted
    const rand = Math.random();
    if (rand < 0.04 && ctx.code.trim().length < 40) {
      return { ...ctx, verdict: 'Compilation Error', errorMessage: 'SyntaxError: unexpected token at line 1' };
    }
    return ctx;
  },
  // Step 2: Run test cases
  function runStep(ctx) {
    if (ctx.verdict) return ctx; // already decided
    const rand = Math.random();
    // Weight toward AC for demo purposes
    if (rand < 0.55) return { ...ctx, passed: ctx.total, verdict: 'Accepted' };
    if (rand < 0.68) return { ...ctx, passed: Math.floor(Math.random() * ctx.total), verdict: 'Wrong Answer' };
    if (rand < 0.78) return { ...ctx, passed: Math.floor(Math.random() * ctx.total), verdict: 'Time Limit Exceeded' };
    if (rand < 0.86) return { ...ctx, passed: Math.floor(Math.random() * Math.ceil(ctx.total / 2)), verdict: 'Memory Limit Exceeded' };
    return { ...ctx, passed: Math.floor(Math.random() * 3), verdict: 'Runtime Error', errorMessage: 'RuntimeError: list index out of range' };
  },
  // Step 3: Compute metrics
  function metricsStep(ctx) {
    return {
      ...ctx,
      runtimeMs: Math.floor(Math.random() * 180 + 15),
      memoryKb: Math.floor(Math.random() * 10000 + 3000),
    };
  },
];

function runJudgePipeline(code, language, totalTestCases) {
  const executor = LanguageExecutorFactory.create(language);
  let ctx = { code, executor, total: totalTestCases, passed: 0, verdict: null, runtimeMs: 0, memoryKb: 0 };
  for (const step of JudgePipeline) {
    ctx = step(ctx);
  }
  return ctx;
}

/**
 * Builder: SubmissionBuilder constructs the Submission object.
 */
class SubmissionBuilder {
  constructor() {
    this._sub = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
  }

  withUser(userId) { this._sub.userId = userId; return this; }
  withProblem(problemId, problemSlug) { this._sub.problemId = problemId; this._sub.problemSlug = problemSlug; return this; }
  withCode(code, language) { this._sub.code = code; this._sub.language = language; return this; }
  withVerdict(verdict, passed, total, runtimeMs, memoryKb, errorMessage) {
    this._sub.status = verdict;
    this._sub.passedTestCases = passed;
    this._sub.totalTestCases = total;
    this._sub.runtimeMs = runtimeMs;
    this._sub.memoryKb = memoryKb;
    if (errorMessage) this._sub.errorMessage = errorMessage;
    return this;
  }
  build() { return this._sub; }
}

// ─── Problem seed data (lightweight version — full data in frontend) ───────

const SEED_PROBLEMS = [
  { id: '1', slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', testCaseCount: 5, tags: ['Array', 'Hash Table'] },
  { id: '2', slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', testCaseCount: 6, tags: ['String', 'Stack'] },
  { id: '3', slug: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', difficulty: 'Easy', testCaseCount: 4, tags: ['Linked List'] },
  { id: '4', slug: 'maximum-subarray', title: 'Maximum Subarray', difficulty: 'Medium', testCaseCount: 7, tags: ['Array', 'DP'] },
  { id: '5', slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', testCaseCount: 5, tags: ['DP'] },
  { id: '6', slug: 'binary-search', title: 'Binary Search', difficulty: 'Easy', testCaseCount: 5, tags: ['Binary Search'] },
  { id: '7', slug: 'longest-palindromic-substring', title: 'Longest Palindromic Substring', difficulty: 'Medium', testCaseCount: 6, tags: ['String', 'DP'] },
  { id: '8', slug: 'number-of-islands', title: 'Number of Islands', difficulty: 'Medium', testCaseCount: 7, tags: ['Graph', 'BFS'] },
  { id: '9', slug: 'lru-cache', title: 'LRU Cache', difficulty: 'Medium', testCaseCount: 8, tags: ['Design', 'Hash Table'] },
  { id: '10', slug: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard', testCaseCount: 6, tags: ['Array', 'Two Pointers'] },
  { id: '11', slug: 'word-ladder', title: 'Word Ladder', difficulty: 'Hard', testCaseCount: 5, tags: ['BFS', 'String'] },
  { id: '12', slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', testCaseCount: 7, tags: ['Binary Search'] },
];

// ─── Routes ────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SYNCRO LAB API', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ─── Identity Routes ───────────────────────────────────────────────────────

/**
 * POST /api/identity/enter
 * Body: { name: string, deviceKey: string }
 * → Creates or retrieves profile → issues JWT
 * Pattern: Factory (create new profile) + Repository (lookup existing)
 */
app.post('/api/identity/enter', (req, res) => {
  const { name, deviceKey } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  if (!deviceKey || typeof deviceKey !== 'string') {
    return res.status(400).json({ error: 'Missing deviceKey' });
  }

  const trimmedName = name.trim().slice(0, 24);

  // Repository lookup: returning user by device key
  let profile = UserProfileRepository.findByDeviceKey(deviceKey);

  if (!profile) {
    // Factory: create new profile
    profile = UserProfileFactory.create(trimmedName, deviceKey);
    UserProfileRepository.save(profile);
    console.log(`[Identity] New user created: ${profile.displayName} (${profile.id})`);
  } else {
    console.log(`[Identity] Existing user found: ${profile.displayName} (${profile.id})`);
  }

  const token = JwtService.issue(profile.id);
  return res.json({ token, user: profile });
});

/**
 * GET /api/identity/me
 * → Resolves session token to profile
 */
app.get('/api/identity/me', authMiddleware, (req, res) => {
  const profile = UserProfileRepository.findById(req.userId);
  if (!profile) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: profile });
});

// ─── Problem Routes ────────────────────────────────────────────────────────

app.get('/api/problems', (_req, res) => {
  return res.json({ problems: SEED_PROBLEMS });
});

app.get('/api/problems/:slug', (req, res) => {
  const problem = SEED_PROBLEMS.find(p => p.slug === req.params.slug);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });
  return res.json({ problem });
});

// ─── Submission Routes ─────────────────────────────────────────────────────

/**
 * POST /api/submissions
 * Body: { problemSlug, language, code }
 * → Enqueues for judging (202 Accepted), judges synchronously in MVP
 * Pattern: Builder (Submission construction) + Strategy (language executor) + Chain of Responsibility (judge pipeline)
 */
app.post('/api/submissions', authMiddleware, (req, res) => {
  const { problemSlug, language, code } = req.body;

  const problem = SEED_PROBLEMS.find(p => p.slug === problemSlug);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });
  if (!ExecutorStrategies[language]) return res.status(400).json({ error: `Unsupported language: ${language}` });
  if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Missing code' });

  // Build initial pending submission
  const submission = new SubmissionBuilder()
    .withUser(req.userId)
    .withProblem(problem.id, problem.slug)
    .withCode(code, language)
    .build();

  submissionStore.set(submission.id, submission);

  // 202 Accepted — client can poll or wait
  res.status(202).json({ submissionId: submission.id, status: 'Pending' });

  // Async: run judge pipeline (simulate network delay)
  const judgeDelay = 1500 + Math.random() * 1000;
  setTimeout(() => {
    const result = runJudgePipeline(code, language, problem.testCaseCount);
    const judged = new SubmissionBuilder()
      .withUser(req.userId)
      .withProblem(problem.id, problem.slug)
      .withCode(code, language)
      .withVerdict(result.verdict, result.passed, result.total, result.runtimeMs, result.memoryKb, result.errorMessage)
      .build();
    judged.id = submission.id; // preserve original id
    judged.createdAt = submission.createdAt;
    submissionStore.set(submission.id, judged);
    console.log(`[Judge] ${submission.id} → ${result.verdict} (${result.passed}/${result.total} tests, ${result.runtimeMs}ms)`);
  }, judgeDelay);
});

/**
 * GET /api/submissions/:id
 * → Poll submission status
 */
app.get('/api/submissions/:id', authMiddleware, (req, res) => {
  const sub = submissionStore.get(req.params.id);
  if (!sub) return res.status(404).json({ error: 'Submission not found' });
  return res.json({ submission: sub });
});

/**
 * GET /api/submissions
 * → List user's submissions
 */
app.get('/api/submissions', authMiddleware, (req, res) => {
  const subs = Array.from(submissionStore.values())
    .filter(s => s.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 50);
  return res.json({ submissions: subs });
});

// ─── Leaderboard ───────────────────────────────────────────────────────────

app.get('/api/leaderboard/global', (_req, res) => {
  const ranked = UserProfileRepository.findAll()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 100)
    .map((u, i) => ({
      rank: i + 1,
      user: { id: u.id, displayName: u.displayName, rating: u.rating, rankTier: u.rankTier, totalSolved: u.totalSolved, streakCount: u.streakCount },
    }));
  return res.json({ leaderboard: ranked });
});

// ─── Start server ─────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║   SYNCRO LAB API   — Code. Practice. Evolve.   ║');
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log(`  → Server running on http://localhost:${PORT}`);
  console.log(`  → Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('  Design Patterns Active:');
  console.log('    [Factory]  UserProfileFactory.create()');
  console.log('    [Repo]     UserProfileRepository (in-memory)');
  console.log('    [Strategy] LanguageExecutorFactory + ExecutorStrategies');
  console.log('    [Chain]    JudgePipeline (compile → run → metrics)');
  console.log('    [Builder]  SubmissionBuilder');
  console.log('    [Singleton] JwtService, stores');
  console.log('');
});
