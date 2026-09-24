const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Question = require('./models/Question');
const Bookmark = require('./models/Bookmark');
const MockSession = require('./models/MockSession');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not configured in server/.env. Cannot run seed script.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Question.deleteMany();
    await Bookmark.deleteMany();
    await MockSession.deleteMany();

    console.log('🧹 Cleared existing database records.');

    // 1. Create Default Users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const adminUser = await User.create({
      name: 'PrepMate Admin',
      email: 'admin@prepmate.com',
      password: adminPassword,
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: userPassword,
      role: 'user',
    });

    console.log('👤 Created default users: admin@prepmate.com / alex@example.com');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Data Structures & Algorithms',
        description: 'Core computational problems, trees, graphs, dynamic programming, sorting, and array manipulation.',
      },
      {
        name: 'System Design',
        description: 'Scalability, microservices, load balancing, caching strategies, partitioning, and high-availability distributed systems.',
      },
      {
        name: 'Frontend Engineering',
        description: 'React, JavaScript/TypeScript, DOM performance, CSS architecture, browser rendering lifecycle, and state management.',
      },
      {
        name: 'Backend & Databases',
        description: 'Node.js, Express, SQL vs NoSQL, indexing, transaction ACID properties, RESTful & GraphQL API design, concurrency.',
      },
      {
        name: 'Behavioral & Leadership',
        description: 'STAR methodology questions, conflict resolution, project management, cross-functional collaboration, and cultural fit.',
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`📁 Created ${createdCategories.length} categories.`);

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    // 3. Create Curated Interview Questions
    const questionsData = [
      // DSA
      {
        title: 'Two Sum Problem with Optimal O(n) Hash Map Solution',
        description: `### Problem
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

### Approach
Use a hash map to store each number and its index. As you iterate through the array:
1. Calculate the complement: \`complement = target - nums[i]\`.
2. Check if the complement already exists in the map.
3. If yes, return \`[map[complement], i]\`.
4. If no, insert \`nums[i]\` with index \`i\` into the map.

### Complexity
- **Time Complexity:** O(n) where n is the length of nums.
- **Space Complexity:** O(n) to store seen elements in the hash map.`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Easy',
        company: 'Google',
        tags: ['Array', 'Hash Map', 'Two Pointers'],
        createdBy: adminUser._id,
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        description: `### Problem
Given a string \`s\`, find the length of the longest substring without repeating characters.

### Approach: Sliding Window
Use two pointers (\`left\` and \`right\`) along with a Map or Set to track the last seen index of each character:
1. Advance the \`right\` pointer.
2. If \`s[right]\` is in the window, shift \`left\` pointer to \`max(left, map[s[right]] + 1)\`.
3. Update \`maxLength = max(maxLength, right - left + 1)\`.
4. Record \`map[s[right]] = right\`.

### Complexity
- **Time Complexity:** O(n)
- **Space Complexity:** O(min(m, n)) where m is character set size.`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Medium',
        company: 'Amazon',
        tags: ['Sliding Window', 'String', 'Hash Set'],
        createdBy: adminUser._id,
      },
      {
        title: 'Merge K Sorted Linked Lists',
        description: `### Problem
You are given an array of \`k\` linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.

### Optimal Approach: Min-Heap / Priority Queue
1. Initialize a Min-Heap with the head node of each of the \`k\` lists.
2. Extract the minimum node from the heap, append it to the merged list.
3. If the extracted node has a \`.next\`, push \`.next\` into the heap.
4. Repeat until heap is empty.

### Complexity
- **Time Complexity:** O(N log k) where N is total number of nodes across all lists.
- **Space Complexity:** O(k) for the heap.`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Hard',
        company: 'Meta',
        tags: ['Linked List', 'Heap', 'Divide and Conquer'],
        createdBy: adminUser._id,
      },
      {
        title: 'Trapping Rain Water',
        description: `### Problem
Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Two-Pointer Solution
1. Use \`left = 0\`, \`right = n - 1\`, \`left_max = 0\`, \`right_max = 0\`.
2. While \`left < right\`:
   - If \`height[left] < height[right]\`:
     - If \`height[left] >= left_max\`, update \`left_max\`.
     - Else \`trapped += left_max - height[left]\`.
     - Increment \`left\`.
   - Else:
     - If \`height[right] >= right_max\`, update \`right_max\`.
     - Else \`trapped += right_max - height[right]\`.
     - Decrement \`right\`.

### Complexity
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Hard',
        company: 'Microsoft',
        tags: ['Two Pointers', 'Dynamic Programming', 'Stack'],
        createdBy: adminUser._id,
      },
      {
        title: 'LRU Cache Implementation',
        description: `### Problem
Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) \`get\` and \`put\` operations.

### Data Structure Selection
Combine a **Doubly Linked List** and a **Hash Map**:
- The Hash Map maps \`key -> ListNode\` for O(1) lookup.
- The Doubly Linked List keeps track of usage order: Head holds Most Recently Used (MRU), Tail holds Least Recently Used (LRU).

### Key Operations
- \`get(key)\`: If exists, move node to head and return value.
- \`put(key, value)\`: If exists, update value and move to head. If new and capacity reached, remove tail node and remove from hash map. Insert new node at head.`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Medium',
        company: 'Apple',
        tags: ['Design', 'Hash Map', 'Doubly Linked List'],
        createdBy: adminUser._id,
      },

      // System Design
      {
        title: 'Design a Scalable URL Shortener (Bitly / TinyURL)',
        description: `### Requirements
- **Functional:** Generate unique short URL (7 chars) from long URL, redirect with 301/302, support custom aliases, track click analytics.
- **Non-Functional:** High availability (99.99%), low latency redirection (< 20ms), 100:1 read-to-write ratio.

### Architecture Highlights
1. **Capacity Estimation:** 500M new URLs/month = ~200 writes/sec, 20,000 reads/sec.
2. **Key Generation:** Base62 encoding ([a-zA-Z0-9] = 62^7 = 3.5 trillion URLs). Use pre-generated keys via a Key Generation Service (KGS) or SnowFlake ID generator.
3. **Database:** NoSQL (DynamoDB/Cassandra) or Partitioned PostgreSQL. Primary key: \`short_hash\`.
4. **Caching:** Redis cluster caching hot 20% URLs (80-20 Pareto principle) with LRU eviction.
5. **Load Balancing & CDN:** Geo-DNS + NGINX reverse proxy.`,
        category: catMap['System Design'],
        difficulty: 'Medium',
        company: 'Uber',
        tags: ['Distributed Systems', 'Caching', 'Database Partitioning', 'Base62'],
        createdBy: adminUser._id,
      },
      {
        title: 'Design a Real-time Notification System',
        description: `### System Components
1. **Notification Services:** Multiple producers (billing, social, security alerts) sending events to message queues (Kafka / RabbitMQ).
2. **Prioritization & Rate Limiter:** Protect users from spam with sliding window rate limiting.
3. **Delivery Workers:** Dedicated worker pools for iOS (APNs), Android (FCM), Email (SendGrid/SES), SMS (Twilio), and WebSocket for in-app toasts.
4. **User Preferences DB:** Store opt-in channels, quiet hours, and notification categories in MongoDB/PostgreSQL.
5. **Deduplication:** Redis idempotent cache using event UUID keys to prevent double alerting.`,
        category: catMap['System Design'],
        difficulty: 'Hard',
        company: 'Netflix',
        tags: ['Message Queues', 'Kafka', 'WebSockets', 'Idempotency'],
        createdBy: adminUser._id,
      },
      {
        title: 'Design a Distributed Rate Limiter',
        description: `### Comparison of Algorithms
1. **Token Bucket:** Allows bursts, memory efficient (stores timestamp + token count).
2. **Leaky Bucket:** Constant output rate, prevents spikes.
3. **Sliding Window Log:** Precise, high memory footprint.
4. **Sliding Window Counter:** Low memory, high accuracy (weighted sum of current and previous window).

### Distributed Implementation
- Store counters in **Redis** using Lua scripts for atomic operations (\`INCR\` + \`EXPIRE\`).
- Handle race conditions and network latency across multi-region clusters using local in-memory caching with asynchronous batch sync or sticky routing.`,
        category: catMap['System Design'],
        difficulty: 'Medium',
        company: 'Stripe',
        tags: ['Redis', 'Rate Limiting', 'Concurrency', 'Lua'],
        createdBy: adminUser._id,
      },

      // Frontend Engineering
      {
        title: 'React Fiber Architecture and Concurrent Mode Explained',
        description: `### What is React Fiber?
React Fiber is the complete rewrite of the React core reconciliation algorithm introduced in React 16.
Prior to Fiber (the stack reconciler), rendering was synchronous and blocking. If a component tree was deep, it would cause frame drops (jank).

### Key Features of Fiber:
1. **Time Slicing & Cooperative Scheduling:** Breaks rendering work into incremental units of work (fibers), yielding back control to the browser via \`scheduler\` (similar to \`requestIdleCallback\`).
2. **Priority Lanes:** High priority updates (clicks, keystrokes) interrupt low priority background updates (data fetch transitions).
3. **Double Buffering:** Maintains a \`current\` tree (rendered on screen) and a \`workInProgress\` tree (built off-screen) before committing changes atomically.`,
        category: catMap['Frontend Engineering'],
        difficulty: 'Hard',
        company: 'Meta',
        tags: ['React', 'Fiber', 'Performance', 'DOM'],
        createdBy: adminUser._id,
      },
      {
        title: 'Explain Event Bubbling, Capturing, and Event Delegation in JavaScript',
        description: `### Event Flow Phases
1. **Capturing Phase:** Event travels from \`window\` -> \`document\` -> down to target element.
2. **Target Phase:** Event reaches the actual element clicked.
3. **Bubbling Phase:** Event bubbles up from target element -> parent -> \`document\` -> \`window\`.

### Event Delegation
Instead of attaching individual event listeners to hundreds of child elements (e.g., list items), attach a single listener on the parent element and use \`event.target.closest('selector')\` to identify which child triggered it.
- **Benefits:** Massive memory savings, handles dynamically added child DOM nodes automatically.`,
        category: catMap['Frontend Engineering'],
        difficulty: 'Easy',
        company: 'Airbnb',
        tags: ['JavaScript', 'DOM', 'Browser Events'],
        createdBy: adminUser._id,
      },
      {
        title: 'How to Optimize Web Performance & Core Web Vitals (LCP, INP, CLS)',
        description: `### Core Web Vitals Breakdown
1. **LCP (Largest Contentful Paint) < 2.5s:**
   - Optimize hero images (\`fetchpriority="high"\`, WebP/AVIF format, proper \`srcset\`).
   - Eliminate render-blocking CSS/JS and use critical CSS inlining.
   - Use CDN edge caching.
2. **INP (Interaction to Next Paint) < 200ms:**
   - Break long tasks (>50ms) using \`scheduler.yield()\` or Web Workers.
   - Avoid heavy synchronous DOM manipulation in click handlers.
3. **CLS (Cumulative Layout Shift) < 0.1:**
   - Always specify \`width\` and \`height\` or \`aspect-ratio\` on images and video embeds.
   - Reserve space for dynamic ads and banners before they load.`,
        category: catMap['Frontend Engineering'],
        difficulty: 'Medium',
        company: 'Google',
        tags: ['Performance', 'Core Web Vitals', 'LCP', 'INP'],
        createdBy: adminUser._id,
      },

      // Backend & Databases
      {
        title: 'SQL vs NoSQL: When to choose Relational vs Document/Key-Value Databases',
        description: `### Relational Databases (PostgreSQL, MySQL)
- **Strengths:** ACID transactions, strict schema integrity, complex JOIN queries across relational models, predictable consistency.
- **Best for:** E-commerce transactions, financial ledgers, systems with complex multi-table relationships.

### NoSQL Databases (MongoDB, Cassandra, Redis)
- **Strengths:** Flexible schema, horizontal partitioning (sharding), high write throughput, hierarchical nested documents.
- **Best for:** Real-time analytics, user session stores, content management, IoT time-series, rapid prototyping.`,
        category: catMap['Backend & Databases'],
        difficulty: 'Easy',
        company: 'Amazon',
        tags: ['Database', 'SQL', 'MongoDB', 'PostgreSQL'],
        createdBy: adminUser._id,
      },
      {
        title: 'Database Indexing: B-Trees vs Hash Indexes & Optimization Strategies',
        description: `### B-Tree Indexes
- Balanced tree structure where keys are kept sorted.
- Supports equality queries (\`=\`) as well as range queries (\`<\`, \`>\`, \`BETWEEN\`) and prefix sorting.
- Default index in PostgreSQL, MySQL InnoDB, and MongoDB.

### Query Optimization Best Practices:
1. Index columns used in \`WHERE\`, \`ORDER BY\`, and \`JOIN\` clauses.
2. Respect the **Leftmost Prefix Rule** for compound indexes (\`A, B, C\` supports queries on \`A\` or \`A, B\`, but not standalone \`B\`).
3. Avoid over-indexing: each index slows down \`INSERT\`, \`UPDATE\`, and \`DELETE\` operations.`,
        category: catMap['Backend & Databases'],
        difficulty: 'Medium',
        company: 'Microsoft',
        tags: ['Indexing', 'B-Tree', 'Performance', 'Query Tuning'],
        createdBy: adminUser._id,
      },
      {
        title: 'Handling Concurrency and Race Conditions in Node.js Applications',
        description: `### Concurrency Challenges in Distributed Backends
While Node.js uses a single-threaded Event Loop, multiple asynchronous requests and multi-instance deployments can cause race conditions (e.g. double spending, inventory overselling).

### Mitigation Techniques:
1. **Optimistic Concurrency Control:** Add a \`version\` field to documents. Update fails if current version in DB doesn't match read version.
2. **Pessimistic Locking / Distributed Locks:** Use Redis locks (\`Redlock\` algorithm) for critical section execution.
3. **Atomic Database Operations:** Utilize MongoDB \`$inc\` or SQL \`UPDATE balance = balance - 10 WHERE balance >= 10\`.
4. **Message Queues:** Serialize critical workflows using FIFO queues (Kafka partitions, BullMQ).`,
        category: catMap['Backend & Databases'],
        difficulty: 'Hard',
        company: 'Uber',
        tags: ['Concurrency', 'Distributed Locks', 'Redis', 'Transactions'],
        createdBy: adminUser._id,
      },

      // Behavioral & Leadership
      {
        title: 'Tell me about a time you resolved a major production outage or technical disagreement',
        description: `### Structure Using the STAR Method
- **Situation:** Set the context clearly (e.g., "During Black Friday, our payment gateway started dropping 15% of transactions due to connection pooling limits").
- **Task:** Define your role and responsibility ("As lead backend engineer, I was responsible for triage, mitigation, and cross-team communication").
- **Action:**
  - Implemented immediate circuit-breaker fallback.
  - Scaled replica pool and throttled non-critical telemetry traffic.
  - Communicated timeline transparently with executive stakeholders every 20 minutes.
- **Result:**
  - Restored 100% processing within 18 minutes.
  - Led blameless post-mortem and added automated load-testing into the CI/CD release pipeline.`,
        category: catMap['Behavioral & Leadership'],
        difficulty: 'Medium',
        company: 'Amazon',
        tags: ['STAR Method', 'Leadership', 'Incident Management', 'Communication'],
        createdBy: adminUser._id,
      },
      {
        title: 'How do you handle scope creep and tight deadlines when building critical software?',
        description: `### Key Principles to Highlight
1. **Ruthless Prioritization (MoSCoW Method):** Separate Must-Haves (P0 MVP) from Should-Haves and Nice-to-Haves.
2. **Transparent Stakeholder Negotiation:** Provide trade-off options rather than a plain "no". (e.g., "We can ship feature A with full security on Friday if we defer feature B to next sprint").
3. **De-risking Unknowns:** Spike risky architectural components in sprint day 1.
4. **Maintaining Quality Standards:** Never compromise automated testing or security to rush features, as technical debt compounds rapidly.`,
        category: catMap['Behavioral & Leadership'],
        difficulty: 'Easy',
        company: 'Google',
        tags: ['Project Management', 'Communication', 'Prioritization'],
        createdBy: adminUser._id,
      },
    ];

    const createdQuestions = await Question.insertMany(questionsData);
    console.log(`📝 Seeded ${createdQuestions.length} comprehensive interview questions.`);

    // 4. Create sample bookmarks for demo user
    await Bookmark.create([
      { user: demoUser._id, question: createdQuestions[0]._id },
      { user: demoUser._id, question: createdQuestions[1]._id },
      { user: demoUser._id, question: createdQuestions[5]._id },
    ]);
    console.log('⭐ Seeded sample bookmarks for demo user.');

    // 5. Create a sample completed mock session for demo user
    await MockSession.create({
      user: demoUser._id,
      category: createdCategories[0]._id, // DSA
      difficulty: 'Medium',
      questions: [
        {
          question: createdQuestions[0]._id,
          answerText: 'I would use a hash map to look up the complement in O(1) time while iterating through the array in a single pass.',
          confidenceRating: 5,
          status: 'Answered',
        },
        {
          question: createdQuestions[1]._id,
          answerText: 'Sliding window technique maintaining left and right pointers with a character frequency map.',
          confidenceRating: 4,
          status: 'Answered',
        },
      ],
      timeTakenSeconds: 340,
      isCompleted: true,
      startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 340 * 1000),
    });
    console.log('🎯 Seeded sample mock interview session.');

    console.log('\n=============================================');
    console.log('🎉 Database Seeding Completed Successfully!');
    console.log('=============================================');
    console.log('Demo Credentials:');
    console.log('  Admin User : admin@prepmate.com / admin123');
    console.log('  Standard   : alex@example.com / user123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
