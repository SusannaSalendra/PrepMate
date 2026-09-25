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
      // ==========================================
      // DATA STRUCTURES & ALGORITHMS
      // ==========================================
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
      {
        title: 'Course Schedule & Detecting Cycles in Directed Graphs',
        description: `### Problem
There are \`numCourses\` courses labeled \`0\` to \`numCourses - 1\`. You are given \`prerequisites[i] = [a, b]\` indicating you must take \`b\` before \`a\`. Determine if you can finish all courses.

### Approach: Topological Sort (Kahn's Algorithm / BFS)
1. Build adjacency list and compute in-degree for every vertex.
2. Push all vertices with \`inDegree === 0\` into a queue.
3. While queue is not empty:
   - Pop vertex, increment \`visitedCount\`.
   - For each neighbor, decrement in-degree. If in-degree reaches 0, push into queue.
4. If \`visitedCount === numCourses\`, topological ordering exists (no cycle).

### Complexity
- **Time Complexity:** O(V + E)
- **Space Complexity:** O(V + E)`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Medium',
        company: 'Amazon',
        tags: ['Graph', 'Topological Sort', 'BFS', 'DFS'],
        createdBy: adminUser._id,
      },
      {
        title: 'Binary Tree Maximum Path Sum',
        description: `### Problem
A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Find the maximum path sum of any non-empty path.

### Recursive Post-Order DFS Strategy
1. For any node, compute the max contribution from its left and right subtrees: \`leftMax = max(0, maxGain(node.left))\`, \`rightMax = max(0, maxGain(node.right))\`.
2. The path through the current node with root at current is \`node.val + leftMax + rightMax\`. Update global \`maxSum = max(maxSum, priceNewPath)\`.
3. Return \`node.val + max(leftMax, rightMax)\` to the parent caller (since a path cannot branch into both subtrees when extending upward).

### Complexity
- **Time Complexity:** O(N) visiting each node once.
- **Space Complexity:** O(H) where H is tree height for call stack recursion.`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Hard',
        company: 'Meta',
        tags: ['Binary Tree', 'DFS', 'Recursion', 'Dynamic Programming'],
        createdBy: adminUser._id,
      },
      {
        title: 'Coin Change: Minimum Coins to Make Amount',
        description: `### Problem
Given an integer array \`coins\` and integer \`amount\`, compute the fewest number of coins needed to make up that amount.

### Dynamic Programming (Bottom-Up)
1. Create DP array \`dp\` of size \`amount + 1\` filled with \`Infinity\`, set \`dp[0] = 0\`.
2. Iterate for \`i = 1\` to \`amount\`:
   - For each coin in \`coins\`:
     - If \`i - coin >= 0\`: \`dp[i] = min(dp[i], dp[i - coin] + 1)\`.
3. Return \`dp[amount] === Infinity ? -1 : dp[amount]\`.

### Complexity
- **Time Complexity:** O(amount * len(coins))
- **Space Complexity:** O(amount)`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Medium',
        company: 'Microsoft',
        tags: ['Dynamic Programming', 'Array', 'Greedy Fallacy'],
        createdBy: adminUser._id,
      },
      {
        title: 'Word Search II with Trie and Backtracking',
        description: `### Problem
Given an \`m x n\` board of characters and a list of strings \`words\`, return all words present on the board.

### Optimal Approach
1. Insert all dictionary words into a **Prefix Tree (Trie)**.
2. Run DFS Backtracking from every cell on the board.
3. At each cell, step into corresponding Trie node. If the node marks a completed word, add word to results and clear flag to avoid duplicates.
4. Prune leaf Trie branches dynamically during search for extreme speedups.

### Complexity
- **Time Complexity:** O(M * N * 4^(L)) where L is maximum word length.
- **Space Complexity:** O(total characters in words) for Trie.`,
        category: catMap['Data Structures & Algorithms'],
        difficulty: 'Hard',
        company: 'Google',
        tags: ['Trie', 'Backtracking', 'Matrix', 'DFS'],
        createdBy: adminUser._id,
      },

      // ==========================================
      // SYSTEM DESIGN
      // ==========================================
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
      {
        title: 'Design a Scalable Distributed In-Memory Cache (Redis Cluster)',
        description: `### Core Architecture Requirements
- Sub-millisecond latency for get/set operations.
- High availability with automated leader election and replication.
- Dynamic horizontal scaling without full dataset rebalancing.

### Key Building Blocks:
1. **Consistent Hashing & Virtual Nodes:** Hash keys to 16,384 slots across multiple master nodes. Virtual nodes prevent hot spot data imbalance.
2. **Eviction Policies:** LRU (Least Recently Used), LFU (Least Frequently Used), and TTL-based expiration with active/passive sweeps.
3. **Cache Invalidation Patterns:**
   - *Cache-Aside (Lazy Loading)*: App reads cache, misses, reads DB, writes to cache.
   - *Write-Through / Write-Behind*: App writes cache, cache syncs DB synchronously or asynchronously.
4. **Cache Thundering Herd / Dog-piling Mitigation:** Distributed mutex locks (Redis Redlock) or probabilistic early expiration.`,
        category: catMap['System Design'],
        difficulty: 'Hard',
        company: 'Meta',
        tags: ['Consistent Hashing', 'Caching', 'Redis', 'High Availability'],
        createdBy: adminUser._id,
      },
      {
        title: 'Design YouTube / Netflix Video Streaming Platform',
        description: `### High-Level Architecture
1. **Upload & Ingestion Pipeline:** Direct presigned S3/GCS multipart upload to object storage.
2. **Transcoding & Encoding Cluster:** Asynchronous worker queue (Kafka + FFmpeg worker pool) converting original video into multiple resolutions (1080p, 720p, 480p) and chunking into MPEG-DASH / HLS segments (.ts / .m4s).
3. **Content Delivery Network (CDN):** Geo-distributed edge caches caching popular video segments close to users.
4. **Metadata & Search Service:** Elasticsearch/OpenSearch for video discovery, PostgreSQL for user accounts and video metadata.
5. **Adaptive Bitrate Streaming (ABR):** Client player dynamically adjusts video resolution chunk-by-chunk based on real-time bandwidth.`,
        category: catMap['System Design'],
        difficulty: 'Hard',
        company: 'Google',
        tags: ['Video Streaming', 'HLS', 'CDN', 'Transcoding', 'Distributed Storage'],
        createdBy: adminUser._id,
      },
      {
        title: 'Design WhatsApp / Messenger Real-Time Chat Architecture',
        description: `### System Components
1. **Connection Gateway:** Stateful WebSocket/TCP servers maintaining persistent duplex connections with millions of online clients.
2. **Session & Presence Service:** Redis cluster mapping \`userId -> gatewayServerId\` and heartbeat tracking for online/offline/typing status.
3. **Message Queuing & Routing:** Distributed message broker (Kafka/RabbitMQ) routing messages to the recipient's connected gateway server.
4. **Offline Message Storage:** Cassandra/HBase for append-only fast writes with TTL until user device reconnects and acks receipt.
5. **End-to-End Encryption:** Signal Protocol using Double Ratchet algorithm for military-grade message security.`,
        category: catMap['System Design'],
        difficulty: 'Medium',
        company: 'Meta',
        tags: ['WebSockets', 'Chat', 'End-to-End Encryption', 'Presence System'],
        createdBy: adminUser._id,
      },

      // ==========================================
      // FRONTEND ENGINEERING
      // ==========================================
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
      {
        title: 'Virtual DOM vs Real DOM and React Re-rendering Optimization',
        description: `### Virtual DOM Mechanism
1. The Virtual DOM is an in-memory lightweight representation of the real DOM tree.
2. When state changes, React constructs a new Virtual DOM tree and diffs it with previous tree (**Diffing Algorithm** O(n) heuristic).
3. Batches calculations and applies minimal real DOM mutations.

### React Re-render Optimization Strategies:
- **Component Memoization:** \`React.memo\` prevents re-renders when props have shallow equality.
- **Hook Optimization:** \`useMemo\` for expensive computations, \`useCallback\` to preserve function references.
- **State Colocation:** Keep state as close as possible to the child components that consume it.
- **Virtualization:** Render only visible viewport rows with libraries like TanStack Virtual / react-window for lists of 10,000+ items.`,
        category: catMap['Frontend Engineering'],
        difficulty: 'Medium',
        company: 'Netflix',
        tags: ['React', 'Virtual DOM', 'useMemo', 'Virtualization'],
        createdBy: adminUser._id,
      },
      {
        title: 'Web Workers, Service Workers & Offline PWA Architecture',
        description: `### Differences Between Web Workers & Service Workers
- **Web Workers:** Run CPU-heavy scripts (image processing, data crunching, sorting) in a background thread to prevent UI freezing on the main thread.
- **Service Workers:** Act as programmable proxy servers between the browser, web app, and network. Intercept HTTP requests, enable offline caching (Cache Storage API), background sync, and push notifications.

### Service Worker Lifecycle:
1. \`Registration\` -> 2. \`Installation\` (pre-cache static assets) -> 3. \`Activation\` (cleanup stale caches) -> 4. \`Fetch / Idle\`.

### Common Caching Strategies:
- *Cache First / Cache Falling Back to Network*: Ideal for fonts, static hashed bundles, logos.
- *Network First / Network Falling Back to Cache*: Ideal for dynamic API feeds and user profiles.
- *Stale-While-Revalidate*: Instantly returns cached version while refreshing cache in background.`,
        category: catMap['Frontend Engineering'],
        difficulty: 'Hard',
        company: 'Uber',
        tags: ['Service Worker', 'Web Worker', 'PWA', 'Offline Caching'],
        createdBy: adminUser._id,
      },

      // ==========================================
      // BACKEND & DATABASES
      // ==========================================
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
      {
        title: 'Microservices Saga Pattern vs Two-Phase Commit (2PC)',
        description: `### Distributed Transaction Problem
In a microservices architecture, a single business transaction (e.g., placing an order) spans multiple independent database services (Order DB, Payment DB, Inventory DB).

### Two-Phase Commit (2PC):
- Heavy synchronous coordinator with \`Prepare\` and \`Commit\` phases.
- Vulnerable to coordinator single point of failure and severe blocking latency under high load.

### Saga Pattern (Event-Driven & Resilient):
- A sequence of local transactions where each step publishes an event upon success.
- **Compensating Transactions:** If step 3 (Inventory reservation) fails, backward compensating events are emitted to undo step 2 (Refund payment) and step 1 (Cancel order).
- **Execution Models:** Choreography (decentralized events) vs Orchestration (central Saga orchestrator managing state machine).`,
        category: catMap['Backend & Databases'],
        difficulty: 'Hard',
        company: 'Netflix',
        tags: ['Microservices', 'Saga Pattern', 'Distributed Systems', 'Transactions'],
        createdBy: adminUser._id,
      },
      {
        title: 'JWT Authentication vs Stateful Sessions & Refresh Token Rotation',
        description: `### Comparison
- **Stateful Sessions:** Server stores session ID in Redis/DB and sets \`httpOnly\` cookie on client. Easy to revoke instantly, but requires centralized session store.
- **JWT (Stateless):** Signed cryptographic token containing claims. Decoded without DB lookup, highly scalable across microservices, but difficult to invalidate before expiry.

### Secure Modern Auth Pattern:
1. **Short-lived Access Token (15 mins):** Kept in memory or secure context.
2. **Long-lived Refresh Token (7 days):** Stored in secure, \`httpOnly\`, \`SameSite=Strict\` cookie.
3. **Refresh Token Rotation (RTR):** Every time the refresh token is used, server issues a new pair and invalidates the old one. If an old token is reused, server revokes all tokens for that user immediately to stop session hijacking.`,
        category: catMap['Backend & Databases'],
        difficulty: 'Medium',
        company: 'Stripe',
        tags: ['Security', 'JWT', 'OAuth', 'Authentication'],
        createdBy: adminUser._id,
      },

      // ==========================================
      // BEHAVIORAL & LEADERSHIP
      // ==========================================
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
      {
        title: 'Describe a situation where you strongly disagreed with an engineering decision made by a lead or peer',
        description: `### Key Competencies Evaluated: Amazon "Have Backbone; Disagree and Commit" & Emotional Intelligence
- **Situation:** Detail a concrete technical debate (e.g., choosing between MongoDB document sharding vs PostgreSQL partitioning).
- **Action:**
  - Gather objective empirical data: ran benchmark load-tests simulating peak 50,000 requests/sec.
  - Presented findings calmly focusing on user latency and maintenance overhead without personal bias.
  - Actively listened to the opposing view regarding schema flexibility for upcoming features.
- **Result:**
  - Team adopted the hybrid solution. Once the decision was finalized, gave 100% commitment to execution.`,
        category: catMap['Behavioral & Leadership'],
        difficulty: 'Medium',
        company: 'Amazon',
        tags: ['Conflict Resolution', 'Disagree and Commit', 'STAR Method'],
        createdBy: adminUser._id,
      },
      {
        title: 'Tell me about a time you mentored a junior engineer or championed engineering quality',
        description: `### Core Leadership Themes:
- **Situation:** Junior engineer was struggling with code reviews and asynchronous error handling patterns.
- **Action:**
  - Conducted weekly 1-on-1 pair-programming sessions.
  - Created team guidelines and ESLint rules for async error boundaries.
  - Encouraged ownership by delegating a modular telemetry sub-feature to build their confidence.
- **Result:**
  - The engineer completed the feature ahead of schedule with zero production regressions and was later promoted.`,
        category: catMap['Behavioral & Leadership'],
        difficulty: 'Easy',
        company: 'Apple',
        tags: ['Mentorship', 'Engineering Culture', 'Leadership'],
        createdBy: adminUser._id,
      },
      {
        title: 'How do you handle ambiguous requirements when tasked with building a 0-to-1 product?',
        description: `### Structured Approach:
1. **Identify Core User Value Proposition:** What is the singular job-to-be-done for the end user?
2. **Draft Technical RFC (Request for Comments):** Outline system boundaries, API contracts, dependencies, and risk factors.
3. **Establish Rapid Feedback Loops:** Deliver iterative clickable prototypes or alpha API endpoints within 2 weeks.
4. **Instrument Metrics Early:** Add telemetry to measure actual user adoption and error frequencies before scaling.`,
        category: catMap['Behavioral & Leadership'],
        difficulty: 'Hard',
        company: 'Stripe',
        tags: ['Product Sense', 'Ambiguity', 'System Architecture', 'Communication'],
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
