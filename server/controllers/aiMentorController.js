const Category = require('../models/Category');
const Question = require('../models/Question');

// Persona presets with distinct mentor interviewing styles
const PERSONAS = {
  alex: {
    name: 'Alex Rivera',
    title: 'Principal Systems Architect @ Google / Meta',
    style: 'Deep technical rigor, algorithmic efficiency, edge cases, scalability trade-offs.',
    avatarColor: 'from-indigo-500 to-cyan-500',
    tone: 'Analytical and sharp, yet supportive.',
  },
  sophia: {
    name: 'Sophia Chen',
    title: 'Staff Frontend Architect @ Airbnb / Vercel',
    style: 'DOM performance, component architecture, modern Web APIs, UX and reactivity.',
    avatarColor: 'from-pink-500 to-purple-500',
    tone: 'Crisp, articulate, focused on modern frontend excellence.',
  },
  marcus: {
    name: 'Marcus Vance',
    title: 'VP of Engineering @ Stripe',
    style: 'System leadership, STAR method, conflict resolution, business impact and reliability.',
    avatarColor: 'from-amber-500 to-orange-500',
    tone: 'Strategic, inquisitive, emphasizes behavioral ownership and engineering culture.',
  },
  elena: {
    name: 'Elena Rostova',
    title: 'Senior Full-Stack Mentor & Career Coach',
    style: 'Step-by-step guidance, building confidence, practical code design, mock interview tips.',
    avatarColor: 'from-emerald-500 to-teal-500',
    tone: 'Warm, encouraging, actionable and clear.',
  },
};

/**
 * Intelligent domain evaluator extracting keywords, completeness, and structure
 */
function evaluateAnswerLogic(questionTitle = '', questionDescription = '', candidateAnswer = '', categoryName = '', difficulty = 'Medium') {
  const answer = (candidateAnswer || '').trim();
  const lowerAnswer = answer.toLowerCase();
  const wordCount = answer ? answer.split(/\s+/).filter(Boolean).length : 0;

  // Domain-specific keyword heuristics
  const keywordsMap = {
    'data structures & algorithms': [
      'time complexity', 'space complexity', 'o(n)', 'o(1)', 'o(log n)', 'hash map', 'hash table',
      'array', 'two pointers', 'sliding window', 'binary search', 'recursion', 'stack', 'queue',
      'heap', 'priority queue', 'graph', 'tree', 'dfs', 'bfs', 'dynamic programming', 'memoization',
      'edge cases', 'null check', 'boundary', 'in-order', 'post-order', 'trie', 'visited set',
    ],
    'system design': [
      'scalability', 'high availability', 'load balancer', 'nginx', 'caching', 'redis', 'memcached',
      'database', 'sql', 'nosql', 'sharding', 'replication', 'partitioning', 'consistency',
      'latency', 'throughput', 'kafka', 'message queue', 'microservices', 'rate limiter', 'cdn',
      'stateless', 'idempotent', 'cap theorem', 'websocket', 'api gateway', 'heartbeat',
    ],
    'frontend engineering': [
      'react', 'virtual dom', 'fiber', 'state', 'props', 'hooks', 'usememo', 'usecallback',
      'rendering', 'reconciliation', 'dom', 'event delegation', 'bubbling', 'service worker',
      'web worker', 'core web vitals', 'lcp', 'inp', 'cls', 'performance', 'css', 'layout',
      'lazy loading', 'bundle size', 'memoization', 'closure', 'async/await',
    ],
    'backend & databases': [
      'acid', 'transactions', 'index', 'b-tree', 'concurrency', 'race condition', 'deadlock',
      'locking', 'optimistic', 'pessimistic', 'redis', 'jwt', 'session', 'rest', 'graphql',
      'grpc', 'connection pool', 'saga pattern', 'event driven', 'node.js', 'event loop',
      'orm', 'query optimization', 'latency', 'cluster',
    ],
    'behavioral & leadership': [
      'situation', 'task', 'action', 'result', 'star method', 'stakeholders', 'conflict',
      'trade-off', 'prioritization', 'communication', 'ownership', 'mentorship', 'post-mortem',
      'metrics', 'collaboration', 'feedback', 'deadline', 'impact', 'leadership', 'team',
    ],
  };

  const catKey = (categoryName || '').toLowerCase();
  const targetKeywords = Object.entries(keywordsMap).find(([key]) => catKey.includes(key) || key.includes(catKey))?.[1] || [
    'approach', 'complexity', 'trade-offs', 'scalability', 'edge cases', 'optimization', 'architecture', 'solution'
  ];

  const matchedKeywords = targetKeywords.filter((kw) => lowerAnswer.includes(kw));
  const missedKeywords = targetKeywords.filter((kw) => !lowerAnswer.includes(kw)).slice(0, 4);

  // Score computation based on length, depth, keyword density and difficulty
  let baseScore = 0;
  if (wordCount < 10) {
    baseScore = 20;
  } else if (wordCount < 30) {
    baseScore = 45;
  } else if (wordCount < 70) {
    baseScore = 68;
  } else if (wordCount < 150) {
    baseScore = 84;
  } else {
    baseScore = 92;
  }

  // Bonus for matching core technical concepts
  const keywordBonus = Math.min(20, matchedKeywords.length * 4);
  let finalScore = Math.min(98, Math.max(15, baseScore + (keywordBonus > 10 ? 6 : keywordBonus > 4 ? 3 : -5)));

  if (wordCount < 15) finalScore = Math.min(finalScore, 35);

  // Build strengths
  const strengths = [];
  if (wordCount > 30) strengths.push('Clear and structured flow in communicating your technical thought process.');
  if (matchedKeywords.length >= 2) {
    strengths.push(`Identified key domain concepts effectively (e.g., ${matchedKeywords.slice(0, 3).map((k) => `"${k}"`).join(', ')}).`);
  }
  if (lowerAnswer.includes('time') || lowerAnswer.includes('space') || lowerAnswer.includes('complexity') || lowerAnswer.includes('o(')) {
    strengths.push('Demonstrated strong engineering discipline by addressing computational or space complexity.');
  }
  if (lowerAnswer.includes('trade-off') || lowerAnswer.includes('alternative') || lowerAnswer.includes('scale') || lowerAnswer.includes('edge')) {
    strengths.push('Evaluated trade-offs and real-world system constraints.');
  }
  if (strengths.length === 0) {
    strengths.push('Provided an initial starting intuition toward the problem.');
  }

  // Build improvement areas
  const areasForImprovement = [];
  if (wordCount < 40) {
    areasForImprovement.push('Elaborate further on your step-by-step reasoning and discuss edge cases.');
  }
  if (!lowerAnswer.includes('complexity') && !lowerAnswer.includes('o(') && !catKey.includes('behavioral')) {
    areasForImprovement.push('Always explicitly state the asymptotic Time & Space complexity (Big-O analysis).');
  }
  if (missedKeywords.length > 0 && !catKey.includes('behavioral')) {
    areasForImprovement.push(`Consider mentioning relevant architectural components or patterns like ${missedKeywords.slice(0, 2).map((k) => `"${k}"`).join(', ')}.`);
  }
  if (catKey.includes('behavioral') && !lowerAnswer.includes('result') && !lowerAnswer.includes('metric') && !lowerAnswer.includes('%')) {
    areasForImprovement.push('Quantify the final business or engineering Result with concrete numbers, timelines, or metrics (STAR method).');
  }
  if (areasForImprovement.length === 0) {
    areasForImprovement.push('To elevate to Senior/Staff level, proactively propose benchmark testing or disaster-recovery mitigations.');
  }

  // Generate dynamic follow-up probing question
  let followUp = '';
  if (catKey.includes('data structures') || catKey.includes('algorithm')) {
    followUp = 'How would your solution behave if the input stream was too large to fit in memory (e.g., 100GB of data)? How would you parallelize it?';
  } else if (catKey.includes('system design')) {
    followUp = 'What happens during a sudden 10x traffic spike or network partition? How does your cache invalidation strategy handle thundering herds?';
  } else if (catKey.includes('frontend')) {
    followUp = 'How would you measure the impact of this approach on Core Web Vitals (specifically INP & LCP) across low-end mobile devices?';
  } else if (catKey.includes('backend')) {
    followUp = 'If two concurrent requests attempt to update this exact entity at the same millisecond, how does your system guarantee data consistency without deadlocks?';
  } else {
    followUp = 'Looking back with hindsight, what is one major decision you would make differently in that situation, and why?';
  }

  // Spoken feedback text for AI text-to-speech audio voice
  let spokenFeedback = '';
  if (finalScore >= 80) {
    spokenFeedback = `Excellent breakdown! You clearly articulated the core concepts and showed strong technical depth. I particularly liked your clarity on ${matchedKeywords[0] || 'the fundamental approach'}. Let's dive deeper into edge cases.`;
  } else if (finalScore >= 55) {
    spokenFeedback = `Solid attempt! You have the right overall intuition. To make this answer stand out in a top-tier interview, make sure to clearly quantify the trade-offs and address scalability edge cases.`;
  } else {
    spokenFeedback = `Good start on this question. I recommend structuring your thoughts step-by-step: first clarify assumptions, then outline the baseline approach, and finally optimize for time and space complexities.`;
  }

  return {
    score: finalScore,
    clarityRating: finalScore >= 75 ? 'High' : finalScore >= 50 ? 'Moderate' : 'Needs Improvement',
    strengths,
    areasForImprovement,
    keyConceptsCovered: matchedKeywords.slice(0, 6),
    keyConceptsMissed: missedKeywords.slice(0, 4),
    spokenMentorFeedback: spokenFeedback,
    followUpQuestion: followUp,
  };
}

/**
 * @desc    Get AI Mentor Chat / Conversation Response
 * @route   POST /api/ai-mentor/chat
 * @access  Public / Private
 */
const chatWithMentor = async (req, res, next) => {
  try {
    const {
      message = '',
      persona = 'alex',
      contextQuestion = null,
      history = [],
    } = req.body;

    const selectedPersona = PERSONAS[persona.toLowerCase()] || PERSONAS.alex;

    if (!message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    const lower = message.toLowerCase();
    let reply = '';
    let followUp = '';

    // Smart Conversational Responses
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('start')) {
      reply = `Hello! I'm ${selectedPersona.name}, your AI Mentor and Virtual Interviewer. I'm excited to help you prepare for your technical interviews today. We can conduct a live mock interview with voice evaluation, walk through system design architectures, or refine your coding algorithms. What topic or question would you like to tackle first?`;
    } else if (lower.includes('hint') || lower.includes('help') || lower.includes('stuck')) {
      if (contextQuestion) {
        reply = `Here is a helpful tip for "${contextQuestion.title || 'this question'}": Focus on the core invariant first. Can you identify where redundant work is occurring, or use a supporting data structure like a Hash Map, Min-Heap, or Two Pointers to reduce lookups from O(n) to O(1)? Take a breath and explain your intuition out loud!`;
      } else {
        reply = `When solving technical interview problems, always follow the 4-step framework: 1. Clarify constraints & edge cases; 2. State the brute-force solution with its complexity; 3. Optimize using appropriate data structures; 4. Walk through a test case before coding. Which part are you finding tricky?`;
      }
    } else if (lower.includes('star method') || lower.includes('behavioral')) {
      reply = `The STAR method is essential for leadership and behavioral interviews: Situation (20% context), Task (10% your specific role), Action (50% the technical decisions & leadership you showed), and Result (20% quantifiable metrics and retrospective learnings). Would you like to practice a STAR answer with me right now?`;
    } else if (lower.includes('system design') || lower.includes('scale') || lower.includes('distributed')) {
      reply = `In System Design interviews, start with Back-of-the-Envelope estimation (QPS, storage, bandwidth), define clear API endpoints, sketch the high-level architecture with Load Balancers and Caching, and then deep-dive into database sharding, replication, and fault tolerance. Tell me about the system you'd like to design!`;
    } else if (lower.includes('dsa') || lower.includes('algorithm') || lower.includes('leetcode') || lower.includes('complexity')) {
      reply = `Mastering DSA is about pattern recognition: Two Pointers, Sliding Window, Monotonic Stacks, Fast & Slow Pointers, DFS/BFS Graph Traversals, and DP Memoization. Would you like me to quiz you on a specific pattern?`;
    } else {
      reply = `That's a very thoughtful point. In a real technical interview, interviewers appreciate when you explain your trade-offs transparently and connect technical choices to business reliability. Let's build upon that—how would you test and monitor this in a production CI/CD environment?`;
    }

    res.status(200).json({
      success: true,
      data: {
        reply,
        persona: selectedPersona,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Evaluate Candidate Spoken / Written Response
 * @route   POST /api/ai-mentor/evaluate
 * @access  Public / Private
 */
const evaluateCandidateResponse = async (req, res, next) => {
  try {
    const {
      questionTitle = '',
      questionDescription = '',
      candidateAnswer = '',
      categoryName = '',
      difficulty = 'Medium',
      persona = 'alex',
    } = req.body;

    if (!candidateAnswer || !candidateAnswer.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Candidate answer is required for evaluation',
      });
    }

    const evaluation = evaluateAnswerLogic(
      questionTitle,
      questionDescription,
      candidateAnswer,
      categoryName,
      difficulty
    );

    const selectedPersona = PERSONAS[persona.toLowerCase()] || PERSONAS.alex;

    res.status(200).json({
      success: true,
      data: {
        ...evaluation,
        persona: selectedPersona,
        evaluatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Progressive Hint for a Question
 * @route   POST /api/ai-mentor/hint
 * @access  Public / Private
 */
const getQuestionHint = async (req, res, next) => {
  try {
    const { questionTitle = '', categoryName = '', hintLevel = 1 } = req.body;

    const level = parseInt(hintLevel, 10) || 1;
    let hintText = '';

    if (level === 1) {
      hintText = `💡 High-Level Clue: Think about the core data structure that can provide O(1) lookups or fast ordered access for "${questionTitle}". Have you considered a Hash Map, Two-Pointer traversal, or Queue?`;
    } else if (level === 2) {
      hintText = `⚡ Algorithmic Pattern: Try breaking the problem into sub-problems. Track boundary conditions and use auxiliary storage to eliminate repetitive recalculations.`;
    } else {
      hintText = `🎯 Solution Blueprint: 1. Initialize pointers/map; 2. Iterate through input while maintaining invariants; 3. Update result and handle edge cases (empty inputs, single element, negative numbers).`;
    }

    res.status(200).json({
      success: true,
      data: {
        hintLevel: level,
        hint: hintText,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Available AI Mentor Personas and Virtual Interview Tracks
 * @route   GET /api/ai-mentor/personas
 * @access  Public
 */
const getMentorPersonas = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        personas: Object.values(PERSONAS),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithMentor,
  evaluateCandidateResponse,
  getQuestionHint,
  getMentorPersonas,
};
