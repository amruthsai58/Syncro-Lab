import type { Problem, ProblemListItem, LeaderboardEntry, User } from '../types';

const EMPTY_STARTER = {
  python: '',
  java: '',
  cpp: '',
  javascript: '',
  go: '',
};

// ─── Seeded Problems ──────────────────────────────────────────────────────

export const PROBLEMS: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, find the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.`,
    constraints: [
      '2 <= nums.length <= 10⁴',
      '-10⁹ <= nums[i] <= 10⁹',
      '-10⁹ <= target <= 10⁹',
      'Only one valid answer exists.',
    ],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: null },
      { input: 'nums = [3,2,4], target = 6', output: null },
      { input: 'nums = [3,3], target = 6', output: null },
    ],
    tags: ['Array', 'Hash Table'],
    companyTags: ['Google', 'Amazon', 'Apple', 'Microsoft'],
    acceptanceRate: 51.2,
    totalSubmissions: 14200000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: ['1 <= s.length <= 10⁴', 's consists of parentheses only \'()[]{}\'.'],
    examples: [
      { input: 's = "()"', output: null },
      { input: 's = "()[]{}"', output: null },
      { input: 's = "(]"', output: null },
    ],
    tags: ['String', 'Stack'],
    companyTags: ['Amazon', 'Bloomberg', 'Facebook'],
    acceptanceRate: 40.8,
    totalSubmissions: 9800000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '3',
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.`,
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: null },
      { input: 'list1 = [], list2 = []', output: null },
      { input: 'list1 = [1], list2 = [0]', output: null },
    ],
    tags: ['Linked List', 'Recursion'],
    companyTags: ['Amazon', 'Microsoft', 'Apple'],
    acceptanceRate: 63.4,
    totalSubmissions: 7600000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '4',
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\`, find the **subarray** with the largest sum.`,
    constraints: ['1 <= nums.length <= 10⁵', '-10⁴ <= nums[i] <= 10⁴'],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: null },
      { input: 'nums = [1]', output: null },
      { input: 'nums = [5,4,-1,7,8]', output: null },
    ],
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    companyTags: ['Google', 'Amazon', 'LinkedIn', 'Microsoft'],
    acceptanceRate: 50.4,
    totalSubmissions: 10200000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '5',
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    constraints: ['1 <= n <= 45'],
    examples: [
      { input: 'n = 2', output: null },
      { input: 'n = 3', output: null },
    ],
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    companyTags: ['Amazon', 'Google', 'Adobe'],
    acceptanceRate: 52.1,
    totalSubmissions: 8400000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '6',
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    constraints: ['1 <= nums.length <= 10⁴', '-10⁴ < nums[i], target < 10⁴', 'All the integers in nums are unique.', 'nums is sorted in ascending order.'],
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: null },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: null },
    ],
    tags: ['Array', 'Binary Search'],
    companyTags: ['Facebook', 'Amazon', 'Bloomberg'],
    acceptanceRate: 56.8,
    totalSubmissions: 5200000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '7',
    title: 'Longest Palindromic Substring',
    slug: 'longest-palindromic-substring',
    difficulty: 'Medium',
    description: `Given a string \`s\`, return the longest palindromic substring in \`s\`.`,
    constraints: ['1 <= s.length <= 1000', 's consist of only digits and English letters.'],
    examples: [
      { input: 's = "babad"', output: null },
      { input: 's = "cbbd"', output: null },
    ],
    tags: ['String', 'Dynamic Programming'],
    companyTags: ['Amazon', 'Microsoft', 'Bloomberg'],
    acceptanceRate: 32.7,
    totalSubmissions: 7800000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '8',
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', "grid[i][j] is '0' or '1'."],
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: null,
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: null,
      },
    ],
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Graph', 'Union Find'],
    companyTags: ['Amazon', 'Google', 'Facebook', 'Bloomberg', 'Microsoft'],
    acceptanceRate: 57.6,
    totalSubmissions: 9100000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '9',
    title: 'LRU Cache',
    slug: 'lru-cache',
    difficulty: 'Medium',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with **positive** size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the key exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.`,
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10⁴', '0 <= value <= 10⁵', 'At most 2 * 10⁵ calls will be made to get and put.'],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: null,
      },
    ],
    tags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
    companyTags: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Uber'],
    acceptanceRate: 42.1,
    totalSubmissions: 6400000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '10',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: ['n == height.length', '1 <= n <= 2 * 10⁴', '0 <= height[i] <= 10⁵'],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: null },
      { input: 'height = [4,2,0,3,2,5]', output: null },
    ],
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
    companyTags: ['Amazon', 'Google', 'Apple', 'Bloomberg', 'Goldman Sachs'],
    acceptanceRate: 60.9,
    totalSubmissions: 5800000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '11',
    title: 'Word Ladder',
    slug: 'word-ladder',
    difficulty: 'Hard',
    description: `A **transformation sequence** from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that:
- Every adjacent pair of words differs by a single letter.
- Every \`si\` for \`1 <= i <= k\` is in \`wordList\`. Note that \`beginWord\` does not need to be in \`wordList\`.
- \`sk == endWord\`

Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return the number of words in the shortest transformation sequence from \`beginWord\` to \`endWord\`, or \`0\` if no such sequence exists.`,
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000', 'wordList[i].length == beginWord.length', 'beginWord, endWord, and wordList[i] consist of lowercase English letters.', 'beginWord != endWord', 'All the words in wordList are unique.'],
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: null },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: null },
    ],
    tags: ['Hash Table', 'String', 'Breadth-First Search'],
    companyTags: ['Amazon', 'Facebook', 'LinkedIn', 'Snapchat'],
    acceptanceRate: 38.2,
    totalSubmissions: 4200000,
    starterCode: { ...EMPTY_STARTER },
  },
  {
    id: '12',
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000', '1 <= m + n <= 2000', '-10⁶ <= nums1[i], nums2[i] <= 10⁶'],
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: null },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: null },
    ],
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    companyTags: ['Amazon', 'Google', 'Adobe', 'Apple', 'Microsoft'],
    acceptanceRate: 38.9,
    totalSubmissions: 6800000,
    starterCode: { ...EMPTY_STARTER },
  },
];

export const PROBLEM_LIST: ProblemListItem[] = PROBLEMS.map(p => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  difficulty: p.difficulty,
  tags: p.tags,
  companyTags: p.companyTags,
  acceptanceRate: p.acceptanceRate,
}));

// ─── Leaderboard Data ─────────────────────────────────────────────────────

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: { id: 'u1', displayName: 'ArjunMehra', rating: 2847, rankTier: 'Master', totalSolved: 432, streakCount: 87 }, ratingChange: +24 },
  { rank: 2, user: { id: 'u2', displayName: 'CodeNinja_X', rating: 2741, rankTier: 'Master', totalSolved: 389, streakCount: 62 }, ratingChange: -5 },
  { rank: 3, user: { id: 'u3', displayName: 'Priya_Dev', rating: 2688, rankTier: 'Diamond', totalSolved: 356, streakCount: 45 }, ratingChange: +12 },
  { rank: 4, user: { id: 'u4', displayName: 'ByteCrusher', rating: 2512, rankTier: 'Diamond', totalSolved: 312, streakCount: 33 }, ratingChange: +8 },
  { rank: 5, user: { id: 'u5', displayName: 'AlgoQueen', rating: 2398, rankTier: 'Platinum', totalSolved: 287, streakCount: 28 }, ratingChange: -2 },
  { rank: 6, user: { id: 'u6', displayName: 'Rohit_Codes', rating: 2245, rankTier: 'Platinum', totalSolved: 254, streakCount: 19 }, ratingChange: +15 },
  { rank: 7, user: { id: 'u7', displayName: 'SiliconSage', rating: 2102, rankTier: 'Gold', totalSolved: 221, streakCount: 14 }, ratingChange: +3 },
  { rank: 8, user: { id: 'u8', displayName: 'Kavya_0x', rating: 1987, rankTier: 'Gold', totalSolved: 198, streakCount: 22 }, ratingChange: -7 },
  { rank: 9, user: { id: 'u9', displayName: 'DevNinja42', rating: 1834, rankTier: 'Silver', totalSolved: 167, streakCount: 9 }, ratingChange: +18 },
  { rank: 10, user: { id: 'u10', displayName: 'QuantumDev', rating: 1712, rankTier: 'Silver', totalSolved: 145, streakCount: 6 }, ratingChange: +1 },
];

// ─── Mock User ────────────────────────────────────────────────────────────

export const MOCK_USER: User = {
  id: 'demo',
  displayName: 'You',
  deviceKey: 'demo-device',
  rating: 1450,
  rankTier: 'Silver',
  streakCount: 12,
  totalSolved: 84,
  easySolved: 52,
  mediumSolved: 28,
  hardSolved: 4,
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  badges: [
    { id: 'b1', type: 'first_solve', label: 'First Blood', description: 'Solved your first problem', earnedAt: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(), icon: '⚡' },
    { id: 'b2', type: 'streak_7', label: '7-Day Streak', description: 'Maintained a 7-day coding streak', earnedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), icon: '🔥' },
    { id: 'b3', type: 'hard_mode', label: 'Hard Mode', description: 'Solved a Hard difficulty problem', earnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), icon: '💀' },
  ],
};
