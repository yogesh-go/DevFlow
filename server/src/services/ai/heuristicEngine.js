/**
 * Deterministic Heuristic AI Fallback Engine
 * Produces structured, technically accurate SDE outputs matching strict schemas
 * when external LLM keys are absent or temporarily rate-limited.
 */


const SDE_TAXONOMY = [
  { name: "React", family: "frontend", aliases: ["react", "react.js", "reactjs"] },
  { name: "Node.js", family: "backend", aliases: ["node", "node.js", "nodejs"] },
  { name: "TypeScript", family: "language", aliases: ["typescript", "ts"] },
  { name: "JavaScript", family: "language", aliases: ["javascript", "js", "es6"] },
  { name: "Python", family: "language", aliases: ["python", "django", "fastapi", "flask"] },
  { name: "Java", family: "language", aliases: ["java", "spring", "spring boot"] },
  { name: "C++", family: "language", aliases: ["cpp", "c++"] },
  { name: "Go", family: "language", aliases: ["golang", "go"] },
  { name: "Rust", family: "language", aliases: ["rust"] },
  { name: "MongoDB", family: "database", aliases: ["mongo", "mongodb", "nosql"] },
  { name: "PostgreSQL", family: "database", aliases: ["postgres", "postgresql"] },
  { name: "SQL", family: "database", aliases: ["sql", "mysql", "relational", "rdbms"] },
  { name: "Redis", family: "caching", aliases: ["redis", "in-memory", "cache", "memcached"] },
  { name: "Docker", family: "devops", aliases: ["docker", "container", "containers", "containerization"] },
  { name: "Kubernetes", family: "devops", aliases: ["k8s", "kubernetes"] },
  { name: "AWS", family: "cloud", aliases: ["aws", "amazon web services", "ec2", "s3", "lambda"] },
  { name: "REST APIs", family: "api", aliases: ["rest", "restful", "rest api", "rest apis"] },
  { name: "GraphQL", family: "api", aliases: ["graphql"] },
  { name: "CI/CD", family: "devops", aliases: ["ci/cd", "github actions", "jenkins", "pipeline"] },
  { name: "System Design", family: "architecture", aliases: ["system design", "distributed systems", "microservices", "high availability"] },
  { name: "Data Structures", family: "core", aliases: ["data structures", "dsa", "algorithms"] },
  { name: "Unit Testing", family: "testing", aliases: ["unit test", "unit testing", "jest", "cypress", "pytest", "testing", "junit"] },
  { name: "Kafka", family: "messaging", aliases: ["kafka", "message queue", "rabbitmq"] },
  { name: "Express", family: "backend", aliases: ["express", "express.js"] },
  { name: "Git", family: "vcs", aliases: ["git", "github", "version control"] },
];

const matchesSkill = (text, skill) => {
  if (!text || !skill) return false;
  const aliases = skill.aliases || [skill.name];
  return aliases.some((alias) => {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = `(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`;
    return new RegExp(pattern, "i").test(text);
  });
};

const analyzeResume = ({ resumeText = "", jobDescription = "" }) => {
  const resumeRaw = resumeText || "";
  const jdRaw = jobDescription || "";
  const resumeLower = resumeRaw.toLowerCase();
  const jdLower = jdRaw.toLowerCase();

  // 1. Identify skills required by JD with word boundaries
  let jdSkills = SDE_TAXONOMY.filter((skill) => matchesSkill(jdRaw, skill));

  // If JD is brief or doesn't match standard taxonomy, fallback to core technical expectations
  if (jdSkills.length === 0) {
    jdSkills = SDE_TAXONOMY.filter((s) => ["React", "Node.js", "SQL", "REST APIs", "Git"].includes(s.name));
  }

  // 2. Classify candidate skills against JD requirements
  const matched = [];
  const missing = [];
  const partiallyMatched = [];

  jdSkills.forEach((skill) => {
    const isPresentInResume = matchesSkill(resumeRaw, skill);

    if (isPresentInResume) {
      matched.push(skill.name);
    } else {
      // Check if candidate has another skill in the same architectural family
      const hasRelatedFamily = SDE_TAXONOMY.some(
        (other) =>
          other.family === skill.family &&
          other.name !== skill.name &&
          matchesSkill(resumeRaw, other)
      );

      if (hasRelatedFamily) {
        partiallyMatched.push(skill.name);
      } else {
        missing.push(skill.name);
      }
    }
  });

  // 3. ATS & Quality Indicators
  const hasStandardSections = ["experience", "projects", "skills", "education"].filter((sec) => resumeLower.includes(sec));
  const hasMetrics = /\d+%\s*|\d+\s*(?:ms|seconds|users|requests|rps|k|m|million|thousand)/i.test(resumeText);
  const hasActionVerbs = /(?:built|developed|architected|designed|implemented|optimized|spearheaded|engineered|deployed)/i.test(resumeText);
  const genericBuzzwords = ["passionate", "hardworking", "detail-oriented", "fast learner", "synergy", "go-getter"].filter((b) =>
    resumeLower.includes(b)
  );

  // 4. Grounded Scoring
  const totalRequired = Math.max(jdSkills.length, 1);
  const matchRatio = (matched.length + partiallyMatched.length * 0.4) / totalRequired;

  let jobMatchScore;
  if (matched.length === 0 && partiallyMatched.length === 0) {
    jobMatchScore = 15;
  } else if (matched.length === 0) {
    jobMatchScore = Math.min(Math.round(matchRatio * 50), 30);
  } else {
    jobMatchScore = Math.min(
      Math.max(Math.round(matchRatio * 75 + (hasMetrics ? 10 : 0) + (matched.length >= 3 ? 10 : 0)), 30),
      96
    );
  }

  const atsScore = Math.min(
    Math.max(
      Math.round(
        35 +
          hasStandardSections.length * 9 +
          (hasMetrics ? 14 : 0) +
          (hasActionVerbs ? 8 : 0) -
          genericBuzzwords.length * 5
      ),
      25
    ),
    95
  );

  const overallScore = Math.round(jobMatchScore * 0.7 + atsScore * 0.3);

  // 5. Keyword Analysis
  const importantKeywords = matched.slice(0, 6);
  if (importantKeywords.length === 0) importantKeywords.push("Software Engineering", "Full-Stack Development");

  const missingKeywords = missing.slice(0, 6);
  if (missingKeywords.length === 0 && partiallyMatched.length > 0) {
    missingKeywords.push(...partiallyMatched.slice(0, 3));
  }

  // 6. Improvements
  const improvements = [];
  if (!hasMetrics) {
    improvements.push({
      priority: "high",
      section: "Experience",
      problem: "Bullet points describe functional responsibilities rather than quantified business or technical outcomes.",
      recommendation:
        "Frame achievements using Google's XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]' if truthful.",
      example: "Optimized database query indexes, reducing p99 API response time from 380ms to 95ms under load.",
    });
  }

  if (missing.length > 0) {
    improvements.push({
      priority: "high",
      section: "Skills",
      problem: `The job description explicitly requires ${missing.slice(0, 3).join(", ")}, which are absent from the resume text.`,
      recommendation:
        "If you have verifiable project or academic exposure to these technologies, add them to your technical skills inventory and project bullets.",
      example: `Technical Skills: Languages: JavaScript, Python; Databases: PostgreSQL, ${missing[0] || "Redis"}; Tools: Docker, Git.`,
    });
  }

  if (hasStandardSections.length < 4) {
    improvements.push({
      priority: "medium",
      section: "Summary",
      problem: "Resume lacks standard, unambiguous section headings preferred by enterprise ATS parsers.",
      recommendation:
        "Ensure standard top-level headers: 'Experience', 'Projects', 'Technical Skills', and 'Education'.",
      example: "Use standard bold uppercase headings with single-column linear layout for maximum parsing accuracy.",
    });
  }

  if (genericBuzzwords.length > 0) {
    improvements.push({
      priority: "low",
      section: "Summary",
      problem: `Resume contains generic filler buzzwords (${genericBuzzwords.join(", ")}) that dilute technical signal.`,
      recommendation: "Replace subjective adjectives with concrete tools, systems architecture, or engineering domain scope.",
      example: "Instead of 'passionate fast learner', write 'Full-stack engineer with hands-on experience building distributed REST services.'",
    });
  }

  // Fallback improvement if none generated
  if (improvements.length === 0) {
    improvements.push({
      priority: "medium",
      section: "Projects",
      problem: "Project descriptions could provide more architectural depth on data flow and state management.",
      recommendation: "Mention architectural decisions such as state normalization, caching strategy, or API contract validation.",
      example: "Architected real-time notification engine using WebSocket streams and Redis pub/sub queue.",
    });
  }

  // 7. Project Recommendations
  const projectRecommendations = [];
  if (missing.length > 0) {
    projectRecommendations.push(
      `Build a production-style microservice demonstrating ${missing.slice(0, 2).join(" and ")} with integration tests and Docker deployment.`
    );
  }
  projectRecommendations.push(
    "Implement an end-to-end distributed system with Redis caching, JWT token rotation, and rate-limiting middleware."
  );

  // 8. Action Plan
  const actionPlan = [
    `Target the high-priority missing JD skills (${missing.slice(0, 3).join(", ") || "cloud & testing"}) in your project descriptions if truthful.`,
    hasMetrics
      ? "Ensure every project bullet includes at least one quantitative performance or scale metric."
      : "Quantify at least 3 bullet points with specific metrics (latency, requests, percentage improvements, test coverage).",
    "Tailor your top technical skills summary to align directly with the primary keywords in this job description.",
    "Prepare whiteboard architectures for the matched technologies highlighted in your technical stack.",
  ];

  // 9. Interview Preparation (Dynamic Question Generation)
  const dynamicPrep = generateDynamicInterviewQuestions({
    resumeText,
    jobDescription,
    mode: "Mixed",
    difficulty: "Mixed",
    previousQuestions: [],
  });

  const likelyTopics = dynamicPrep.likelyTopics && dynamicPrep.likelyTopics.length > 0
    ? dynamicPrep.likelyTopics
    : [
        ...matched.slice(0, 4).map((m) => `${m} Core Architecture & Best Practices`),
        "RESTful API design principles and idempotency",
        "Database indexing and query optimization strategies",
      ];

  const likelyQuestions = dynamicPrep.likelyQuestions && dynamicPrep.likelyQuestions.length > 0
    ? dynamicPrep.likelyQuestions
    : [
        matched.length > 0
          ? `Can you walk me through the end-to-end architecture of a system you built using ${matched[0]}, and how you handled error boundaries?`
          : "How do you design scalable REST APIs with proper authentication and error handling?",
        missing.length > 0
          ? `This role requires ${missing[0]}. Although not explicitly detailed on your resume, how would you approach adopting it or what equivalent experience do you have?`
          : "How do you approach database performance profiling when queries begin degrading under heavy read load?",
        "Describe a challenging technical bug or concurrency issue you diagnosed in one of your projects, and how you resolved it.",
      ];

  return {
    overallScore,
    summary: `Candidate profile achieves a ${jobMatchScore}/100 match against this role with ${atsScore}/100 ATS compatibility. ${
      matched.length > 0 ? `Strong alignment observed in ${matched.slice(0, 3).join(", ")}.` : "Foundational engineering skills present."
    } ${missing.length > 0 ? `Key JD requirements like ${missing.slice(0, 3).join(", ")} are currently missing from the resume.` : "Candidate covers major requirements."}`,
    jobMatch: {
      score: jobMatchScore,
      explanation: `Calculated based on matching ${matched.length} of ${totalRequired} core JD technical requirements (${matched.join(", ") || "None"}), with ${partiallyMatched.length} partially matched stack components (${partiallyMatched.join(", ") || "None"}).`,
    },
    atsCompatibility: {
      score: atsScore,
      issues: [
        ...(!hasMetrics ? ["Absence of quantitative impact metrics in project bullets reduces ATS scoring weight."] : []),
        ...(hasStandardSections.length < 4 ? ["Missing one or more standard ATS section headings (Experience, Projects, Skills, Education)."] : []),
        ...(genericBuzzwords.length > 0 ? [`Contains non-technical generic wording (${genericBuzzwords.join(", ")}).`] : []),
      ],
      recommendations: [
        "Use standard, linear section headers (Experience, Projects, Technical Skills, Education).",
        "Incorporate exact JD keywords naturally within context rather than keyword stuffing.",
        "Include quantifiable engineering metrics in achievement bullet points.",
      ],
    },
    skillsAnalysis: {
      matched,
      missing,
      partiallyMatched,
    },
    experienceAnalysis: {
      strengths: [
        `Hands-on project work demonstrating ${matched.slice(0, 3).join(", ") || "software development fundamentals"}.`,
        "Evidence of end-to-end application structure and data persistence.",
      ],
      gaps: [
        ...(missing.length > 0 ? [`Absence of demonstrated experience with ${missing.slice(0, 3).join(", ")} as required by the JD.`] : []),
        ...(!hasMetrics ? ["Limited quantitative data detailing business or system performance impact."] : []),
      ],
    },
    keywordAnalysis: {
      importantKeywords,
      missingKeywords,
      overusedKeywords: genericBuzzwords.length > 0 ? genericBuzzwords : ["various", "responsible for"],
    },
    resumeStrengths: [
      `Relevant technical stack coverage in ${matched.slice(0, 4).join(", ") || "core web technologies"}.`,
      "Covers fundamental software development lifecycle concepts.",
      ...(hasMetrics ? ["Includes quantitative metrics highlighting project outcomes."] : []),
    ],
    resumeWeaknesses: [
      ...(missing.length > 0 ? [`Missing ${missing.length} technologies explicitly emphasized in the job description: ${missing.slice(0, 4).join(", ")}.`] : []),
      ...(!hasMetrics ? ["Descriptions focus on tasks rather than engineering achievements with measurable outcomes."] : []),
      ...(partiallyMatched.length > 0 ? [`Technologies like ${partiallyMatched.join(", ")} appear implied but lack explicit depth.`] : []),
    ],
    improvements,
    projectRecommendations,
    actionPlan,
    interviewPreparation: {
      likelyTopics,
      likelyQuestions,
      questions: dynamicPrep.questions,
    },
    _meta: {
      provider: "heuristic",
      model: "deterministic-sde-v1",
    },
  };
};

const QUESTION_BANK = [
  // 1. Technical Fundamentals
  {
    question: "How does the JavaScript event loop prioritize the microtask queue (Promises) versus the macrotask queue (setTimeout, I/O), and what happens if a microtask recursively schedules another microtask?",
    category: "Technical",
    difficulty: "Medium",
    reason: "Evaluates deep mastery of single-threaded asynchronous execution mechanics in Node.js and modern browsers.",
    hint: "Microtasks are completely drained at the end of each phase before the next macrotask runs; recursive microtasks lead to event loop starvation and thread freeze.",
    tags: ["javascript", "node.js", "runtime"],
  },
  {
    question: "Explain the internal differences between React's reconciliation engine in legacy mode versus the concurrent Fiber architecture. How does Fiber enable interruptible rendering?",
    category: "Technical",
    difficulty: "Hard",
    reason: "Assesses understanding of advanced frontend UI thread optimization, frame budget management, and React rendering internals.",
    hint: "Fiber represents each component as a singly linked list unit of work; cooperative scheduling yields control back to the browser via MessageChannel / scheduler.",
    tags: ["react", "frontend"],
  },
  {
    question: "What is the difference between an Inverted Index, a B-Tree index, and an LSM-Tree (Log-Structured Merge-Tree)? When would you choose an LSM-Tree database over a traditional B-Tree?",
    category: "Technical",
    difficulty: "Hard",
    reason: "Probes database engine architecture, read vs. write amplification, and disk I/O characteristics.",
    hint: "B-Trees offer fast O(log N) random reads but suffer on random writes; LSM-Trees append sequentially to memory memtables and flush to SSTables, optimizing write throughput.",
    tags: ["database", "sql", "postgresql", "mongodb"],
  },
  {
    question: "How does TypeScript enforce structural typing (duck typing) versus nominal typing, and how can you achieve nominal brand typing for sensitive identifiers like UserId or OrderId?",
    category: "Technical",
    difficulty: "Medium",
    reason: "Tests precision with advanced TypeScript type safety and domain-driven design modeling.",
    hint: "TypeScript checks compatibility based on shape, not explicit declarations; branding uses phantom unique symbol properties: type UserId = string & { readonly __brand: unique symbol }.",
    tags: ["typescript", "javascript"],
  },
  {
    question: "What is the computational and memory footprint difference between shallow copying (Object.assign / spread) and deep cloning (structuredClone / Lodash cloneDeep) in a high-throughput Node API?",
    category: "Technical",
    difficulty: "Easy",
    reason: "Checks fundamental memory allocation hygiene and awareness of V8 garbage collection overhead.",
    hint: "Shallow copy copies references at the root level in O(1) pointers; deep cloning traverses nested objects, creating duplicate memory allocations and heap pressure.",
    tags: ["javascript", "node.js"],
  },

  // 2. Resume & Implementation Based
  {
    question: "In your resume, you mention implementing high-throughput REST APIs handling thousands of requests per second. How did you handle database connection pool saturation under sudden traffic surges?",
    category: "Resume Based",
    difficulty: "Hard",
    reason: "Validates authentic engineering claims regarding scale, backpressure management, and database resource exhaustion.",
    hint: "Discuss max connection pool sizing, queue timeout limits, fast-fail circuit breakers, and offloading repetitive reads to Redis caching.",
    tags: ["node.js", "express", "postgresql", "mongodb", "rest apis"],
  },
  {
    question: "You highlighted Redis caching in your technical background. What specific cache invalidation strategy did you implement, and how did you prevent Cache Stampede (Thundering Herd) when keys expire?",
    category: "Resume Based",
    difficulty: "Medium",
    reason: "Checks whether caching claims represent naive key-value lookups or robust, production-grade distributed architectures.",
    hint: "Mention probabilistic early expiration (XFetch algorithm), mutual exclusion distributed locks with small TTL, or cache-aside with background pre-warming.",
    tags: ["redis", "caching", "backend"],
  },
  {
    question: "You have experience building single-page web applications with React. How did you architect client-side state management to prevent unnecessary component tree re-renders across sibling modules?",
    category: "Resume Based",
    difficulty: "Medium",
    reason: "Evaluates ability to maintain clean, high-performance UI architecture without state bloat.",
    hint: "Focus on colocation of state, selective context splitting, atomic state stores (Zustand), or memoization with useCallback and custom equality selectors.",
    tags: ["react", "frontend", "typescript"],
  },
  {
    question: "Your background includes containerization with Docker. How did you structure your Dockerfiles for Node.js / React microservices to optimize caching layers and minimize production container image size?",
    category: "Resume Based",
    difficulty: "Medium",
    reason: "Verifies practical DevOps fluency and containerization best practices.",
    hint: "Multi-stage builds separating build tools from minimal production runtimes (Alpine/Distroless), non-root user execution, and copying package.json before source files.",
    tags: ["docker", "devops", "ci/cd"],
  },

  // 3. Project Based & Architecture
  {
    question: "Walk me through the authentication and authorization lifecycle in one of your recent backend projects. Where did you store tokens, and how did you safely handle token expiration and refresh?",
    category: "Project Based",
    difficulty: "Medium",
    reason: "Assesses end-to-end security architecture, cookie vs. local storage trade-offs, and defense against XSS and CSRF.",
    hint: "Short-lived JWT access tokens stored in memory, HttpOnly Secure SameSite refresh tokens in cookies, and database/Redis refresh token rotation with replay detection.",
    tags: ["security", "node.js", "express", "rest apis"],
  },
  {
    question: "In a project with relational or document databases, describe a situation where a query began degrading under volume. How did you profile the query plan, and what indexing changes resolved it?",
    category: "Project Based",
    difficulty: "Medium",
    reason: "Evaluates practical performance debugging, execution plan analysis (EXPLAIN ANALYZE), and indexing fundamentals.",
    hint: "Explain identifying sequential table scans, creating composite indexes matching the query predicate equality/range order (ESR rule), or covering indexes.",
    tags: ["database", "postgresql", "mongodb", "sql"],
  },
  {
    question: "If your core application database went down unexpectedly right now, what does the user experience look like, and how is your system architected to fail gracefully without silent data loss?",
    category: "Project Based",
    difficulty: "Hard",
    reason: "Probes fault-tolerance, circuit breaking, fallback degradation, and transaction durability.",
    hint: "Circuit breaker to stop hammering the down database, caching read responses in Redis/CDN, queueing critical writes in an asynchronous durable buffer (Kafka/SQS).",
    tags: ["system design", "backend", "architecture"],
  },

  // 4. Job Description & Gap Exploration
  {
    question: "The target job description emphasizes cloud infrastructure and deployment automation. How would you design a zero-downtime Blue-Green or Canary deployment pipeline for your services?",
    category: "Job Description Specific",
    difficulty: "Medium",
    reason: "Evaluates familiarity with continuous delivery, health verification, and traffic shifting required by the target role.",
    hint: "Run both Blue (current) and Green (new) environments; route test traffic to Green with automated synthetic tests; shift load balancer weighting gradually.",
    tags: ["ci/cd", "docker", "aws", "kubernetes", "devops"],
  },
  {
    question: "This role requires designing scalable distributed APIs. How do you implement idempotent API endpoints for non-safe HTTP methods like POST to prevent duplicate billing or orders upon network retries?",
    category: "Job Description Specific",
    difficulty: "Hard",
    reason: "Directly tests an essential distributed systems requirement frequently stated in senior SDE job specifications.",
    hint: "Client generates unique Idempotency-Key header; server uses atomic Redis set-if-not-exists (SETNX) with status IN_PROGRESS, caching the final response payload.",
    tags: ["rest apis", "system design", "distributed systems"],
  },
  {
    question: "The position mentions GraphQL or microservices integration. What are the key architectural trade-offs between a monolithic REST API and a federated GraphQL gateway?",
    category: "Job Description Specific",
    difficulty: "Hard",
    reason: "Tests understanding of modern API paradigms and the N+1 problem inherent in federated graphs.",
    hint: "GraphQL eliminates over-fetching and allows flexible client-driven schemas but introduces query complexity risks, caching difficulties at the HTTP layer, and N+1 data loader needs.",
    tags: ["graphql", "rest apis", "architecture"],
  },

  // 5. System Design & Scalability
  {
    question: "How would you design a distributed rate limiter for a public REST API tier that enforces 100 requests per minute per IP address across 10 distinct load-balanced server instances?",
    category: "System Design",
    difficulty: "Hard",
    reason: "Tests distributed state synchronization, atomic operations, and memory efficiency under scale.",
    hint: "Use Redis sliding window log with sorted sets (ZADD/ZREMRANGEBYSCORE) or sliding window counter with Lua scripts for atomic single-roundtrip execution.",
    tags: ["system design", "redis", "backend"],
  },
  {
    question: "When designing a distributed service that requires both high availability and consistency across geographical regions, how do you navigate the CAP theorem and PACELC trade-offs?",
    category: "System Design",
    difficulty: "Hard",
    reason: "Determines whether the candidate can think in macro architectural principles rather than simple single-node implementations.",
    hint: "Network partitions are unavoidable; choose between consistency (refusing writes) or availability (accepting writes with eventual consistency); during normal ops, trade latency for consistency.",
    tags: ["system design", "architecture", "distributed systems"],
  },
  {
    question: "How do you systematically handle database schema migrations in a 24/7 production system without locking tables or breaking running application instances during rolling deployments?",
    category: "System Design",
    difficulty: "Medium",
    reason: "Evaluates operational maturity, backward compatibility discipline, and zero-downtime engineering.",
    hint: "Expand/Contract pattern: add nullable column, deploy code writing to both old and new, backfill historical data, switch reads to new, deprecate and drop old column.",
    tags: ["database", "postgresql", "sql", "devops", "system design"],
  },
  {
    question: "How would you architect a distributed telemetry and logging pipeline processing 50,000 log events per second without choking application API servers?",
    category: "System Design",
    difficulty: "Hard",
    reason: "Tests asynchronous buffering, backpressure management, and distributed streaming architecture.",
    hint: "Buffer logs in local daemon (Fluentd/Vector), publish asynchronously to Kafka / Kinesis streaming partitions, and consume via batch consumers into OpenSearch.",
    tags: ["system design", "architecture", "distributed systems"],
  },
  {
    question: "How would you design a distributed URL shortening service (like TinyURL / Bitly) handling 100M daily active writes and 1B daily reads, including database partitioning and caching?",
    category: "System Design",
    difficulty: "Hard",
    reason: "Standard high-scale system design question evaluating key generation, base62 encoding, read replication, and Redis cache sizing.",
    hint: "Pre-generate unique 64-bit integer IDs with Snowflake or ZooKeeper range allocation, convert to Base62, shard by URL hash, and cache hot 20% URLs in Redis cluster.",
    tags: ["system design", "distributed systems", "caching"],
  },

  // 6. Problem Solving & Scenarios
  {
    question: "Your Node.js production service starts showing steadily climbing memory usage until it crashes with an Out-of-Memory (OOM) error every 6 hours. Walk me through your step-by-step diagnostic strategy.",
    category: "Scenario",
    difficulty: "Medium",
    reason: "Tests real-world debugging discipline, memory heap profiling, and root-cause analysis under production pressure.",
    hint: "Inspect V8 heap snapshots with --inspect, take comparative heap diffs across time intervals, check for global arrays/event listener leaks, unclosed streams, or unbounded caches.",
    tags: ["node.js", "debugging", "backend"],
  },
  {
    question: "A critical customer reports that their private account data briefly appeared on another logged-in user's screen during peak morning traffic. What vulnerability or architecture bug could cause this?",
    category: "Scenario",
    difficulty: "Hard",
    reason: "Probes security intuition, shared mutable state hazards, and cache misconfiguration.",
    hint: "Investigate shared module-level state in Node.js server, reverse proxy / CDN caching of authenticated responses without 'Cache-Control: private', or async context leakage.",
    tags: ["security", "backend", "debugging"],
  },
  {
    question: "Two microservices simultaneously attempt to update the inventory balance of a high-demand item with only 1 unit remaining. How do you prevent a double-spend race condition?",
    category: "Scenario",
    difficulty: "Medium",
    reason: "Evaluates concurrency handling, transactional boundaries, and isolation levels.",
    hint: "Use database optimistic concurrency with version numbers, pessimistic row-level locking (SELECT FOR UPDATE), or atomic conditional updates: UPDATE items SET count = count - 1 WHERE id = ? AND count > 0.",
    tags: ["database", "concurrency", "backend"],
  },

  // 7. Behavioral & Engineering Ownership
  {
    question: "Tell me about a time you discovered a critical bug or security flaw in production code right after releasing a sprint milestone. How did you communicate with stakeholders and resolve the incident?",
    category: "Behavioral",
    difficulty: "Medium",
    reason: "Evaluates accountability, calm prioritization under duress, transparent communication, and blameless postmortem culture.",
    hint: "Demonstrate immediate triage, transparent stakeholder notification with clear risk assessment, rolling back or hotfixing, followed by root-cause analysis and automated guardrail prevention.",
    tags: ["behavioral", "leadership"],
  },
  {
    question: "Describe a technical disagreement you had with another engineer or tech lead regarding an architectural decision. How did you advocate for your point of view, and what was the outcome?",
    category: "Behavioral",
    difficulty: "Medium",
    reason: "Tests collaboration, data-driven persuasion, humility, and willingness to 'disagree and commit' for team velocity.",
    hint: "Focus on presenting objective benchmark data or prototypes rather than opinion, actively listening to alternative trade-offs, and committing wholeheartedly to the final team consensus.",
    tags: ["behavioral", "leadership"],
  },
  {
    question: "How do you balance the pressure to deliver product features rapidly against the need to refactor technical debt and maintain robust automated test coverage?",
    category: "Behavioral",
    difficulty: "Medium",
    reason: "Evaluates pragmatic engineering judgment, commercial awareness, and long-term sustainability.",
    hint: "Advocate for incremental refactoring ('Boy Scout rule'), reserving a dedicated percentage of sprint bandwidth (15-20%) for tech debt, and framing refactoring in terms of business velocity and defect reduction.",
    tags: ["behavioral", "leadership"],
  },

  // 8. Rapid Fire / Conceptual Screener
  {
    question: "What is the primary difference between process.nextTick() and setImmediate() in the Node.js event loop?",
    category: "Rapid Fire",
    difficulty: "Easy",
    reason: "Rapidly screens Node.js core lifecycle familiarity.",
    hint: "process.nextTick() fires immediately after the current operation finishes before any event loop I/O or timers; setImmediate() fires during the Check phase of the event loop.",
    tags: ["node.js", "javascript", "rapid-fire"],
  },
  {
    question: "Why can't you call React hooks inside regular loops, conditions, or nested functions?",
    category: "Rapid Fire",
    difficulty: "Easy",
    reason: "Rapidly screens fundamental understanding of React's internal hook call-order array.",
    hint: "React relies on the exact order in which hooks are called across renders to match up internal state arrays; conditionals disrupt this sequential index alignment.",
    tags: ["react", "frontend", "rapid-fire"],
  },
  {
    question: "What is the difference between an INNER JOIN and an LEFT JOIN in SQL, and when does a LEFT JOIN produce NULL values in the output?",
    category: "Rapid Fire",
    difficulty: "Easy",
    reason: "Tests foundational relational database querying fundamentals.",
    hint: "INNER JOIN returns only matching records from both tables; LEFT JOIN returns all rows from the left table and fills non-matching right-table columns with NULL.",
    tags: ["sql", "database", "rapid-fire"],
  },
  {
    question: "What does the HTTP 409 Conflict status code represent, and give an example of when an API should return it.",
    category: "Rapid Fire",
    difficulty: "Easy",
    reason: "Tests RESTful status code semantic accuracy.",
    hint: "Indicates the request could not be processed because of a conflict with the current resource state, such as attempting to register with an already existing email address.",
    tags: ["rest apis", "rapid-fire"],
  },
  {
    question: "What is the difference between symmetric and asymmetric encryption, and which one does TLS/HTTPS use during data transmission?",
    category: "Rapid Fire",
    difficulty: "Easy",
    reason: "Verifies foundational security and transport layer knowledge.",
    hint: "Symmetric uses one shared key; asymmetric uses public/private pairs; HTTPS uses asymmetric for initial key exchange handshake, then switches to fast symmetric encryption for session data.",
    tags: ["security", "rapid-fire"],
  },
];

/**
 * Shuffles an array non-deterministically
 */
const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generates 12 to 15 dynamic, non-cached interview questions
 */
const generateDynamicInterviewQuestions = ({
  resumeText = "",
  jobDescription = "",
  mode = "Mixed",
  difficulty = "Mixed",
  previousQuestions = [],
  role = "Software Development Engineer",
}) => {
  const resumeLower = (resumeText || "").toLowerCase();
  const jdLower = (jobDescription || "").toLowerCase();
  const prevLower = (Array.isArray(previousQuestions) ? previousQuestions : []).map((q) =>
    (typeof q === "string" ? q : q.question || "").toLowerCase().trim()
  );

  // 1. Filter out previously asked questions to eliminate repetition
  const pool = QUESTION_BANK.filter((q) => {
    const qText = q.question.toLowerCase().trim();
    // Exclude if exact question or high substring overlap exists in previous questions
    const isPrevious = prevLower.some((prev) => prev && (prev === qText || prev.includes(qText.slice(0, 30)) || qText.includes(prev.slice(0, 30))));
    return !isPrevious;
  });

  // Fallback to full pool if exclusion depleted available items
  const activePool = pool.length >= 15 ? pool : QUESTION_BANK;

  // 2. Score candidates based on relevance to resume, JD, mode, and difficulty
  const scored = activePool.map((item) => {
    let weight = Math.random() * 20; // Natural entropy for fresh generation

    // Technology match against resume or JD
    if (item.tags) {
      item.tags.forEach((tag) => {
        if (resumeLower.includes(tag)) weight += 15;
        if (jdLower.includes(tag)) weight += 15;
      });
    }

    // Mode match
    if (mode === "Technical" && (item.category === "Technical" || item.category === "Rapid Fire")) weight += 50;
    if (mode === "Resume Based" && item.category === "Resume Based") weight += 60;
    if (mode === "Project Based" && item.category === "Project Based") weight += 60;
    if (mode === "Behavioral" && item.category === "Behavioral") weight += 70;
    if (mode === "System Design" && (item.category === "System Design" || (item.tags && item.tags.includes("system design")))) weight += 70;
    if (mode === "Rapid Fire" && item.category === "Rapid Fire") weight += 60;

    // Difficulty match
    if (difficulty !== "Mixed" && item.difficulty.toLowerCase() === difficulty.toLowerCase()) {
      weight += 35;
    }

    return { ...item, weight };
  });

  // Sort by weight descending
  scored.sort((a, b) => b.weight - a.weight);

  // Target count: between 12 and 15
  const targetCount = Math.floor(Math.random() * 4) + 12; // 12, 13, 14, or 15

  // When a specific mode is requested, ensure matching items take priority
  let selected = [];
  if (mode && mode !== "Mixed") {
    const modeMatches = scored.filter((item) => {
      if (mode === "Technical") return item.category === "Technical" || item.category === "Rapid Fire";
      if (mode === "System Design") return item.category === "System Design" || (item.tags && item.tags.includes("system design"));
      return item.category.toLowerCase() === mode.toLowerCase();
    });
    selected.push(...modeMatches);
  }

  // Fill remaining slots up to targetCount from highest scored candidates
  for (const item of scored) {
    if (selected.length >= targetCount) break;
    if (!selected.some((s) => s.question === item.question)) {
      selected.push(item);
    }
  }

  const finalQuestions = shuffleArray(selected).slice(0, targetCount);

  // Format into clean structured question objects
  const structuredQuestions = finalQuestions.map((q) => ({
    question: q.question,
    category: q.category,
    difficulty: q.difficulty,
    reason: q.reason || `Evaluates candidate's competency in ${q.category} for the ${role} role.`,
    hint: q.hint || "Articulate the core engineering trade-offs and explain real-world failure modes.",
  }));

  const likelyTopics = Array.from(
    new Set(
      finalQuestions.flatMap((q) => q.tags || [q.category]).map((t) => t.toUpperCase())
    )
  ).slice(0, 6);

  return {
    questions: structuredQuestions,
    likelyTopics,
    likelyQuestions: structuredQuestions.map((q) => q.question),
    _meta: {
      provider: "heuristic",
      model: "dynamic-interviewer-v2",
      mode,
      difficulty,
      count: structuredQuestions.length,
    },
  };
};

const analyzeInterviewQuestions = ({
  resumeText = "",
  jobDescription = "",
  mode = "Mixed",
  difficulty = "Mixed",
  previousQuestions = [],
  role = "Software Development Engineer",
  skills = "",
  topic = "Full Stack & System Architecture",
  level = "Intermediate",
}) => {
  return generateDynamicInterviewQuestions({
    resumeText: resumeText || skills,
    jobDescription: jobDescription || `${role} ${topic} ${level}`,
    mode,
    difficulty,
    previousQuestions,
    role,
  });
};
module.exports = {
  analyzeResume,
  analyzeInterviewQuestions,
  generateDynamicInterviewQuestions,
};
