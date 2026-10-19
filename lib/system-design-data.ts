export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  avatarUrl?: string;
  subscriberCount?: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  description: string;
  category: string;
  topPlaylists: string[];
  tags: string[];
  featuredVideo: string;
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface GitHubRepo {
  id: string;
  title: string;
  repo: string;
  url: string;
  stars?: string;
  description: string;
  topics: string[];
  highlight: string;
}

export interface EngineeringBlog {
  id: string;
  company: string;
  url: string;
  logoDomain: string;
  description: string;
  mustReadArticle: {
    title: string;
    topic: string;
  };
  tags: string[];
}

export interface BookOrWhitepaper {
  id: string;
  type: "book" | "paper";
  title: string;
  author: string;
  url: string;
  description: string;
  keyTakeaway: string;
  coverImageUrl?: string;
  fallbackImageUrl?: string;
  publicationYear?: number;
  publisher?: string;
  imageSource?: string;
  isbn?: string;
  venue?: string;
}

export interface ArchitecturalCheatSheet {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
}

export interface SystemDesignDataset {
  metadata: {
    title: string;
    version: string;
    totalResources: number;
    counts: {
      youtubeChannels: number;
      githubRepos: number;
      engineeringBlogs: number;
      booksAndWhitepapers: number;
      architecturalCheatSheets: number;
    };
  };
  youtubeChannels: YouTubeChannel[];
  githubRepos: GitHubRepo[];
  engineeringBlogs: EngineeringBlog[];
  booksAndWhitepapers: BookOrWhitepaper[];
  architecturalCheatSheets: ArchitecturalCheatSheet[];
}

export const SYSTEM_DESIGN_DATA: SystemDesignDataset = {
  metadata: {
    title: "Algoryn System Design Resource Dataset",
    version: "2.2",
    totalResources: 153,
    counts: {
      youtubeChannels: 62,
      githubRepos: 28,
      engineeringBlogs: 50,
      booksAndWhitepapers: 13,
      architecturalCheatSheets: 0
    }
  },
  youtubeChannels: [
  {
    "id": "yt-bytebytego",
    "name": "ByteByteGo",
    "handle": "@ByteByteGo",
    "url": "https://www.youtube.com/@ByteByteGo",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=bytebytego.com&sz=128",
    "subscriberCount": "1.2M+",
    "level": "Beginner",
    "description": "Visual explanations of system design concepts and large-scale architectures.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design",
      "System Design 101"
    ],
    "tags": [
      "system-design",
      "architecture",
      "visual-learning",
      "interview-prep"
    ],
    "featuredVideo": "Ex-YouTube Engineer Rebuilds YouTube in 45 Mins",
    "videoId": "E5Ef_Kne17U",
    "videoUrl": "https://www.youtube.com/watch?v=E5Ef_Kne17U",
    "thumbnailUrl": "https://i.ytimg.com/vi/E5Ef_Kne17U/hqdefault.jpg"
  },
  {
    "id": "yt-gaurav-sen",
    "name": "Gaurav Sen",
    "handle": "@gkcs",
    "url": "https://www.youtube.com/@gkcs",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "550K+",
    "level": "Intermediate",
    "description": "Distributed systems, scalability, caching, sharding, and interview-style designs.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design",
      "Distributed Systems"
    ],
    "tags": [
      "distributed-systems",
      "interview-prep",
      "scalability"
    ],
    "featuredVideo": "System Design Primer ⭐️: How to start with distributed systems?",
    "videoId": "SqcXvc3ZmRU",
    "videoUrl": "https://www.youtube.com/watch?v=SqcXvc3ZmRU",
    "thumbnailUrl": "https://i.ytimg.com/vi/SqcXvc3ZmRU/hqdefault.jpg"
  },
  {
    "id": "yt-jordan-has-no-life",
    "name": "Jordan has no life",
    "handle": "@jordanhasnolife5163",
    "url": "https://www.youtube.com/@jordanhasnolife5163",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "120K+",
    "level": "Intermediate",
    "description": "Long-form explanations of distributed systems concepts and system design interview problems.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design",
      "Distributed Systems"
    ],
    "tags": [
      "distributed-systems",
      "deep-dives",
      "interview-prep"
    ],
    "featuredVideo": "What is Apache Iggy (vs. Kafka)? | Distributed Systems Deep Dives With Ex-Google SWE",
    "videoId": "VHGC7mr30nk",
    "videoUrl": "https://www.youtube.com/watch?v=VHGC7mr30nk",
    "thumbnailUrl": "https://i.ytimg.com/vi/VHGC7mr30nk/hqdefault.jpg"
  },
  {
    "id": "yt-hussein-nasser",
    "name": "Hussein Nasser",
    "handle": "@hnasr",
    "url": "https://www.youtube.com/@hnasr",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=hnasr.com&sz=128",
    "subscriberCount": "410K+",
    "level": "Advanced",
    "description": "Backend engineering, networking, databases, proxies, protocols, and performance.",
    "category": "backend-engineering",
    "topPlaylists": [
      "Backend Engineering",
      "Networking",
      "Databases"
    ],
    "tags": [
      "backend",
      "networking",
      "databases",
      "performance"
    ],
    "featuredVideo": "you won't forget how postgres works after this",
    "videoId": "q9jixKv4h2I",
    "videoUrl": "https://www.youtube.com/watch?v=q9jixKv4h2I",
    "thumbnailUrl": "https://i.ytimg.com/vi/q9jixKv4h2I/hqdefault.jpg"
  },
  {
    "id": "yt-arpit-bhayani",
    "name": "Arpit Bhayani",
    "handle": "@AsliEngineering",
    "url": "https://www.youtube.com/@AsliEngineering",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=arpitbhayani.me&sz=128",
    "subscriberCount": "115K+",
    "level": "Advanced",
    "description": "Database internals, Redis, queues, storage engines, and production engineering.",
    "category": "database-engineering",
    "topPlaylists": [
      "System Design",
      "Database Internals"
    ],
    "tags": [
      "database-internals",
      "redis",
      "storage",
      "backend"
    ],
    "featuredVideo": "Quantization Fundamentals - How LLMs are Served Efficiently with Low Memory - Inference Engineering",
    "videoId": "FZQpsLfr4xY",
    "videoUrl": "https://www.youtube.com/watch?v=FZQpsLfr4xY",
    "thumbnailUrl": "https://i.ytimg.com/vi/FZQpsLfr4xY/hqdefault.jpg"
  },
  {
    "id": "yt-neetcode",
    "name": "NeetCode",
    "handle": "@NeetCodeIO",
    "url": "https://www.youtube.com/@NeetCodeIO",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=neetcode.io&sz=128",
    "subscriberCount": "1.1M+",
    "level": "Beginner",
    "description": "Coding interview preparation with some system design and software engineering content.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design",
      "Coding Interviews"
    ],
    "tags": [
      "interview-prep",
      "coding",
      "system-design"
    ],
    "featuredVideo": "Design a URL Shortener (Bitly) - System Design Interview",
    "videoId": "qSJAvd5Mgio",
    "videoUrl": "https://www.youtube.com/watch?v=qSJAvd5Mgio",
    "thumbnailUrl": "https://i.ytimg.com/vi/qSJAvd5Mgio/hqdefault.jpg"
  },
  {
    "id": "yt-tech-dummies",
    "name": "Tech Dummies Narendra L",
    "handle": "@TechDummiesNarendraL",
    "url": "https://www.youtube.com/@TechDummiesNarendraL",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "125K+",
    "level": "Intermediate",
    "description": "System design interview walkthroughs and explanations of common architecture patterns.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Interview",
      "Distributed Systems"
    ],
    "tags": [
      "system-design",
      "interview-prep",
      "architecture"
    ],
    "featuredVideo": "NETFLIX System design | software architecture for netflix",
    "videoId": "psQzyFfsUGU",
    "videoUrl": "https://www.youtube.com/watch?v=psQzyFfsUGU",
    "thumbnailUrl": "https://i.ytimg.com/vi/psQzyFfsUGU/hqdefault.jpg"
  },
  {
    "id": "yt-codekarle",
    "name": "codeKarle",
    "handle": "@codeKarle",
    "url": "https://www.youtube.com/@codeKarle",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "110K+",
    "level": "Intermediate",
    "description": "System design interview preparation with structured problem breakdowns.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Interview Questions"
    ],
    "tags": [
      "system-design",
      "interview-prep",
      "hld"
    ],
    "featuredVideo": "Amazon System Design | Flipkart System Design | System Design Interview Question",
    "videoId": "EpASu_1dUdE",
    "videoUrl": "https://www.youtube.com/watch?v=EpASu_1dUdE",
    "thumbnailUrl": "https://i.ytimg.com/vi/EpASu_1dUdE/hqdefault.jpg"
  },
  {
    "id": "yt-hello-interview",
    "name": "Hello Interview",
    "handle": "@hello_interview",
    "url": "https://www.youtube.com/@hello_interview",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=hellointerview.com&sz=128",
    "subscriberCount": "65K+",
    "level": "Intermediate",
    "description": "System design interview frameworks, walkthroughs, and mock interview discussions.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design",
      "Mock Interviews"
    ],
    "tags": [
      "system-design",
      "mock-interviews",
      "faang"
    ],
    "featuredVideo": "Vector Databases Explained for System Design Interviews",
    "videoId": "Fq73E8DQprc",
    "videoUrl": "https://www.youtube.com/watch?v=Fq73E8DQprc",
    "thumbnailUrl": "https://i.ytimg.com/vi/Fq73E8DQprc/hqdefault.jpg"
  },
  {
    "id": "yt-exponent",
    "name": "Exponent",
    "handle": "@aced_io",
    "url": "https://www.youtube.com/@aced_io",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=tryexponent.com&sz=128",
    "subscriberCount": "320K+",
    "level": "Intermediate",
    "description": "Interview preparation including system design, behavioral interviews, and career guidance.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Interviews",
      "Technical Interviews"
    ],
    "tags": [
      "interview-prep",
      "system-design",
      "career"
    ],
    "featuredVideo": "Design Google Docs | System Design Interview (with Amazon Engineer, ex-Microsoft)",
    "videoId": "cL9If4X7aaE",
    "videoUrl": "https://www.youtube.com/watch?v=cL9If4X7aaE",
    "thumbnailUrl": "https://i.ytimg.com/vi/cL9If4X7aaE/hqdefault.jpg"
  },
  {
    "id": "yt-freecodecamp",
    "name": "freeCodeCamp.org",
    "handle": "@freecodecamp",
    "url": "https://www.youtube.com/@freecodecamp",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=freecodecamp.org&sz=128",
    "subscriberCount": "10.5M+",
    "level": "Beginner",
    "description": "Long-form free courses on software engineering, architecture, and distributed systems.",
    "category": "software-engineering",
    "topPlaylists": [
      "System Design",
      "Software Engineering"
    ],
    "tags": [
      "free-courses",
      "system-design",
      "software-engineering"
    ],
    "featuredVideo": "System Design Course – APIs, Databases, Caching, CDNs, Load Balancing & Production Infra",
    "videoId": "C842vFY5kRo",
    "videoUrl": "https://www.youtube.com/watch?v=C842vFY5kRo",
    "thumbnailUrl": "https://i.ytimg.com/vi/C842vFY5kRo/hqdefault.jpg"
  },
  {
    "id": "yt-martin-kleppmann",
    "name": "Martin Kleppmann",
    "handle": "@kleppmann",
    "url": "https://www.youtube.com/@kleppmann",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=martinkleppmann.com&sz=128",
    "subscriberCount": "45K+",
    "level": "Advanced",
    "description": "Talks and lectures on distributed systems, data-intensive applications, and consistency.",
    "category": "distributed-systems",
    "topPlaylists": [
      "Distributed Systems",
      "Data-Intensive Applications"
    ],
    "tags": [
      "distributed-systems",
      "consistency",
      "research"
    ],
    "featuredVideo": "Distributed Systems 1.1: Introduction",
    "videoId": "UEAMfLPZZhE",
    "videoUrl": "https://www.youtube.com/watch?v=UEAMfLPZZhE",
    "thumbnailUrl": "https://i.ytimg.com/vi/UEAMfLPZZhE/hqdefault.jpg"
  },
  {
    "id": "yt-mit-distributed",
    "name": "MIT OpenCourseWare",
    "handle": "@mitocw",
    "url": "https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=ocw.mit.edu&sz=128",
    "subscriberCount": "5.2M+",
    "level": "Advanced",
    "description": "University lectures covering distributed systems, algorithms, and computer science foundations.",
    "category": "academic-systems",
    "topPlaylists": [
      "Distributed Systems",
      "Computer Science"
    ],
    "tags": [
      "university",
      "distributed-systems",
      "theory"
    ],
    "featuredVideo": "Lecture 1: Introduction",
    "videoId": "cQP8WApzIQQ",
    "videoUrl": "https://www.youtube.com/watch?v=cQP8WApzIQQ",
    "thumbnailUrl": "https://i.ytimg.com/vi/cQP8WApzIQQ/hqdefault.jpg"
  },
  {
    "id": "yt-berkeley-cs162",
    "name": "UC Berkeley CS162",
    "handle": "@johnkubiatowicz3737",
    "url": "https://www.youtube.com/@johnkubiatowicz3737",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=berkeley.edu&sz=128",
    "subscriberCount": "150K+",
    "level": "Advanced",
    "description": "University material relevant to operating systems, cloud computing, and distributed systems.",
    "category": "academic-systems",
    "topPlaylists": [
      "Computer Science Lectures"
    ],
    "tags": [
      "university",
      "systems",
      "operating-systems"
    ],
    "featuredVideo": "CS162 Lecture 25: Distributed Storage, NFS and AFS, Key Value Stores",
    "videoId": "ROq0rGmR3GE",
    "videoUrl": "https://www.youtube.com/watch?v=ROq0rGmR3GE",
    "thumbnailUrl": "https://i.ytimg.com/vi/ROq0rGmR3GE/hqdefault.jpg"
  },
  {
    "id": "yt-constantin-serban",
    "name": "Tushar Roy - Coding Made Simple",
    "handle": "@tusharroy2525",
    "url": "https://www.youtube.com/@tusharroy2525",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "30K+",
    "level": "Intermediate",
    "description": "System design and interview explanations covering real-world architecture.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design"
    ],
    "tags": [
      "system-design",
      "architecture",
      "interview-prep"
    ],
    "featuredVideo": "System Design Introduction For Interview.",
    "videoId": "UzLMhqg3_Wc",
    "videoUrl": "https://www.youtube.com/watch?v=UzLMhqg3_Wc",
    "thumbnailUrl": "https://i.ytimg.com/vi/UzLMhqg3_Wc/hqdefault.jpg"
  },
  {
    "id": "yt-concept-coding",
    "name": "Concept && Coding - by Shrayansh",
    "handle": "@ConceptAndCodingByShrayansh",
    "url": "https://www.youtube.com/@ConceptAndCodingByShrayansh",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "180K+",
    "level": "Intermediate",
    "description": "Low-level design, object-oriented design, design patterns, and interview preparation.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "Low Level Design",
      "Design Patterns"
    ],
    "tags": [
      "lld",
      "oop",
      "design-patterns",
      "interview-prep"
    ],
    "featuredVideo": "Ultimate LLD and HLD Roadmap | System Design RoadMap | LLD & HLD Topics to be covered for Interview",
    "videoId": "rliSgjoOFTs",
    "videoUrl": "https://www.youtube.com/watch?v=rliSgjoOFTs",
    "thumbnailUrl": "https://i.ytimg.com/vi/rliSgjoOFTs/hqdefault.jpg"
  },
  {
    "id": "yt-educative",
    "name": "Educative",
    "handle": "@educativeinc",
    "url": "https://www.youtube.com/@educativeinc",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=educative.io&sz=128",
    "subscriberCount": "75K+",
    "level": "Beginner",
    "description": "Interview preparation and software engineering explainers, including system design topics.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design",
      "Coding Interviews"
    ],
    "tags": [
      "system-design",
      "interview-prep",
      "learning"
    ],
    "featuredVideo": "Ruby on Rails Creator Says Coding is Apparently Dead... Again?",
    "videoId": "iIrClYdAuXI",
    "videoUrl": "https://www.youtube.com/watch?v=iIrClYdAuXI",
    "thumbnailUrl": "https://i.ytimg.com/vi/iIrClYdAuXI/hqdefault.jpg"
  },
  {
    "id": "yt-infoq",
    "name": "InfoQ",
    "handle": "@InfoQ",
    "url": "https://www.youtube.com/@InfoQ",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=infoq.com&sz=128",
    "subscriberCount": "380K+",
    "level": "Advanced",
    "description": "Conference talks and engineering case studies on architecture, cloud, and distributed systems.",
    "category": "architecture-talks",
    "topPlaylists": [
      "Software Architecture",
      "Distributed Systems"
    ],
    "tags": [
      "architecture",
      "engineering-talks",
      "production-systems"
    ],
    "featuredVideo": "The Future of Web Apps: Will AI Agents Generate UIs on the Fly?",
    "videoId": "Q3ehiNbgEZU",
    "videoUrl": "https://www.youtube.com/watch?v=Q3ehiNbgEZU",
    "thumbnailUrl": "https://i.ytimg.com/vi/Q3ehiNbgEZU/hqdefault.jpg"
  },
  {
    "id": "yt-extra-success-in-tech",
    "name": "Success in Tech",
    "handle": "@SuccessInTech",
    "url": "https://www.youtube.com/@SuccessInTech",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "160K+",
    "level": "Intermediate",
    "description": "System design interview walkthroughs and career-oriented engineering explanations.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Interviews"
    ],
    "tags": [
      "system-design",
      "interview-prep",
      "career"
    ],
    "featuredVideo": "High Availability Architectures PART 2 - Datastores - Multi-Region HA DB architecture",
    "videoId": "-bCbTDjW8fc",
    "videoUrl": "https://www.youtube.com/watch?v=-bCbTDjW8fc",
    "thumbnailUrl": "https://i.ytimg.com/vi/-bCbTDjW8fc/hqdefault.jpg"
  },
  {
    "id": "yt-extra-bytemonk",
    "name": "ByteMonk",
    "handle": "@ByteMonk",
    "url": "https://www.youtube.com/@ByteMonk",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "45K+",
    "level": "Beginner",
    "description": "System design fundamentals, architecture concepts, and interview preparation.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Fundamentals"
    ],
    "tags": [
      "system-design",
      "architecture",
      "interview-prep"
    ],
    "featuredVideo": "The Engineering Behind Uber’s Real-Time Maps",
    "videoId": "R_wWbHqpQTg",
    "videoUrl": "https://www.youtube.com/watch?v=R_wWbHqpQTg",
    "thumbnailUrl": "https://i.ytimg.com/vi/R_wWbHqpQTg/hqdefault.jpg"
  },
  {
    "id": "yt-extra-techworld-nana",
    "name": "TechWorld with Nana",
    "handle": "@TechWorldwithNana",
    "url": "https://www.youtube.com/@TechWorldwithNana",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=techworld-with-nana.com&sz=128",
    "subscriberCount": "1.1M+",
    "level": "Beginner",
    "description": "Docker, Kubernetes, CI/CD, cloud-native infrastructure, and DevOps.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "Kubernetes",
      "Docker",
      "DevOps"
    ],
    "tags": [
      "kubernetes",
      "docker",
      "devops",
      "cloud-native"
    ],
    "featuredVideo": "You're Not Lazy. Your Learning Method Is Broken. Here's How To Fix It...",
    "videoId": "EcpYM__4c8E",
    "videoUrl": "https://www.youtube.com/watch?v=EcpYM__4c8E",
    "thumbnailUrl": "https://i.ytimg.com/vi/EcpYM__4c8E/hqdefault.jpg"
  },
  {
    "id": "yt-extra-arjan-codes",
    "name": "ArjanCodes",
    "handle": "@ArjanCodes",
    "url": "https://www.youtube.com/@ArjanCodes",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=arjancodes.com&sz=128",
    "subscriberCount": "420K+",
    "level": "Intermediate",
    "description": "Software design, maintainability, design principles, and Python architecture.",
    "category": "software-architecture",
    "topPlaylists": [
      "Software Design",
      "Design Patterns"
    ],
    "tags": [
      "software-design",
      "architecture",
      "design-principles"
    ],
    "featuredVideo": "7 Python Features That Make Your Code Worse",
    "videoId": "RHCyTWaRZSk",
    "videoUrl": "https://www.youtube.com/watch?v=RHCyTWaRZSk",
    "thumbnailUrl": "https://i.ytimg.com/vi/RHCyTWaRZSk/hqdefault.jpg"
  },
  {
    "id": "yt-extra-codeopinion",
    "name": "CodeOpinion",
    "handle": "@CodeOpinion",
    "url": "https://www.youtube.com/@CodeOpinion",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=codeopinion.com&sz=128",
    "subscriberCount": "140K+",
    "level": "Advanced",
    "description": "Domain-driven design, event-driven architecture, CQRS, and service boundaries.",
    "category": "software-architecture",
    "topPlaylists": [
      "Event-Driven Architecture",
      "Domain-Driven Design"
    ],
    "tags": [
      "ddd",
      "cqrs",
      "event-driven",
      "microservices"
    ],
    "featuredVideo": "Stop Modeling Everything as CRUD",
    "videoId": "YKChn1Qt8-8",
    "videoUrl": "https://www.youtube.com/watch?v=YKChn1Qt8-8",
    "thumbnailUrl": "https://i.ytimg.com/vi/YKChn1Qt8-8/hqdefault.jpg"
  },
  {
    "id": "yt-extra-goto",
    "name": "GOTO Conferences",
    "handle": "@GOTO-",
    "url": "https://www.youtube.com/@GOTO-",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=gotopia.tech&sz=128",
    "subscriberCount": "580K+",
    "level": "Advanced",
    "description": "Software architecture talks, system design, engineering practices, and technical deep dives.",
    "category": "architecture-talks",
    "topPlaylists": [
      "Software Architecture",
      "Microservices"
    ],
    "tags": [
      "software-architecture",
      "distributed-systems",
      "engineering"
    ],
    "featuredVideo": "Ash Framework: Declarative Elixir Web Apps • Rebecca Le, Zach Daniel & C. Alexander • GOTO 2026",
    "videoId": "rjLEG38jM2g",
    "videoUrl": "https://www.youtube.com/watch?v=rjLEG38jM2g",
    "thumbnailUrl": "https://i.ytimg.com/vi/rjLEG38jM2g/hqdefault.jpg"
  },
  {
    "id": "yt-extra-cncf",
    "name": "CNCF",
    "handle": "@cncf",
    "url": "https://www.youtube.com/@cncf",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=cncf.io&sz=128",
    "subscriberCount": "220K+",
    "level": "Advanced",
    "description": "Cloud-native infrastructure, Kubernetes ecosystem, observability, and platform engineering.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "Cloud Native",
      "Kubernetes"
    ],
    "tags": [
      "cloud-native",
      "kubernetes",
      "observability"
    ],
    "featuredVideo": "Meet Itamar Holder - Speaker at KubeCon + CloudNativeCon North America",
    "videoId": "RGot8Hrl448",
    "videoUrl": "https://www.youtube.com/watch?v=RGot8Hrl448",
    "thumbnailUrl": "https://i.ytimg.com/vi/RGot8Hrl448/hqdefault.jpg"
  },
  {
    "id": "yt-extra-google-cloud-tech",
    "name": "Google Cloud Tech",
    "handle": "@GoogleCloudTech",
    "url": "https://www.youtube.com/@GoogleCloudTech",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128",
    "subscriberCount": "1.3M+",
    "level": "All Levels",
    "description": "Cloud architecture, data systems, infrastructure, and Google Cloud services.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "Architecture Framework",
      "Data & AI"
    ],
    "tags": [
      "cloud",
      "architecture",
      "data-platforms"
    ],
    "featuredVideo": "AI harness crash course",
    "videoId": "2C_CefSQEAQ",
    "videoUrl": "https://www.youtube.com/watch?v=2C_CefSQEAQ",
    "thumbnailUrl": "https://i.ytimg.com/vi/2C_CefSQEAQ/hqdefault.jpg"
  },
  {
    "id": "yt-extra-aws-events",
    "name": "AWS Events",
    "handle": "@AWSEventsChannel",
    "url": "https://www.youtube.com/@AWSEventsChannel",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128",
    "subscriberCount": "680K+",
    "level": "Advanced",
    "description": "AWS re:Invent and other talks on cloud architecture and large-scale systems.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "re:Invent Architecture",
      "Cloud Native"
    ],
    "tags": [
      "aws",
      "cloud-architecture",
      "conference-talks"
    ],
    "featuredVideo": "Stretto's Production-Scale GenAI Platform for Regulated Legal Workflows | AWS Events",
    "videoId": "EF7iowMYTw8",
    "videoUrl": "https://www.youtube.com/watch?v=EF7iowMYTw8",
    "thumbnailUrl": "https://i.ytimg.com/vi/EF7iowMYTw8/hqdefault.jpg"
  },
  {
    "id": "yt-extra-microsoft-developer",
    "name": "Microsoft Developer",
    "handle": "@MicrosoftDeveloper",
    "url": "https://www.youtube.com/@MicrosoftDeveloper",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
    "subscriberCount": "820K+",
    "level": "All Levels",
    "description": "Cloud, developer platforms, distributed application patterns, and engineering tooling.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "Distributed Systems",
      "Cloud Patterns"
    ],
    "tags": [
      "azure",
      "cloud",
      "developer-platform"
    ],
    "featuredVideo": "From Estate to Evidence with Fabric Database Hub | Data Exposed",
    "videoId": "XxuXK6CG_6k",
    "videoUrl": "https://www.youtube.com/watch?v=XxuXK6CG_6k",
    "thumbnailUrl": "https://i.ytimg.com/vi/XxuXK6CG_6k/hqdefault.jpg"
  },
  {
    "id": "yt-extra-mongodb",
    "name": "MongoDB",
    "handle": "@MongoDB",
    "url": "https://www.youtube.com/@MongoDB",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=mongodb.com&sz=128",
    "subscriberCount": "250K+",
    "level": "All Levels",
    "description": "Data modeling, database architecture, scaling, and application data patterns.",
    "category": "database-engineering",
    "topPlaylists": [
      "Schema Design",
      "Performance"
    ],
    "tags": [
      "database",
      "data-modeling",
      "scaling"
    ],
    "featuredVideo": "MongoDB Atlas Infinite: Scale Compute and Storage Independently | .local NYC 2026",
    "videoId": "yzT527FWczA",
    "videoUrl": "https://www.youtube.com/watch?v=yzT527FWczA",
    "thumbnailUrl": "https://i.ytimg.com/vi/yzT527FWczA/hqdefault.jpg"
  },
  {
    "id": "yt-extra-confluent",
    "name": "Confluent",
    "handle": "@Confluent",
    "url": "https://www.youtube.com/@Confluent",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=confluent.io&sz=128",
    "subscriberCount": "130K+",
    "level": "Advanced",
    "description": "Kafka, event streaming, stream processing, and event-driven architecture.",
    "category": "distributed-systems",
    "topPlaylists": [
      "Kafka Fundamentals",
      "Event Streaming"
    ],
    "tags": [
      "kafka",
      "event-streaming",
      "distributed-systems"
    ],
    "featuredVideo": "Confluent X VCARB: Every Second Means Everything",
    "videoId": "qOLMsBBdQbc",
    "videoUrl": "https://www.youtube.com/watch?v=qOLMsBBdQbc",
    "thumbnailUrl": "https://i.ytimg.com/vi/qOLMsBBdQbc/hqdefault.jpg"
  },
  {
    "id": "yt-extra-redis",
    "name": "Redis",
    "handle": "@Redisinc",
    "url": "https://www.youtube.com/@Redisinc",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=redis.io&sz=128",
    "subscriberCount": "95K+",
    "level": "All Levels",
    "description": "Caching, in-memory data structures, performance, and real-time data patterns.",
    "category": "database-engineering",
    "topPlaylists": [
      "Redis Architecture",
      "Caching Patterns"
    ],
    "tags": [
      "redis",
      "caching",
      "performance"
    ],
    "featuredVideo": "What we’ve learned building production agents: Context engineering in practice",
    "videoId": "6NqtzM1-hO0",
    "videoUrl": "https://www.youtube.com/watch?v=6NqtzM1-hO0",
    "thumbnailUrl": "https://i.ytimg.com/vi/6NqtzM1-hO0/hqdefault.jpg"
  },
  {
    "id": "yt-extra-postgresql",
    "name": "PostgreSQL Europe",
    "handle": "@pgeu",
    "url": "https://www.youtube.com/@pgeu",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=postgresql.org&sz=128",
    "subscriberCount": "80K+",
    "level": "Advanced",
    "description": "PostgreSQL community talks on internals, indexing, transactions, and operations.",
    "category": "database-engineering",
    "topPlaylists": [
      "Database Internals",
      "Query Optimization"
    ],
    "tags": [
      "postgresql",
      "database-internals",
      "transactions"
    ],
    "featuredVideo": "Anatomy of Table-Level Locks in PostgreSQL - Gülçin Yıldırım Jelinek",
    "videoId": "uY5tFCzNWSs",
    "videoUrl": "https://www.youtube.com/watch?v=uY5tFCzNWSs",
    "thumbnailUrl": "https://i.ytimg.com/vi/uY5tFCzNWSs/hqdefault.jpg"
  },
  {
    "id": "yt-extra-fireship",
    "name": "Fireship",
    "handle": "@Fireship",
    "url": "https://www.youtube.com/@Fireship",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=fireship.io&sz=128",
    "subscriberCount": "3.2M+",
    "level": "Beginner",
    "description": "Concise technical explainers on web infrastructure, databases, and software trends.",
    "category": "software-engineering",
    "topPlaylists": [
      "100 Seconds of Code",
      "Architecture"
    ],
    "tags": [
      "technical-explainers",
      "web",
      "databases"
    ],
    "featuredVideo": "The runtime wars are over... and Node won",
    "videoId": "l3L_lETiSzc",
    "videoUrl": "https://www.youtube.com/watch?v=l3L_lETiSzc",
    "thumbnailUrl": "https://i.ytimg.com/vi/l3L_lETiSzc/hqdefault.jpg"
  },
  {
    "id": "yt-extra-theprimetime",
    "name": "ThePrimeTime",
    "handle": "@ThePrimeTimeagen",
    "url": "https://www.youtube.com/@ThePrimeTimeagen",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "500K+",
    "level": "Intermediate",
    "description": "Software engineering discussions, developer tools, systems programming, and engineering trade-offs.",
    "category": "software-engineering",
    "topPlaylists": [
      "Engineering Discussions",
      "Systems Architecture"
    ],
    "tags": [
      "engineering",
      "systems-programming",
      "developer-tools"
    ],
    "featuredVideo": "Anthropic says No More",
    "videoId": "ASY_H2nLG8g",
    "videoUrl": "https://www.youtube.com/watch?v=ASY_H2nLG8g",
    "thumbnailUrl": "https://i.ytimg.com/vi/ASY_H2nLG8g/hqdefault.jpg"
  },
  {
    "id": "yt-extra-lowlevellearning",
    "name": "Low Level",
    "handle": "@LowLevelTV",
    "url": "https://www.youtube.com/@LowLevelTV",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "680K+",
    "level": "Advanced",
    "description": "Operating systems, security, performance, and low-level software behavior.",
    "category": "systems-fundamentals",
    "topPlaylists": [
      "Operating Systems",
      "C & Memory"
    ],
    "tags": [
      "systems-programming",
      "operating-systems",
      "performance"
    ],
    "featuredVideo": "I Tested The Viral Reverse Engineering Repo",
    "videoId": "qFEuYUfauNY",
    "videoUrl": "https://www.youtube.com/watch?v=qFEuYUfauNY",
    "thumbnailUrl": "https://i.ytimg.com/vi/qFEuYUfauNY/hqdefault.jpg"
  },
  {
    "id": "yt-extra-computerphile",
    "name": "Computerphile",
    "handle": "@Computerphile",
    "url": "https://www.youtube.com/@Computerphile",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
    "subscriberCount": "2.5M+",
    "level": "All Levels",
    "description": "Computer science fundamentals relevant to networks, security, algorithms, and systems.",
    "category": "systems-fundamentals",
    "topPlaylists": [
      "Networking",
      "Security",
      "Algorithms"
    ],
    "tags": [
      "computer-science",
      "networking",
      "fundamentals"
    ],
    "featuredVideo": "Multiplayer Gaming & Flight Simulation - Computerphile",
    "videoId": "WqrwAFs-fq0",
    "videoUrl": "https://www.youtube.com/watch?v=WqrwAFs-fq0",
    "thumbnailUrl": "https://i.ytimg.com/vi/WqrwAFs-fq0/hqdefault.jpg"
  },
  {
    "id": "yt-extra-designgurus",
    "name": "Design Gurus",
    "handle": "@designgurus1173",
    "url": "https://www.youtube.com/@designgurus1173",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=designgurus.io&sz=128",
    "subscriberCount": "90K+",
    "level": "Beginner",
    "description": "System design interview preparation and structured design walkthroughs.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "Grokking the System Design Interview"
    ],
    "tags": [
      "system-design",
      "interview-prep",
      "walkthroughs"
    ],
    "featuredVideo": "7 Database Indexes Every Backend Engineer Should Know",
    "videoId": "zfmcL1gbgYk",
    "videoUrl": "https://www.youtube.com/watch?v=zfmcL1gbgYk",
    "thumbnailUrl": "https://i.ytimg.com/vi/zfmcL1gbgYk/hqdefault.jpg"
  },
  {
    "id": "yt-extra-scaler",
    "name": "SCALER",
    "handle": "@SCALER",
    "url": "https://www.youtube.com/@SCALER",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=scaler.com&sz=128",
    "subscriberCount": "450K+",
    "level": "Intermediate",
    "description": "Software engineering, system design, interview preparation, and career learning.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Masterclass"
    ],
    "tags": [
      "system-design",
      "interview-prep",
      "software-engineering"
    ],
    "featuredVideo": "Should UPI Be Free? The Engineering Architecture of High-Scale Real-Time Payments",
    "videoId": "Yz-29qHvyzU",
    "videoUrl": "https://www.youtube.com/watch?v=Yz-29qHvyzU",
    "thumbnailUrl": "https://i.ytimg.com/vi/Yz-29qHvyzU/hqdefault.jpg"
  },
  {
    "id": "yt-extra-edureka",
    "name": "edureka!",
    "handle": "@edurekaIN",
    "url": "https://www.youtube.com/@edurekaIN",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=edureka.co&sz=128",
    "subscriberCount": "4.1M+",
    "level": "Beginner",
    "description": "Long-form tutorials on cloud platforms, databases, DevOps, and software technologies.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "System Design Full Course"
    ],
    "tags": [
      "cloud",
      "databases",
      "devops"
    ],
    "featuredVideo": "What is MCP? | How Model Context Protocol (MCP) actually works | Edureka",
    "videoId": "0KUKaGfMW8M",
    "videoUrl": "https://www.youtube.com/watch?v=0KUKaGfMW8M",
    "thumbnailUrl": "https://i.ytimg.com/vi/0KUKaGfMW8M/hqdefault.jpg"
  },
  {
    "id": "yt-extra-javabrains",
    "name": "Java Brains",
    "handle": "@Java.Brains",
    "url": "https://www.youtube.com/@Java.Brains",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=javabrains.io&sz=128",
    "subscriberCount": "680K+",
    "level": "Intermediate",
    "description": "Java backend concepts, APIs, microservices, and software architecture fundamentals.",
    "category": "backend-engineering",
    "topPlaylists": [
      "Microservices",
      "Spring Boot"
    ],
    "tags": [
      "java",
      "backend",
      "microservices"
    ],
    "featuredVideo": "What API Protocol Design Really Means | API Architecture Full Course",
    "videoId": "PwSDaua59vg",
    "videoUrl": "https://www.youtube.com/watch?v=PwSDaua59vg",
    "thumbnailUrl": "https://i.ytimg.com/vi/PwSDaua59vg/hqdefault.jpg"
  },
  {
    "id": "yt-extra-amigoscode",
    "name": "Amigoscode",
    "handle": "@amigoscode",
    "url": "https://www.youtube.com/@amigoscode",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=amigoscode.com&sz=128",
    "subscriberCount": "620K+",
    "level": "Intermediate",
    "description": "Backend development, APIs, databases, Spring Boot, and deployment.",
    "category": "backend-engineering",
    "topPlaylists": [
      "Backend Architecture",
      "Microservices"
    ],
    "tags": [
      "backend",
      "apis",
      "databases"
    ],
    "featuredVideo": "API Mistakes You Need to STOP (Before the Rewrite)",
    "videoId": "zbOtmW4yMsQ",
    "videoUrl": "https://www.youtube.com/watch?v=zbOtmW4yMsQ",
    "thumbnailUrl": "https://i.ytimg.com/vi/zbOtmW4yMsQ/hqdefault.jpg"
  },
  {
    "id": "yt-extra-engineering-mindset",
    "name": "The Engineering Mindset",
    "handle": "@EngineeringMindset",
    "url": "https://www.youtube.com/@EngineeringMindset",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=theengineeringmindset.com&sz=128",
    "subscriberCount": "3.6M+",
    "level": "Beginner",
    "description": "Clear visual explanations of infrastructure and engineering concepts.",
    "category": "engineering-fundamentals",
    "topPlaylists": [
      "Data Centers",
      "Internet Infrastructure"
    ],
    "tags": [
      "visual-learning",
      "engineering",
      "fundamentals"
    ],
    "featuredVideo": "How a CPU Turns 1s and 0s Into Everything You See",
    "videoId": "je0BsLY5nZw",
    "videoUrl": "https://www.youtube.com/watch?v=je0BsLY5nZw",
    "thumbnailUrl": "https://i.ytimg.com/vi/je0BsLY5nZw/hqdefault.jpg"
  },
  {
    "id": "yt-extra-qcon",
    "name": "QCon",
    "handle": "@QConferences",
    "url": "https://www.youtube.com/@QConferences",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=qconferences.com&sz=128",
    "subscriberCount": "140K+",
    "level": "Advanced",
    "description": "Conference talks on software architecture, distributed systems, and engineering leadership.",
    "category": "architecture-talks",
    "topPlaylists": [
      "Software Architecture"
    ],
    "tags": [
      "architecture",
      "distributed-systems",
      "conference-talks"
    ],
    "featuredVideo": "QCon London April 7-11: A practitioner-driven conference!",
    "videoId": "UgKarm6kISY",
    "videoUrl": "https://www.youtube.com/watch?v=UgKarm6kISY",
    "thumbnailUrl": "https://i.ytimg.com/vi/UgKarm6kISY/hqdefault.jpg"
  },
  {
    "id": "yt-piyush-garg",
    "name": "Piyush Garg",
    "handle": "@piyushgarg1461",
    "url": "https://www.youtube.com/@piyushgarg1461",
    "avatarUrl": "https://unavatar.io/youtube/piyushgarg1461",
    "subscriberCount": "350K+",
    "level": "All Levels",
    "description": "In-depth system design tutorials, scalable architecture patterns, Redis caching, microservices, and practical engineering guides.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design for Beginners",
      "Backend Architecture",
      "Docker & Kubernetes"
    ],
    "tags": [
      "system-design",
      "scalability",
      "caching",
      "architecture",
      "backend"
    ],
    "featuredVideo": "System Design for Beginners",
    "videoId": "lFeYU31TnQ8",
    "videoUrl": "https://www.youtube.com/watch?v=lFeYU31TnQ8",
    "thumbnailUrl": "https://i.ytimg.com/vi/lFeYU31TnQ8/hqdefault.jpg"
  },
  {
    "id": "yt-harkirat-singh",
    "name": "Harkirat Singh",
    "handle": "@harkirat1",
    "url": "https://www.youtube.com/@harkirat1",
    "avatarUrl": "https://unavatar.io/youtube/harkirat1",
    "subscriberCount": "500K+",
    "level": "Intermediate",
    "description": "Deep-dive system architecture, high-throughput systems, real-time WebSockets, Redis pub/sub, message queues, and production clones.",
    "category": "distributed-systems",
    "topPlaylists": [
      "Super 30 System Design",
      "Complete Backend & DevOps",
      "Production Clones"
    ],
    "tags": [
      "system-design",
      "high-throughput",
      "redis",
      "websockets",
      "microservices"
    ],
    "featuredVideo": "The System Design Every Developer Should Know (Super 30 Class)",
    "videoId": "IjY34e7NfaU",
    "videoUrl": "https://www.youtube.com/watch?v=IjY34e7NfaU",
    "thumbnailUrl": "https://i.ytimg.com/vi/IjY34e7NfaU/hqdefault.jpg"
  },
  {
    "id": "yt-sudocode",
    "name": "Sudocode",
    "handle": "@sudocode_",
    "url": "https://www.youtube.com/@sudocode_",
    "avatarUrl": "https://unavatar.io/youtube/@sudocode_",
    "subscriberCount": "85K+",
    "level": "Beginner",
    "description": "Structured, beginner-friendly system design primer courses covering scalability, load balancing, and REST APIs step-by-step.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Primer Course",
      "Fundamentals"
    ],
    "tags": [
      "system-design",
      "beginner",
      "fundamentals",
      "interview-prep"
    ],
    "featuredVideo": "System Design Primer Course - Complete Roadmap",
    "videoId": "FSR1s2b-l_I",
    "videoUrl": "https://www.youtube.com/watch?v=FSR1s2b-l_I",
    "thumbnailUrl": "https://i.ytimg.com/vi/FSR1s2b-l_I/hqdefault.jpg"
  },
  {
    "id": "yt-keerti-purswani",
    "name": "Keerti Purswani",
    "handle": "@KeertiPurswani",
    "url": "https://www.youtube.com/@KeertiPurswani",
    "avatarUrl": "https://unavatar.io/youtube/@KeertiPurswani",
    "subscriberCount": "110K+",
    "level": "Intermediate",
    "description": "System design interview preparation with structured breakdowns, HLD walkthroughs, and real-world architecture discussions.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design",
      "High Level Design"
    ],
    "tags": [
      "system-design",
      "hld",
      "interview-prep",
      "architecture"
    ],
    "featuredVideo": "20 Agentic AI System Design Interview Questions & Solutions",
    "videoId": "I4sGn8Z1vpI",
    "videoUrl": "https://www.youtube.com/watch?v=I4sGn8Z1vpI",
    "thumbnailUrl": "https://i.ytimg.com/vi/I4sGn8Z1vpI/hqdefault.jpg"
  },
  {
    "id": "yt-be-a-better-dev",
    "name": "Be A Better Dev",
    "handle": "@BeABetterDev",
    "url": "https://www.youtube.com/@BeABetterDev",
    "avatarUrl": "https://unavatar.io/youtube/@BeABetterDev",
    "subscriberCount": "180K+",
    "level": "Intermediate",
    "description": "Cloud architecture, AWS services, serverless patterns, and practical system design for production environments.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "AWS Architecture",
      "System Design"
    ],
    "tags": [
      "aws",
      "cloud-architecture",
      "serverless",
      "system-design"
    ],
    "featuredVideo": "AWS SQS vs SNS vs EventBridge - When to Use What?",
    "videoId": "RoKAEzdcr7k",
    "videoUrl": "https://www.youtube.com/watch?v=RoKAEzdcr7k",
    "thumbnailUrl": "https://i.ytimg.com/vi/RoKAEzdcr7k/hqdefault.jpg"
  },
  {
    "id": "yt-tech-with-nikola",
    "name": "Tech With Nikola",
    "handle": "@TechWithNikola",
    "url": "https://www.youtube.com/@TechWithNikola",
    "avatarUrl": "https://unavatar.io/youtube/@TechWithNikola",
    "subscriberCount": "75K+",
    "level": "Intermediate",
    "description": "Backend architecture, microservices patterns, event-driven design, and practical distributed systems engineering.",
    "category": "software-architecture",
    "topPlaylists": [
      "Microservices",
      "System Design"
    ],
    "tags": [
      "microservices",
      "event-driven",
      "backend",
      "architecture"
    ],
    "featuredVideo": "Why Does TCP Handshake Need 3 Messages? (Not 2, Not 1)",
    "videoId": "vP7RcHzhPL0",
    "videoUrl": "https://www.youtube.com/watch?v=vP7RcHzhPL0",
    "thumbnailUrl": "https://i.ytimg.com/vi/vP7RcHzhPL0/hqdefault.jpg"
  },
  {
    "id": "yt-a-dev-story",
    "name": "A Dev' Story",
    "handle": "@ADevStory",
    "url": "https://www.youtube.com/@ADevStory",
    "avatarUrl": "https://unavatar.io/youtube/@ADevStory",
    "subscriberCount": "55K+",
    "level": "Beginner",
    "description": "Animated explainers on system design concepts, architecture patterns, and software engineering fundamentals.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Explained",
      "Architecture Fundamentals"
    ],
    "tags": [
      "animated",
      "system-design",
      "visual-learning",
      "fundamentals"
    ],
    "featuredVideo": "Distributed Systems Design Introduction (Concepts & Challenges)",
    "videoId": "Sa_gJwB55jY",
    "videoUrl": "https://www.youtube.com/watch?v=Sa_gJwB55jY",
    "thumbnailUrl": "https://i.ytimg.com/vi/Sa_gJwB55jY/hqdefault.jpg"
  },
  {
    "id": "yt-system-design-fight-club",
    "name": "System Design Fight Club",
    "handle": "@SDFC",
    "url": "https://www.youtube.com/@SDFC",
    "avatarUrl": "https://unavatar.io/youtube/@SDFC",
    "subscriberCount": "40K+",
    "level": "Advanced",
    "description": "Deep-dive system design discussions, architecture debates, and advanced distributed systems analysis.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Deep Dives"
    ],
    "tags": [
      "system-design",
      "advanced",
      "deep-dives",
      "architecture"
    ],
    "featuredVideo": "Absolutely Everything That I Know About Database Indexes",
    "videoId": "Qhc8gFF2qS8",
    "videoUrl": "https://www.youtube.com/watch?v=Qhc8gFF2qS8",
    "thumbnailUrl": "https://i.ytimg.com/vi/Qhc8gFF2qS8/hqdefault.jpg"
  },
  {
    "id": "yt-mark-richards",
    "name": "Mark Richards",
    "handle": "@markrichards5014",
    "url": "https://www.youtube.com/@markrichards5014",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=developertoarchitect.com&sz=128",
    "subscriberCount": "35K+",
    "level": "Advanced",
    "description": "Software architecture patterns, architectural thinking, trade-off analysis, and service granularity from the author of Fundamentals of Software Architecture.",
    "category": "software-architecture",
    "topPlaylists": [
      "Software Architecture Monday",
      "Architecture Patterns"
    ],
    "tags": [
      "software-architecture",
      "patterns",
      "trade-offs",
      "design-principles"
    ],
    "featuredVideo": "Lesson 197 - Event-Driven Architecture Topologies",
    "videoId": "LFecG2dvZjw",
    "videoUrl": "https://www.youtube.com/watch?v=LFecG2dvZjw",
    "thumbnailUrl": "https://i.ytimg.com/vi/LFecG2dvZjw/hqdefault.jpg"
  },
  {
    "id": "yt-devoxx",
    "name": "Devoxx",
    "handle": "@DevoxxForever",
    "url": "https://www.youtube.com/@DevoxxForever",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=devoxx.com&sz=128",
    "subscriberCount": "250K+",
    "level": "Advanced",
    "description": "Developer conference talks covering microservices, event-driven architecture, DDD, and production systems engineering.",
    "category": "architecture-talks",
    "topPlaylists": [
      "Architecture",
      "Microservices"
    ],
    "tags": [
      "conference-talks",
      "microservices",
      "ddd",
      "production-systems"
    ],
    "featuredVideo": "Java Next: Architecture & Runtimes | Devoxx",
    "videoId": "ufhs9THbYZI",
    "videoUrl": "https://www.youtube.com/watch?v=ufhs9THbYZI",
    "thumbnailUrl": "https://i.ytimg.com/vi/ufhs9THbYZI/hqdefault.jpg"
  },
  {
    "id": "yt-thoughtworks",
    "name": "Thoughtworks",
    "handle": "@Thoughtworks",
    "url": "https://www.youtube.com/@Thoughtworks",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=thoughtworks.com&sz=128",
    "subscriberCount": "70K+",
    "level": "Advanced",
    "description": "Technology radar, architecture practices, evolutionary architecture, and engineering culture from Thoughtworks consultants.",
    "category": "software-architecture",
    "topPlaylists": [
      "Technology Radar",
      "Software Architecture"
    ],
    "tags": [
      "technology-radar",
      "architecture",
      "engineering-culture",
      "consulting"
    ],
    "featuredVideo": "Evolutionary Architecture",
    "videoId": "f0FZgmZrcW8",
    "videoUrl": "https://www.youtube.com/watch?v=f0FZgmZrcW8",
    "thumbnailUrl": "https://i.ytimg.com/vi/f0FZgmZrcW8/hqdefault.jpg"
  },
  {
    "id": "yt-strangeloop",
    "name": "Strange Loop Conference",
    "handle": "@StrangeLoopConf",
    "url": "https://www.youtube.com/@StrangeLoopConf",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=thestrangeloop.com&sz=128",
    "subscriberCount": "65K+",
    "level": "Advanced",
    "description": "Legendary conference talks on distributed systems, databases, programming languages, and systems engineering.",
    "category": "architecture-talks",
    "topPlaylists": [
      "Strange Loop Talks",
      "Distributed Systems"
    ],
    "tags": [
      "conference-talks",
      "distributed-systems",
      "databases",
      "engineering"
    ],
    "featuredVideo": "Turning the database inside-out with Apache Samza",
    "videoId": "fU9hR3kiOK0",
    "videoUrl": "https://www.youtube.com/watch?v=fU9hR3kiOK0",
    "thumbnailUrl": "https://i.ytimg.com/vi/fU9hR3kiOK0/hqdefault.jpg"
  },
  {
    "id": "yt-cmumulticomp",
    "name": "CMU Database Group",
    "handle": "@CMUDatabaseGroup",
    "url": "https://www.youtube.com/@CMUDatabaseGroup",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=cmu.edu&sz=128",
    "subscriberCount": "40K+",
    "level": "Advanced",
    "description": "Andy Pavlo's database systems courses covering query processing, storage engines, concurrency control, and distributed databases.",
    "category": "database-engineering",
    "topPlaylists": [
      "Intro to Database Systems",
      "Advanced Database Systems"
    ],
    "tags": [
      "databases",
      "query-processing",
      "storage-engines",
      "academic"
    ],
    "featuredVideo": "CMU Intro to Database Systems - Lecture 01",
    "videoId": "uikbtpVZS2s",
    "videoUrl": "https://www.youtube.com/watch?v=uikbtpVZS2s",
    "thumbnailUrl": "https://i.ytimg.com/vi/uikbtpVZS2s/hqdefault.jpg"
  },
  {
    "id": "yt-rawkode-academy",
    "name": "Rawkode Academy",
    "handle": "@RawkodeAcademy",
    "url": "https://www.youtube.com/@RawkodeAcademy",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=rawkode.academy&sz=128",
    "subscriberCount": "45K+",
    "level": "Intermediate",
    "description": "Cloud-native engineering, Kubernetes, service mesh, platform engineering, and infrastructure-as-code.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "Cloud Native",
      "Platform Engineering"
    ],
    "tags": [
      "cloud-native",
      "kubernetes",
      "platform-engineering",
      "infrastructure"
    ],
    "featuredVideo": "Teleport for Kubernetes: Secure Cluster Access & Platform Architecture",
    "videoId": "sfv21FY8CCs",
    "videoUrl": "https://www.youtube.com/watch?v=sfv21FY8CCs",
    "thumbnailUrl": "https://i.ytimg.com/vi/sfv21FY8CCs/hqdefault.jpg"
  },
  {
    "id": "yt-systems-expert",
    "name": "AlgoExpert (SystemsExpert)",
    "handle": "@AlgoExpert",
    "url": "https://www.youtube.com/@AlgoExpert",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=algoexpert.io&sz=128",
    "subscriberCount": "200K+",
    "level": "Intermediate",
    "description": "Polished system design curriculum videos, mock interviews, and structured paths for tackling distributed systems.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "SystemsExpert",
      "System Design Fundamentals"
    ],
    "tags": [
      "system-design",
      "interview-prep",
      "curriculum",
      "structured-learning"
    ],
    "featuredVideo": "SystemsExpert - System Design Fundamentals",
    "videoId": "0ucPspLHl1A",
    "videoUrl": "https://www.youtube.com/watch?v=0ucPspLHl1A",
    "thumbnailUrl": "https://i.ytimg.com/vi/0ucPspLHl1A/hqdefault.jpg"
  },
  {
    "id": "yt-the-geek-narrator",
    "name": "The Geek Narrator",
    "handle": "@TheGeekNarrator",
    "url": "https://www.youtube.com/@TheGeekNarrator",
    "avatarUrl": "https://unavatar.io/youtube/@TheGeekNarrator",
    "subscriberCount": "55K+",
    "level": "Advanced",
    "description": "System design deep dives with ex-FAANG engineers, covering large-scale distributed systems, databases, and production challenges.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design",
      "Engineering Deep Dives"
    ],
    "tags": [
      "system-design",
      "deep-dives",
      "distributed-systems",
      "production"
    ],
    "featuredVideo": "Skip Lists Explained: How Coin Flips Make Search Fast",
    "videoId": "2JJIqJ31oSo",
    "videoUrl": "https://www.youtube.com/watch?v=2JJIqJ31oSo",
    "thumbnailUrl": "https://i.ytimg.com/vi/2JJIqJ31oSo/hqdefault.jpg"
  },
  {
    "id": "yt-soumyajit-bhattacharyya",
    "name": "Soumyajit Bhattacharyya",
    "handle": "@SoumyajitBhattacharyya",
    "url": "https://www.youtube.com/@SoumyajitBhattacharyya",
    "avatarUrl": "https://unavatar.io/youtube/@SoumyajitBhattacharyya",
    "subscriberCount": "60K+",
    "level": "Advanced",
    "description": "Senior Principal Architect breaking down low-level and high-level designs, distributed transactions, and microservices patterns.",
    "category": "distributed-systems",
    "topPlaylists": [
      "System Design Masterclass",
      "Microservices & Event-Driven Systems"
    ],
    "tags": [
      "distributed-systems",
      "microservices",
      "enterprise-architecture",
      "hld"
    ],
    "featuredVideo": "Software Architecture, SDE vs Engineering Manager Roles & Scaling Systems",
    "videoId": "SzzckkROc38",
    "videoUrl": "https://www.youtube.com/watch?v=SzzckkROc38",
    "thumbnailUrl": "https://i.ytimg.com/vi/SzzckkROc38/hqdefault.jpg"
  },
  {
    "id": "yt-engineering-with-utsav",
    "name": "Engineering with Utsav",
    "handle": "@EngineeringWithUtsav",
    "url": "https://www.youtube.com/@EngineeringWithUtsav",
    "avatarUrl": "https://unavatar.io/youtube/@EngineeringWithUtsav",
    "subscriberCount": "120K+",
    "level": "Intermediate",
    "description": "Ex-Amazon Staff Engineer sharing practical software engineering wisdom, system design mock interviews, and career architecture.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "System Design Mock Interviews",
      "Software Engineering Best Practices"
    ],
    "tags": [
      "interviews",
      "mock-interview",
      "amazon",
      "best-practices"
    ],
    "featuredVideo": "The Problem With Running Coding Agents Locally | Software Architecture",
    "videoId": "JqLiAiD9F8s",
    "videoUrl": "https://www.youtube.com/watch?v=JqLiAiD9F8s",
    "thumbnailUrl": "https://i.ytimg.com/vi/JqLiAiD9F8s/hqdefault.jpg"
  },
  {
    "id": "yt-takeuforward-sd",
    "name": "take U forward (Striver)",
    "handle": "@takeUforward",
    "url": "https://www.youtube.com/@takeUforward",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=takeuforward.org&sz=128",
    "subscriberCount": "700K+",
    "level": "All Levels",
    "description": "Comprehensive engineering roadmap, low-level design patterns (LLD), object-oriented design, and high-level distributed systems.",
    "category": "system-design-interviews",
    "topPlaylists": [
      "Complete Low Level Design (LLD)",
      "High Level Design (HLD) Series"
    ],
    "tags": [
      "lld",
      "hld",
      "design-patterns",
      "interview-prep"
    ],
    "featuredVideo": "[Complete] System Design Roadmap for Everyone — SDE Interviews & Architecture",
    "videoId": "3baWzvEDfgU",
    "videoUrl": "https://www.youtube.com/watch?v=3baWzvEDfgU",
    "thumbnailUrl": "https://i.ytimg.com/vi/3baWzvEDfgU/hqdefault.jpg"
  }
],
  githubRepos: [
  {
    "id": "gh-system-design-primer",
    "title": "System Design Primer",
    "repo": "donnemartin/system-design-primer",
    "url": "https://github.com/donnemartin/system-design-primer",
    "stars": "260k+",
    "description": "Comprehensive open-source guide to scalable system design, with examples and interview questions.",
    "topics": [
      "system-design",
      "scalability",
      "interview-prep"
    ],
    "highlight": "Best broad starting point; includes common problems and Anki flashcards."
  },
  {
    "id": "gh-system-design-101",
    "title": "System Design 101",
    "repo": "ByteByteGoHq/system-design-101",
    "url": "https://github.com/ByteByteGoHq/system-design-101",
    "stars": "50k+",
    "description": "Visual, approachable explanations of complex systems and architecture concepts.",
    "topics": [
      "system-design",
      "architecture",
      "visual-learning"
    ],
    "highlight": "Good companion to visual learning and quick concept review."
  },
  {
    "id": "gh-awesome-system-design-resources",
    "title": "Awesome System Design Resources",
    "repo": "ashishps1/awesome-system-design-resources",
    "url": "https://github.com/ashishps1/awesome-system-design-resources",
    "stars": "12k+",
    "description": "Curated list of system design articles, videos, and interview resources.",
    "topics": [
      "awesome-list",
      "system-design",
      "learning"
    ],
    "highlight": "Useful discovery index for expanding the platform's resource catalog."
  },
  {
    "id": "gh-karan-system-design",
    "title": "System Design Course",
    "repo": "karanpratapsingh/system-design",
    "url": "https://github.com/karanpratapsingh/system-design",
    "stars": "25k+",
    "description": "Structured written guide to core system design topics and common architectures.",
    "topics": [
      "system-design",
      "distributed-systems",
      "course"
    ],
    "highlight": "Course-like progression from fundamentals to applied topics."
  },
  {
    "id": "gh-awesome-scalability",
    "title": "Awesome Scalability",
    "repo": "binhnguyennus/awesome-scalability",
    "url": "https://github.com/binhnguyennus/awesome-scalability",
    "stars": "50k+",
    "description": "Collection of articles and resources about building scalable and reliable systems.",
    "topics": [
      "scalability",
      "reliability",
      "architecture"
    ],
    "highlight": "Excellent for production architecture and scalability reading."
  },
  {
    "id": "gh-engineering-blogs",
    "title": "Engineering Blogs",
    "repo": "kilimchoi/engineering-blogs",
    "url": "https://github.com/kilimchoi/engineering-blogs",
    "stars": "28k+",
    "description": "Index of engineering blogs from technology companies.",
    "topics": [
      "engineering-blogs",
      "architecture",
      "case-studies"
    ],
    "highlight": "A discovery map to primary-source company engineering articles."
  },
  {
    "id": "gh-checkcheckzz-system-design",
    "title": "System Design Interview",
    "repo": "checkcheckzz/system-design-interview",
    "url": "https://github.com/checkcheckzz/system-design-interview",
    "stars": "14k+",
    "description": "Interview-oriented system design questions and learning references.",
    "topics": [
      "system-design",
      "interview-prep",
      "questions"
    ],
    "highlight": "Helpful for building practice-question collections."
  },
  {
    "id": "gh-machine-learning-systems",
    "title": "Machine Learning Systems Design",
    "repo": "chiphuyen/machine-learning-systems-design",
    "url": "https://github.com/chiphuyen/machine-learning-systems-design",
    "stars": "11k+",
    "description": "Resources and references for designing production machine learning systems.",
    "topics": [
      "ml-systems",
      "machine-learning",
      "architecture"
    ],
    "highlight": "Extends system design into ML infrastructure and serving."
  },
  {
    "id": "gh-realworld-system-design",
    "title": "Real World System Design",
    "repo": "realworldsystems/realworld-system-design",
    "url": "https://github.com/realworldsystems/realworld-system-design",
    "stars": "8k+",
    "description": "Repository link is a discovery candidate; verify repository availability and ownership before use.",
    "topics": [
      "system-design",
      "case-studies",
      "verify-link"
    ],
    "highlight": "Keep only after checking current availability and maintenance."
  },
  {
    "id": "gh-distributed-systems-reading",
    "title": "Distributed Systems Reading List",
    "repo": "mehdihadeli/awesome-software-architecture",
    "url": "https://github.com/mehdihadeli/awesome-software-architecture",
    "stars": "15k+",
    "description": "Curated software architecture and distributed-systems learning material.",
    "topics": [
      "software-architecture",
      "distributed-systems",
      "reading-list"
    ],
    "highlight": "Broader architecture reference beyond interview-specific content."
  },
  {
    "id": "gh-system-design-fight-club",
    "title": "System Design Fight Club",
    "repo": "systemdesign42/system-design",
    "url": "https://github.com/systemdesign42/system-design",
    "stars": "7k+",
    "description": "System design interview practice material and discussion prompts.",
    "topics": [
      "system-design",
      "practice",
      "interview-prep"
    ],
    "highlight": "Potential practice resource; review repository contents before featuring."
  },
  {
    "id": "gh-microservices-patterns",
    "title": "Microservices Patterns",
    "repo": "microservices-patterns",
    "url": "https://microservices.io/patterns/index.html",
    "stars": "Official",
    "description": "Pattern catalog for microservice architecture, data management, and communication.",
    "topics": [
      "microservices",
      "patterns",
      "architecture"
    ],
    "highlight": "Primary website with patterns such as saga, CQRS, and transactional outbox."
  },
  {
    "id": "gh-design-patterns",
    "title": "Refactoring.Guru Design Patterns",
    "repo": "refactoringguru/design-patterns",
    "url": "https://github.com/refactoringguru/design-patterns",
    "stars": "10k+",
    "description": "Examples and explanations of classic object-oriented design patterns.",
    "topics": [
      "design-patterns",
      "oop",
      "lld"
    ],
    "highlight": "Useful for low-level design interviews and code-level architecture."
  },
  {
    "id": "gh-system-design-2026",
    "title": "System Design Roadmap 2026",
    "repo": "ShreyJoshi74/SystemDesign",
    "url": "https://github.com/ShreyJoshi74/SystemDesign",
    "stars": "4k+",
    "description": "A recent community roadmap covering system design topics and learning resources.",
    "topics": [
      "roadmap",
      "system-design",
      "interview-prep"
    ],
    "highlight": "Treat as a community roadmap, not an authoritative standard."
  },
  {
    "id": "gh-system-design-kit",
    "title": "System Design KIT",
    "repo": "pavanjoshi914/System-Design-KIT",
    "url": "https://github.com/pavanjoshi914/System-Design-KIT",
    "stars": "6k+",
    "description": "Collection of system design concepts, estimation references, and common problems.",
    "topics": [
      "system-design",
      "cheatsheets",
      "interview-prep"
    ],
    "highlight": "Useful as a checklist-style companion; verify each linked source."
  },
  {
    "id": "gh-awesome-low-level-design",
    "title": "Awesome Low Level Design",
    "repo": "ashishps1/awesome-low-level-design",
    "url": "https://github.com/ashishps1/awesome-low-level-design",
    "stars": "8k+",
    "description": "Curated low-level design, OOP, and machine-coding interview resources.",
    "topics": [
      "low-level-design",
      "oop",
      "machine-coding"
    ],
    "highlight": "Adds LLD coverage alongside high-level architecture."
  },
  {
    "id": "gh-aws-samples",
    "title": "AWS Samples",
    "repo": "aws-samples",
    "url": "https://github.com/aws-samples",
    "stars": "Official",
    "description": "Official AWS sample applications and architecture implementations.",
    "topics": [
      "aws",
      "cloud",
      "reference-architecture"
    ],
    "highlight": "Use for practical cloud implementation examples, not interview answers alone."
  },
  {
    "id": "gh-googlecloudplatform",
    "title": "Google Cloud Platform Samples",
    "repo": "GoogleCloudPlatform",
    "url": "https://github.com/GoogleCloudPlatform",
    "stars": "Official",
    "description": "Official Google Cloud sample repositories and deployment examples.",
    "topics": [
      "gcp",
      "cloud",
      "reference-architecture"
    ],
    "highlight": "Useful implementation references for cloud-native system design."
  },
  {
    "id": "gh-java-design-patterns",
    "title": "Design Patterns in Java",
    "repo": "iluwatar/java-design-patterns",
    "url": "https://github.com/iluwatar/java-design-patterns",
    "stars": "90k+",
    "description": "Comprehensive implementation of classic Gang of Four and enterprise distributed architectural patterns in Java.",
    "topics": [
      "design-patterns",
      "enterprise-architecture",
      "java",
      "lld"
    ],
    "highlight": "Over 100 design patterns with runnable code, UML class diagrams, and trade-off commentary."
  },
  {
    "id": "gh-devops-exercises",
    "title": "DevOps & Systems Architecture Exercises",
    "repo": "bregman-arie/devops-exercises",
    "url": "https://github.com/bregman-arie/devops-exercises",
    "stars": "68k+",
    "description": "Deep technical interview questions and answers covering Linux internals, networking, DNS, load balancers, and distributed systems.",
    "topics": [
      "devops",
      "linux-internals",
      "networking",
      "distributed-systems"
    ],
    "highlight": "Invaluable for infrastructure-level questions, packet flow analysis, and systems reliability."
  },
  {
    "id": "gh-software-architect-roadmap",
    "title": "Software Architect Roadmap",
    "repo": "kamranahmedse/developer-roadmap",
    "url": "https://github.com/kamranahmedse/developer-roadmap",
    "stars": "310k+",
    "description": "Step-by-step visual roadmaps and paths for becoming a Software Architect, Backend Lead, and DevOps Engineer.",
    "topics": [
      "roadmap",
      "architecture",
      "career",
      "system-design"
    ],
    "highlight": "The global standard visual roadmap for engineering career progression and systems mastery."
  },
  {
    "id": "gh-etcd",
    "title": "etcd Distributed Key-Value Store",
    "repo": "etcd-io/etcd",
    "url": "https://github.com/etcd-io/etcd",
    "stars": "48k+",
    "description": "Distributed, reliable key-value store for the most critical data of a distributed system, powering Kubernetes.",
    "topics": [
      "consensus",
      "raft",
      "distributed-systems",
      "kubernetes"
    ],
    "highlight": "Production implementation of the Raft consensus algorithm with multi-version concurrency control (MVCC)."
  },
  {
    "id": "gh-apache-kafka",
    "title": "Apache Kafka Event Streaming",
    "repo": "apache/kafka",
    "url": "https://github.com/apache/kafka",
    "stars": "29k+",
    "description": "Open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines.",
    "topics": [
      "streaming",
      "distributed-log",
      "event-driven",
      "messaging"
    ],
    "highlight": "Examine real production code for KRaft consensus, partitioned logs, and zero-copy network sockets."
  },
  {
    "id": "gh-hashicorp-raft",
    "title": "HashiCorp Raft Consensus",
    "repo": "hashicorp/raft",
    "url": "https://github.com/hashicorp/raft",
    "stars": "8k+",
    "description": "Production-grade Go implementation of the Raft consensus protocol, powering HashiCorp Consul and Nomad.",
    "topics": [
      "raft",
      "consensus",
      "golang",
      "distributed-systems"
    ],
    "highlight": "Extremely clean, readable codebase to study state machines, log replication, and leader elections."
  },
  {
    "id": "gh-netflix-eureka",
    "title": "Netflix Eureka Service Discovery",
    "repo": "Netflix/eureka",
    "url": "https://github.com/Netflix/eureka",
    "stars": "12k+",
    "description": "AWS Service registry for resilient mid-tier load balancing and failover in microservice ecosystems.",
    "topics": [
      "service-discovery",
      "microservices",
      "resilience",
      "netflix"
    ],
    "highlight": "Pioneered client-side caching, peer-to-peer registry replication, and self-preservation modes."
  },
  {
    "id": "gh-interviewready-resources",
    "title": "InterviewReady System Design Index",
    "repo": "InterviewReady/system-design-resources",
    "url": "https://github.com/InterviewReady/system-design-resources",
    "stars": "5k+",
    "description": "Curated collection of distributed systems design case studies, architecture patterns, and latency checklists.",
    "topics": [
      "interview-prep",
      "system-design",
      "case-studies",
      "gaurav-sen"
    ],
    "highlight": "Accompanies Gaurav Sen's architectural lectures with estimation templates and diagrams."
  },
  {
    "id": "gh-alexpetenchea-system-design",
    "title": "System Design Interview Solutions",
    "repo": "alexpetenchea/system-design",
    "url": "https://github.com/alexpetenchea/system-design",
    "stars": "7k+",
    "description": "End-to-end written designs for popular interview systems: Uber, Instagram, TinyURL, Web Crawler, and Twitter.",
    "topics": [
      "system-design",
      "interview-prep",
      "estimations",
      "diagrams"
    ],
    "highlight": "Detailed capacity estimations, high-level and deep-dive architecture diagrams with database schemas."
  },
  {
    "id": "gh-ray-project",
    "title": "Ray Distributed AI & Compute",
    "repo": "ray-project/ray",
    "url": "https://github.com/ray-project/ray",
    "stars": "36k+",
    "description": "Unified framework for scaling AI and Python applications from a single machine to a large cluster.",
    "topics": [
      "distributed-computing",
      "ai-infrastructure",
      "actor-model",
      "python"
    ],
    "highlight": "State-of-the-art distributed memory store (Plasma) and distributed actor scheduler for AI workloads."
  }
],
  engineeringBlogs: [
  {
    "id": "blog-netflix",
    "company": "Netflix",
    "url": "https://netflixtechblog.com/",
    "logoDomain": "netflix.com",
    "description": "Engineering stories on streaming, reliability, data platforms, and large-scale infrastructure.",
    "mustReadArticle": {
      "title": "Netflix TechBlog: scaling and reliability case studies",
      "topic": "Streaming architecture, resilience, and platform engineering"
    },
    "tags": [
      "streaming",
      "reliability",
      "microservices"
    ]
  },
  {
    "id": "blog-uber",
    "company": "Uber Engineering",
    "url": "https://www.uber.com/blog/engineering/",
    "logoDomain": "uber.com",
    "description": "Production engineering across marketplace, storage, observability, and infrastructure.",
    "mustReadArticle": {
      "title": "Uber Engineering: engineering architecture articles",
      "topic": "Large-scale services, data infrastructure, and reliability"
    },
    "tags": [
      "marketplace",
      "data-infrastructure",
      "reliability"
    ]
  },
  {
    "id": "blog-meta",
    "company": "Meta Engineering",
    "url": "https://engineering.fb.com/",
    "logoDomain": "meta.com",
    "description": "Architecture and infrastructure posts from Meta's engineering teams.",
    "mustReadArticle": {
      "title": "Meta Engineering: infrastructure and systems articles",
      "topic": "Caching, storage, messaging, and large-scale infrastructure"
    },
    "tags": [
      "infrastructure",
      "storage",
      "messaging"
    ]
  },
  {
    "id": "blog-discord",
    "company": "Discord",
    "url": "https://discord.com/blog",
    "logoDomain": "discord.com",
    "description": "Detailed posts about scaling real-time messaging, databases, and backend services.",
    "mustReadArticle": {
      "title": "How Discord stores billions of messages",
      "topic": "Database scaling and data model evolution"
    },
    "tags": [
      "real-time",
      "databases",
      "messaging"
    ]
  },
  {
    "id": "blog-cloudflare",
    "company": "Cloudflare",
    "url": "https://blog.cloudflare.com/",
    "logoDomain": "cloudflare.com",
    "description": "Networking, edge infrastructure, security, DNS, and performance engineering.",
    "mustReadArticle": {
      "title": "Cloudflare Blog: architecture and network engineering",
      "topic": "Edge networks, caching, DNS, and security"
    },
    "tags": [
      "networking",
      "edge",
      "security"
    ]
  },
  {
    "id": "blog-aws-builders-library",
    "company": "Amazon Builders' Library",
    "url": "https://aws.amazon.com/builders-library/",
    "logoDomain": "amazon.com",
    "description": "Primary-source operational guidance on distributed systems and production engineering.",
    "mustReadArticle": {
      "title": "Timeouts, retries, and backoff with jitter",
      "topic": "Resilient client behavior and retry control"
    },
    "tags": [
      "distributed-systems",
      "reliability",
      "operations"
    ]
  },
  {
    "id": "blog-aws-architecture",
    "company": "AWS Architecture Blog",
    "url": "https://aws.amazon.com/blogs/architecture/",
    "logoDomain": "amazon.com",
    "description": "Reference architectures, design patterns, and cloud system trade-offs.",
    "mustReadArticle": {
      "title": "AWS Architecture Blog: Well-Architected patterns",
      "topic": "Availability, security, cost, and operational excellence"
    },
    "tags": [
      "cloud",
      "architecture",
      "reliability"
    ]
  },
  {
    "id": "blog-google-cloud",
    "company": "Google Cloud Blog",
    "url": "https://cloud.google.com/blog/products",
    "logoDomain": "cloud.google.com",
    "description": "Cloud architecture, data, AI infrastructure, and operational case studies.",
    "mustReadArticle": {
      "title": "Google Cloud architecture and infrastructure articles",
      "topic": "Cloud-native design and platform trade-offs"
    },
    "tags": [
      "cloud",
      "data",
      "infrastructure"
    ]
  },
  {
    "id": "blog-google-research",
    "company": "Google Research",
    "url": "https://research.google/blog/",
    "logoDomain": "google.com",
    "description": "Research-driven posts on systems, data processing, ML, and infrastructure.",
    "mustReadArticle": {
      "title": "Google Research: systems and data processing posts",
      "topic": "Distributed computation and systems research"
    },
    "tags": [
      "research",
      "distributed-computing",
      "ml-infrastructure"
    ]
  },
  {
    "id": "blog-microsoft-devblogs",
    "company": "Microsoft DevBlogs",
    "url": "https://devblogs.microsoft.com/",
    "logoDomain": "microsoft.com",
    "description": "Engineering posts covering cloud platforms, databases, developer tools, and reliability.",
    "mustReadArticle": {
      "title": "Microsoft engineering posts on cloud architecture",
      "topic": "Distributed services and cloud platform design"
    },
    "tags": [
      "cloud",
      "platform",
      "databases"
    ]
  },
  {
    "id": "blog-linkedin",
    "company": "LinkedIn Engineering",
    "url": "https://engineering.linkedin.com/blog",
    "logoDomain": "linkedin.com",
    "description": "Engineering case studies on data infrastructure, Kafka, search, and feed systems.",
    "mustReadArticle": {
      "title": "LinkedIn Engineering: Kafka and data infrastructure articles",
      "topic": "Event streaming and large-scale data pipelines"
    },
    "tags": [
      "kafka",
      "data-infrastructure",
      "search"
    ]
  },
  {
    "id": "blog-airbnb",
    "company": "Airbnb Engineering",
    "url": "https://airbnb.tech/",
    "logoDomain": "airbnb.com",
    "description": "Engineering articles about search, experimentation, data platforms, and service architecture.",
    "mustReadArticle": {
      "title": "Airbnb Tech: architecture and data platform articles",
      "topic": "Search, experimentation, and data systems"
    },
    "tags": [
      "search",
      "data-platform",
      "experimentation"
    ]
  },
  {
    "id": "blog-shopify",
    "company": "Shopify Engineering",
    "url": "https://shopify.engineering/",
    "logoDomain": "shopify.com",
    "description": "Commerce-scale engineering, databases, Ruby systems, and platform reliability.",
    "mustReadArticle": {
      "title": "Shopify Engineering: scaling commerce systems",
      "topic": "Traffic spikes, data consistency, and platform design"
    },
    "tags": [
      "ecommerce",
      "databases",
      "scaling"
    ]
  },
  {
    "id": "blog-spotify",
    "company": "Spotify Engineering",
    "url": "https://engineering.atspotify.com/",
    "logoDomain": "spotify.com",
    "description": "Backend, data, experimentation, and developer platform engineering.",
    "mustReadArticle": {
      "title": "Spotify Engineering: backend and platform case studies",
      "topic": "Service architecture and data pipelines"
    },
    "tags": [
      "backend",
      "data",
      "platform"
    ]
  },
  {
    "id": "blog-dropbox",
    "company": "Dropbox Tech",
    "url": "https://dropbox.tech/",
    "logoDomain": "dropbox.com",
    "description": "Storage, synchronization, infrastructure, and performance engineering.",
    "mustReadArticle": {
      "title": "Dropbox Tech: storage and synchronization articles",
      "topic": "File storage, sync protocols, and infrastructure"
    },
    "tags": [
      "storage",
      "sync",
      "distributed-systems"
    ]
  },
  {
    "id": "blog-pinterest",
    "company": "Pinterest Engineering",
    "url": "https://medium.com/pinterest-engineering",
    "logoDomain": "pinterest.com",
    "description": "Search, recommendation, storage, and large-scale data engineering.",
    "mustReadArticle": {
      "title": "Pinterest Engineering: search and data infrastructure posts",
      "topic": "High-scale indexing and recommendation systems"
    },
    "tags": [
      "search",
      "recommendation",
      "data"
    ]
  },
  {
    "id": "blog-doordash",
    "company": "DoorDash Engineering",
    "url": "https://careersatdoordash.com/blog/engineering/",
    "logoDomain": "doordash.com",
    "description": "Marketplace, logistics, dispatch, and platform engineering case studies.",
    "mustReadArticle": {
      "title": "DoorDash Engineering: dispatch and marketplace systems",
      "topic": "Real-time logistics and distributed workflows"
    },
    "tags": [
      "marketplace",
      "dispatch",
      "real-time"
    ]
  },
  {
    "id": "blog-etsy",
    "company": "Etsy Engineering",
    "url": "https://www.etsy.com/codeascraft",
    "logoDomain": "etsy.com",
    "description": "Practical engineering posts on experimentation, reliability, and data systems.",
    "mustReadArticle": {
      "title": "Code as Craft: production engineering posts",
      "topic": "Observability, delivery, and data-driven engineering"
    },
    "tags": [
      "observability",
      "data",
      "reliability"
    ]
  },
  {
    "id": "blog-cloudflare-learning",
    "company": "Cloudflare Learning Center",
    "url": "https://www.cloudflare.com/learning/",
    "logoDomain": "cloudflare.com",
    "description": "Accessible technical explanations of DNS, CDN, TLS, caching, and networking.",
    "mustReadArticle": {
      "title": "What is a CDN?",
      "topic": "Content delivery networks and edge caching"
    },
    "tags": [
      "networking",
      "cdn",
      "fundamentals"
    ]
  },
  {
    "id": "blog-martin-fowler",
    "company": "Martin Fowler",
    "url": "https://martinfowler.com/",
    "logoDomain": "martinfowler.com",
    "description": "Software architecture, refactoring, microservices, and design principles.",
    "mustReadArticle": {
      "title": "Microservices",
      "topic": "Service boundaries and distributed architecture trade-offs"
    },
    "tags": [
      "architecture",
      "microservices",
      "design"
    ]
  },
  {
    "id": "blog-high-scalability",
    "company": "High Scalability",
    "url": "http://highscalability.com/",
    "logoDomain": "highscalability.com",
    "description": "Architecture case studies and write-ups about high-traffic systems.",
    "mustReadArticle": {
      "title": "High Scalability architecture case studies",
      "topic": "Patterns used in large production systems"
    },
    "tags": [
      "case-studies",
      "scalability",
      "architecture"
    ]
  },
  {
    "id": "blog-infoq",
    "company": "InfoQ Architecture",
    "url": "https://www.infoq.com/architecture-design/",
    "logoDomain": "infoq.com",
    "description": "Software architecture articles, talks, and industry experience reports.",
    "mustReadArticle": {
      "title": "Architecture and Design articles",
      "topic": "Modern architecture approaches and trade-offs"
    },
    "tags": [
      "architecture",
      "engineering",
      "industry"
    ]
  },
  {
    "id": "blog-confluent",
    "company": "Confluent Blog",
    "url": "https://www.confluent.io/blog/",
    "logoDomain": "confluent.io",
    "description": "Event streaming, Kafka, stream processing, and data-in-motion architecture.",
    "mustReadArticle": {
      "title": "Kafka and event streaming architecture articles",
      "topic": "Event-driven systems and stream processing"
    },
    "tags": [
      "kafka",
      "event-driven",
      "streaming"
    ]
  },
  {
    "id": "blog-redis",
    "company": "Redis Blog",
    "url": "https://redis.io/blog/",
    "logoDomain": "redis.io",
    "description": "Caching, data structures, performance, and real-time application patterns.",
    "mustReadArticle": {
      "title": "Redis caching and data structure guides",
      "topic": "Cache design and in-memory data patterns"
    },
    "tags": [
      "redis",
      "caching",
      "performance"
    ]
  },
  {
    "id": "blog-cockroach",
    "company": "Cockroach Labs",
    "url": "https://www.cockroachlabs.com/blog/",
    "logoDomain": "cockroachlabs.com",
    "description": "Distributed SQL, replication, transactions, and database consistency.",
    "mustReadArticle": {
      "title": "Distributed SQL and transaction design articles",
      "topic": "Replication, consistency, and geo-distributed databases"
    },
    "tags": [
      "databases",
      "consistency",
      "transactions"
    ]
  },
  {
    "id": "blog-stripe",
    "company": "Stripe Engineering",
    "url": "https://stripe.com/blog/engineering",
    "logoDomain": "stripe.com",
    "description": "Mission-critical financial infrastructure, zero-downtime ledger consistency, API idempotency, and distributed systems reliability.",
    "mustReadArticle": {
      "title": "Designing robust and predictable APIs with idempotency keys",
      "topic": "API idempotency, distributed transactions, and rate limiting"
    },
    "tags": [
      "fintech",
      "idempotency",
      "api-design",
      "reliability"
    ]
  },
  {
    "id": "blog-slack",
    "company": "Slack Engineering",
    "url": "https://slack.engineering/",
    "logoDomain": "slack.com",
    "description": "Real-time communication architecture, web sockets at massive scale, edge caching, and MySQL sharding migrations.",
    "mustReadArticle": {
      "title": "Flannel: An Application-Level Edge Cache to Improve Performance",
      "topic": "Edge caching, pub-sub architectures, and connection management"
    },
    "tags": [
      "real-time",
      "edge-caching",
      "websockets",
      "messaging"
    ]
  },
  {
    "id": "blog-github",
    "company": "GitHub Engineering",
    "url": "https://github.blog/category/engineering/",
    "logoDomain": "github.com",
    "description": "High-scale Git hosting, MySQL partitioning with Vitess, zero-downtime database failovers, and Kubernetes migrations.",
    "mustReadArticle": {
      "title": "How GitHub scales MySQL with Vitess and Orchestrator",
      "topic": "Database partitioning, failover automation, and high availability"
    },
    "tags": [
      "infrastructure",
      "databases",
      "vitess",
      "git"
    ]
  },
  {
    "id": "blog-bytebytego-newsletter",
    "company": "ByteByteGo Newsletter",
    "url": "https://blog.bytebytego.com/",
    "logoDomain": "bytebytego.com",
    "description": "Clear visual breakdowns of production architectures, distributed systems concepts, and real-world trade-off case studies.",
    "mustReadArticle": {
      "title": "How Companies Scale from 1 to 10 Million Users",
      "topic": "Evolutionary system design, caching layers, and database sharding"
    },
    "tags": [
      "visual-architecture",
      "case-studies",
      "distributed-systems"
    ]
  },
  {
    "id": "blog-canva",
    "company": "Canva Engineering",
    "url": "https://www.canva.dev/blog/engineering/",
    "logoDomain": "canva.com",
    "description": "Real-time collaborative graphics engine, distributed rendering pipelines, and handling millions of concurrent edits.",
    "mustReadArticle": {
      "title": "Engineering Real-Time Collaboration in Canva",
      "topic": "Operational Transformation, CRDTs, and client-server synchronization"
    },
    "tags": [
      "collaboration",
      "rendering",
      "graphics",
      "distributed-systems"
    ]
  },
  {
    "id": "blog-datadog",
    "company": "Datadog Engineering",
    "url": "https://www.datadoghq.com/blog/engineering/",
    "logoDomain": "datadoghq.com",
    "description": "Telemetry ingestion pipelines, time-series storage at petabyte scale, distributed tracing, and high-throughput stream processing.",
    "mustReadArticle": {
      "title": "Handling Trillions of Metric Data Points Daily",
      "topic": "Time-series databases, stream aggregation, and Kafka pipelining"
    },
    "tags": [
      "observability",
      "time-series",
      "metrics",
      "kafka"
    ]
  },
  {
    "id": "blog-figma",
    "company": "Figma Engineering",
    "url": "https://www.figma.com/blog/engineering/",
    "logoDomain": "figma.com",
    "description": "Deep technical articles on multiplayer synchronization, WebAssembly rendering, multiplayer document servers, and indexing.",
    "mustReadArticle": {
      "title": "How Figma’s Multiplayer Technology Works",
      "topic": "Client-server state synchronization, conflict resolution, and CRDTs"
    },
    "tags": [
      "multiplayer",
      "crdt",
      "webassembly",
      "state-sync"
    ]
  },
  {
    "id": "blog-notion",
    "company": "Notion Engineering",
    "url": "https://www.notion.so/blog/topic/tech",
    "logoDomain": "notion.so",
    "description": "Postgres horizontal sharding, block-based tree structures, real-time sync engines, and cache invalidation strategies.",
    "mustReadArticle": {
      "title": "How Notion Partitioned Its Postgres Database Across Shards",
      "topic": "Relational sharding, zero-downtime data migration, and routing proxies"
    },
    "tags": [
      "postgres",
      "sharding",
      "data-modeling",
      "scaling"
    ]
  },
  {
    "id": "blog-instacart",
    "company": "Instacart Tech",
    "url": "https://tech.instacart.com/",
    "logoDomain": "instacart.com",
    "description": "Real-time grocery logistics, fulfillment optimization, dynamic delivery route planning, and machine learning at scale.",
    "mustReadArticle": {
      "title": "Space, Time and Groceries: Real-time Dispatch and Delivery Routing",
      "topic": "Combinatorial optimization, spatial indexing, and distributed routing"
    },
    "tags": [
      "logistics",
      "routing",
      "spatial-indexing",
      "fulfillment"
    ]
  },
  {
    "id": "blog-lyft",
    "company": "Lyft Engineering",
    "url": "https://eng.lyft.com/",
    "logoDomain": "lyft.com",
    "description": "Birthplace of Envoy Proxy, microservice networking, service mesh observability, and dynamic ride-dispatch matching.",
    "mustReadArticle": {
      "title": "Envoy: The Service Proxy for Cloud-Native Applications",
      "topic": "Service mesh, dynamic routing, circuit breaking, and observability"
    },
    "tags": [
      "service-mesh",
      "envoy",
      "networking",
      "dispatch"
    ]
  },
  {
    "id": "blog-twitter",
    "company": "X / Twitter Engineering",
    "url": "https://blog.x.com/engineering",
    "logoDomain": "x.com",
    "description": "Pioneering Fanout-on-Write vs Fanout-on-Read, distributed in-memory caching (Twemcache), and massive-scale graph databases.",
    "mustReadArticle": {
      "title": "The Architecture of Twitter's Real-Time Tweet Fanout Pipeline",
      "topic": "Fanout patterns, write amplification, and timeline generation"
    },
    "tags": [
      "fanout",
      "caching",
      "timeline",
      "social-graph"
    ]
  },
  {
    "id": "blog-grab",
    "company": "Grab Tech",
    "url": "https://engineering.grab.com/",
    "logoDomain": "grab.com",
    "description": "Southeast Asia's superapp architecture: geo-distributed transactions, driver allocation, mapping, and food delivery systems.",
    "mustReadArticle": {
      "title": "Zero-Downtime Distributed Transaction Processing in GrabPay",
      "topic": "Distributed locking, saga orchestrators, and geo-replication"
    },
    "tags": [
      "superapp",
      "geo-distributed",
      "transactions",
      "logistics"
    ]
  },
  {
    "id": "blog-paypal",
    "company": "PayPal Tech",
    "url": "https://medium.com/paypal-tech",
    "logoDomain": "paypal.com",
    "description": "Ultra-low-latency real-time fraud scoring, asynchronous messaging at planetary scale, and resilient payment gateways.",
    "mustReadArticle": {
      "title": "Scaling Akka and Actor Systems for High-Throughput Payments",
      "topic": "Actor models, concurrency, and resilient distributed state machines"
    },
    "tags": [
      "fintech",
      "actor-model",
      "fraud-detection",
      "payments"
    ]
  },
  {
    "id": "blog-deliveroo",
    "company": "Deliveroo Engineering",
    "url": "https://deliveroo.engineering/",
    "logoDomain": "deliveroo.co.uk",
    "description": "Hyper-local logistics algorithms, kitchen preparation time predictions, and automated dispatch engines under peak load.",
    "mustReadArticle": {
      "title": "Frank: The Deliveroo Automated Dispatch Engine",
      "topic": "Real-time dispatch optimization and event-driven logistics"
    },
    "tags": [
      "dispatch",
      "logistics",
      "machine-learning",
      "real-time"
    ]
  },
  {
    "id": "blog-robinhood",
    "company": "Robinhood Under the Hood",
    "url": "https://robinhood.engineering/",
    "logoDomain": "robinhood.com",
    "description": "Financial order execution systems, fault-tolerant stock market data feeds, and high-concurrency event stream processing.",
    "mustReadArticle": {
      "title": "Building Idempotent Stock Trading Engines for Extreme Volatility",
      "topic": "Order execution, idempotency, and financial ledgers"
    },
    "tags": [
      "trading",
      "fintech",
      "idempotency",
      "event-streams"
    ]
  },
  {
    "id": "blog-monzo",
    "company": "Monzo Technology",
    "url": "https://monzo.com/blog/technology",
    "logoDomain": "monzo.com",
    "description": "Pioneering cloud-native microservices banking with 2,500+ Go microservices on Kubernetes and Cassandra storage.",
    "mustReadArticle": {
      "title": "How Monzo Runs 2,500+ Microservices on Kubernetes",
      "topic": "Microservices boundaries, RPC tracing, and bank-grade durability"
    },
    "tags": [
      "kubernetes",
      "microservices",
      "fintech",
      "golang"
    ]
  },
  {
    "id": "blog-wise",
    "company": "Wise Tech",
    "url": "https://medium.com/wise-engineering",
    "logoDomain": "wise.com",
    "description": "Cross-border currency conversions, global banking rail integrations, multi-region database routing, and event-driven architecture.",
    "mustReadArticle": {
      "title": "Multi-Currency Balance Consistency and Distributed Sagas at Wise",
      "topic": "Saga patterns, eventual consistency, and financial accounting"
    },
    "tags": [
      "payments",
      "sagas",
      "multi-region",
      "consistency"
    ]
  },
  {
    "id": "blog-salesforce",
    "company": "Salesforce Engineering",
    "url": "https://engineering.salesforce.com/",
    "logoDomain": "salesforce.com",
    "description": "Multi-tenant database architectures, metadata-driven query engines, large-scale caching, and enterprise scalability.",
    "mustReadArticle": {
      "title": "Architecting Multi-Tenant Data Stores for Millions of Enterprises",
      "topic": "Multi-tenancy, metadata caching, and row-level tenant security"
    },
    "tags": [
      "multi-tenant",
      "enterprise",
      "databases",
      "metadata"
    ]
  },
  {
    "id": "blog-atlassian",
    "company": "Atlassian Engineering",
    "url": "https://www.atlassian.com/engineering",
    "logoDomain": "atlassian.com",
    "description": "Transforming enterprise monoliths into multi-region cloud services, tenant isolation, and graph-based work management.",
    "mustReadArticle": {
      "title": "Building Micros: Atlassian's Internal Cloud Delivery Platform",
      "topic": "Platform engineering, automated provisioning, and multi-region routing"
    },
    "tags": [
      "platform-engineering",
      "multi-region",
      "cloud",
      "monolith-to-microservices"
    ]
  },
  {
    "id": "blog-booking",
    "company": "Booking.com Tech",
    "url": "https://booking.com/techblog",
    "logoDomain": "booking.com",
    "description": "Global travel inventory indexing, zero-downtime database upgrades, massive A/B testing infrastructure, and caching strategies.",
    "mustReadArticle": {
      "title": "High-Throughput Hotel Room Availability Search and Cache Invalidation",
      "topic": "Search indexing, cache invalidation, and transactional booking locks"
    },
    "tags": [
      "travel",
      "search",
      "inventory",
      "caching"
    ]
  },
  {
    "id": "blog-medium",
    "company": "Medium Engineering",
    "url": "https://medium.engineering/",
    "logoDomain": "medium.com",
    "description": "Publishing platform architecture, responsive image transcoding at scale, collaborative editing, and feed ranking pipelines.",
    "mustReadArticle": {
      "title": "Why and How Medium Moved from Monolith to Microservice Architecture",
      "topic": "Microservices migration, protocol buffers, and RPC boundaries"
    },
    "tags": [
      "content",
      "media",
      "image-processing",
      "microservices"
    ]
  },
  {
    "id": "blog-yelp",
    "company": "Yelp Engineering",
    "url": "https://engineeringblog.yelp.com/",
    "logoDomain": "yelp.com",
    "description": "Real-time search indexing with Elasticsearch, stream processing with Kafka, and MySQL Change Data Capture (CDC).",
    "mustReadArticle": {
      "title": "Streaming MySQL Table Changes to Kafka with Change Data Capture",
      "topic": "Change Data Capture (CDC), Debezium, and search re-indexing"
    },
    "tags": [
      "search",
      "elasticsearch",
      "cdc",
      "kafka"
    ]
  },
  {
    "id": "blog-strava",
    "company": "Strava Engineering",
    "url": "https://medium.com/strava-engineering",
    "logoDomain": "strava.com",
    "description": "Geospatial indexing, spatial matching algorithms, real-time leaderboard aggregation, and telemetry processing.",
    "mustReadArticle": {
      "title": "Segment Matching: Solving Big Spatial Problems on Millions of Activities",
      "topic": "Spatial indexing, geo-hashing, and high-speed telemetry comparison"
    },
    "tags": [
      "geospatial",
      "spatial-indexing",
      "telemetry",
      "real-time"
    ]
  },
  {
    "id": "blog-zoom",
    "company": "Zoom Developer Blog",
    "url": "https://medium.com/zoom-developer-blog",
    "logoDomain": "zoom.us",
    "description": "Global media routing, real-time multimedia conferencing protocols, edge relays, and ultra-low-latency signaling networks.",
    "mustReadArticle": {
      "title": "Architecting Global Real-Time Multimedia Relays for Ultra-Low Latency",
      "topic": "WebRTC, UDP packet routing, jitter buffers, and edge relays"
    },
    "tags": [
      "webrtc",
      "video-streaming",
      "low-latency",
      "networking"
    ]
  },
  {
    "id": "blog-asana",
    "company": "Inside Asana",
    "url": "https://asana.com/inside-asana/engineering",
    "logoDomain": "asana.com",
    "description": "Real-time reactive data store (Luna), graph-based project data models, bidirectional sync, and distributed state management.",
    "mustReadArticle": {
      "title": "Luna: Incremental Computation and Reactivity in Asana's Client-Server Model",
      "topic": "Incremental computation, reactive data stores, and cache graphs"
    },
    "tags": [
      "reactive",
      "data-model",
      "graph",
      "state-sync"
    ]
  }
],
  booksAndWhitepapers: [
  {
    "id": "book-ddia",
    "type": "book",
    "title": "Designing Data-Intensive Applications",
    "author": "Martin Kleppmann",
    "url": "https://dataintensive.net/",
    "description": "Foundational book on data systems, replication, partitioning, transactions, and stream processing.",
    "keyTakeaway": "Choose data models and consistency guarantees based on workload and failure behavior.",
    "coverImageUrl": "/images/system-design/books/book-ddia.jpg",
    "publicationYear": 2017,
    "publisher": "O'Reilly Media",
    "imageSource": "Open Library / O'Reilly",
    "isbn": "9781449373320"
  },
  {
    "id": "book-system-design-interview-1",
    "type": "book",
    "title": "System Design Interview — An Insider's Guide, Volume 1",
    "author": "Alex Xu",
    "url": "https://www.amazon.com/dp/1736049119",
    "description": "Interview-oriented walkthroughs of common large-scale design problems.",
    "keyTakeaway": "Use a repeatable process: requirements, estimates, APIs, data model, architecture, and bottlenecks.",
    "coverImageUrl": "/images/system-design/books/book-system-design-interview-1.jpg",
    "publicationYear": 2020,
    "publisher": "Independently published",
    "imageSource": "Open Library / Author",
    "isbn": "9781736049112"
  },
  {
    "id": "book-system-design-interview-2",
    "type": "book",
    "title": "System Design Interview — An Insider's Guide, Volume 2",
    "author": "Alex Xu and Sahn Lam",
    "url": "https://www.amazon.com/s?k=System+Design+Interview+Volume+2+Alex+Xu",
    "description": "More advanced system design examples and architectural trade-offs.",
    "keyTakeaway": "Explain not only the happy path but also scale limits, failure modes, and trade-offs.",
    "coverImageUrl": "/images/system-design/books/book-system-design-interview-2.jpg",
    "publicationYear": 2022,
    "publisher": "ByteByteGo",
    "imageSource": "Open Library / ByteByteGo",
    "isbn": "9781736049129"
  },
  {
    "id": "book-designing-distributed-systems",
    "type": "book",
    "title": "Designing Distributed Systems",
    "author": "Brendan Burns",
    "url": "https://www.oreilly.com/library/view/designing-distributed-systems/9781491983638/",
    "description": "Patterns for building distributed applications, including cloud-native and container-oriented designs.",
    "keyTakeaway": "Reusable distributed-system patterns help structure reliable applications.",
    "coverImageUrl": "/images/system-design/books/book-designing-distributed-systems.jpg",
    "publicationYear": 2018,
    "publisher": "O'Reilly Media",
    "imageSource": "Open Library / O'Reilly",
    "isbn": "9781491983645"
  },
  {
    "id": "book-understanding-distributed-systems",
    "type": "book",
    "title": "Understanding Distributed Systems",
    "author": "Roberto Vitillo",
    "url": "https://understandingdistributed.systems/",
    "description": "Practical introduction to distributed systems concepts and failure handling.",
    "keyTakeaway": "Reason about partial failure, coordination, consistency, and time explicitly.",
    "coverImageUrl": "/images/system-design/books/book-understanding-distributed-systems.jpg",
    "publicationYear": 2021,
    "publisher": "Independently published",
    "imageSource": "Official Author Publication",
    "isbn": "9798404289411"
  },
  {
    "id": "book-google-sre",
    "type": "book",
    "title": "Site Reliability Engineering",
    "author": "Betsy Beyer, Chris Jones, Jennifer Petoff, and Niall Richard Murphy",
    "url": "https://sre.google/sre-book/table-of-contents/",
    "description": "Free online book about operating reliable production systems at scale.",
    "keyTakeaway": "Use SLOs, error budgets, automation, and incident learning to manage reliability.",
    "coverImageUrl": "/images/system-design/books/book-google-sre.jpg",
    "publicationYear": 2016,
    "publisher": "O'Reilly Media / Google",
    "imageSource": "Open Library / Google SRE",
    "isbn": "9781491929124"
  },
  {
    "id": "book-sre-workbook",
    "type": "book",
    "title": "The Site Reliability Workbook",
    "author": "Betsy Beyer and contributors",
    "url": "https://sre.google/workbook/table-of-contents/",
    "description": "Practical companion with SRE implementation examples and exercises.",
    "keyTakeaway": "Turn reliability principles into operational practices and measurable objectives.",
    "coverImageUrl": "/images/system-design/books/book-sre-workbook.jpg",
    "publicationYear": 2018,
    "publisher": "O'Reilly Media / Google",
    "imageSource": "Google SRE Official Archive",
    "isbn": "9781492044390"
  },
  {
    "id": "book-release-it",
    "type": "book",
    "title": "Release It!",
    "author": "Michael T. Nygard",
    "url": "https://pragprog.com/titles/mnee2/release-it-second-edition/",
    "description": "Production stability patterns, failure modes, and resilience techniques.",
    "keyTakeaway": "Design for overload, timeouts, cascading failures, and recovery.",
    "coverImageUrl": "/images/system-design/books/book-release-it.jpg",
    "publicationYear": 2018,
    "publisher": "Pragmatic Bookshelf",
    "imageSource": "Open Library / Pragmatic Bookshelf",
    "isbn": "9781680502398"
  },
  {
    "id": "book-fundamentals-software-architecture",
    "type": "book",
    "title": "Fundamentals of Software Architecture",
    "author": "Mark Richards and Neal Ford",
    "url": "https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/",
    "description": "Architecture characteristics, styles, decisions, and trade-off analysis.",
    "keyTakeaway": "Architecture is about explicit trade-offs among quality attributes.",
    "coverImageUrl": "/images/system-design/books/book-fundamentals-software-architecture.jpg",
    "publicationYear": 2020,
    "publisher": "O'Reilly Media",
    "imageSource": "Open Library / O'Reilly",
    "isbn": "9781492043454"
  },
  {
    "id": "book-building-microservices",
    "type": "book",
    "title": "Building Microservices",
    "author": "Sam Newman",
    "url": "https://samnewman.io/books/building_microservices_2nd_edition/",
    "description": "Practical guide to service decomposition, communication, deployment, and operations.",
    "keyTakeaway": "Service boundaries and independent delivery matter more than simply splitting code.",
    "coverImageUrl": "/images/system-design/books/book-building-microservices.jpg",
    "publicationYear": 2021,
    "publisher": "O'Reilly Media",
    "imageSource": "Open Library / O'Reilly",
    "isbn": "9781492034025"
  },
  {
    "id": "book-web-scalability",
    "type": "book",
    "title": "Web Scalability for Startup Engineers",
    "author": "Artur Ejsmont",
    "url": "https://www.amazon.com/dp/0071843655",
    "description": "Pragmatic, battle-tested principles for scaling web applications from thousands to millions of concurrent users.",
    "keyTakeaway": "Scale in layers: CDN edge, stateless services, asynchronous task queues, and partitioned data stores.",
    "coverImageUrl": "/images/system-design/books/book-web-scalability.jpg",
    "publicationYear": 2015,
    "publisher": "McGraw-Hill Education",
    "imageSource": "McGraw-Hill Osborne Media",
    "isbn": "9780071843652"
  },
  {
    "id": "book-enterprise-integration-patterns",
    "type": "book",
    "title": "Enterprise Integration Patterns",
    "author": "Gregor Hohpe and Bobby Woolf",
    "url": "https://www.enterpriseintegrationpatterns.com/",
    "description": "The timeless blueprint for asynchronous messaging, publish-subscribe channels, message routing, and transformation.",
    "keyTakeaway": "Decouple systems temporally and spatially with structured asynchronous message channels and filters.",
    "coverImageUrl": "/images/system-design/books/book-enterprise-integration-patterns.jpg",
    "publicationYear": 2003,
    "publisher": "Addison-Wesley",
    "imageSource": "Addison-Wesley Professional",
    "isbn": "9780321200686"
  },
  {
    "id": "book-high-performance-browser-networking",
    "type": "book",
    "title": "High Performance Browser Networking",
    "author": "Ilya Grigorik",
    "url": "https://hpbn.co/",
    "description": "What every software architect must know about TCP, UDP, TLS, HTTP/2, HTTP/3, mobile networks, and WebSocket latencies.",
    "keyTakeaway": "Speed of light and round-trip times are physical bottlenecks; minimize handshakes and roundtrips.",
    "coverImageUrl": "/images/system-design/books/book-high-performance-browser-networking.jpg",
    "publicationYear": 2013,
    "publisher": "O'Reilly Media",
    "imageSource": "O'Reilly Media / Google",
    "isbn": "9781449344764"
  }
],
  architecturalCheatSheets: []
};
