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
    version: "2.0",
    totalResources: 107,
    counts: {
      youtubeChannels: 47,
      githubRepos: 18,
      engineeringBlogs: 25,
      booksAndWhitepapers: 17,
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
    "id": "yt-extra-stanfordonline",
    "name": "Stanford Online",
    "handle": "@stanfordonline",
    "url": "https://www.youtube.com/@stanfordonline",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=stanford.edu&sz=128",
    "subscriberCount": "1.9M+",
    "level": "Advanced",
    "description": "Academic lectures on algorithms, databases, networking, and computer systems.",
    "category": "academic-systems",
    "topPlaylists": [
      "Computer Networks",
      "Distributed Systems"
    ],
    "tags": [
      "computer-science",
      "databases",
      "lectures"
    ],
    "featuredVideo": "Stanford AA274A Principles of Robotic Autonomy | Autumn 2019 | Stereo Vision",
    "videoId": "idD08N4rgJU",
    "videoUrl": "https://www.youtube.com/watch?v=idD08N4rgJU",
    "thumbnailUrl": "https://i.ytimg.com/vi/idD08N4rgJU/hqdefault.jpg"
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
    "featuredVideo": "Why Gaming Never Got Big in India",
    "videoId": "4nnKQSH--BA",
    "videoUrl": "https://www.youtube.com/watch?v=4nnKQSH--BA",
    "thumbnailUrl": "https://i.ytimg.com/vi/4nnKQSH--BA/hqdefault.jpg"
  },
  {
    "id": "yt-extra-simplilearn",
    "name": "Simplilearn",
    "handle": "@SimplilearnOfficial",
    "url": "https://www.youtube.com/@SimplilearnOfficial",
    "avatarUrl": "https://www.google.com/s2/favicons?domain=simplilearn.com&sz=128",
    "subscriberCount": "3.5M+",
    "level": "Beginner",
    "description": "Introductory courses on cloud, DevOps, architecture, and software engineering.",
    "category": "cloud-and-platform-engineering",
    "topPlaylists": [
      "System Design",
      "Cloud Computing"
    ],
    "tags": [
      "cloud",
      "devops",
      "courses"
    ],
    "featuredVideo": "Lean Six Sigma Full Course in 24  hours | Learn Six Sigma for Beginners to Advanced | Simplilearn",
    "videoId": "UU5P_qDUbOk",
    "videoUrl": "https://www.youtube.com/watch?v=UU5P_qDUbOk",
    "thumbnailUrl": "https://i.ytimg.com/vi/UU5P_qDUbOk/hqdefault.jpg"
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
    "featuredVideo": "Java slowing down?",
    "videoId": "F68WT2_Dia4",
    "videoUrl": "https://www.youtube.com/watch?v=F68WT2_Dia4",
    "thumbnailUrl": "https://i.ytimg.com/vi/F68WT2_Dia4/hqdefault.jpg"
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
  }
],
  githubRepos: [
    {
      id: "gh-system-design-primer",
      title: "System Design Primer",
      repo: "donnemartin/system-design-primer",
      url: "https://github.com/donnemartin/system-design-primer",
      stars: "260k+",
      description: "Comprehensive open-source guide to scalable system design, with examples and interview questions.",
      topics: ["system-design", "scalability", "interview-prep"],
      highlight: "Best broad starting point; includes common problems and Anki flashcards."
    },
    {
      id: "gh-system-design-101",
      title: "System Design 101",
      repo: "ByteByteGoHq/system-design-101",
      url: "https://github.com/ByteByteGoHq/system-design-101",
      stars: "50k+",
      description: "Visual, approachable explanations of complex systems and architecture concepts.",
      topics: ["system-design", "architecture", "visual-learning"],
      highlight: "Good companion to visual learning and quick concept review."
    },
    {
      id: "gh-awesome-system-design-resources",
      title: "Awesome System Design Resources",
      repo: "ashishps1/awesome-system-design-resources",
      url: "https://github.com/ashishps1/awesome-system-design-resources",
      stars: "12k+",
      description: "Curated list of system design articles, videos, and interview resources.",
      topics: ["awesome-list", "system-design", "learning"],
      highlight: "Useful discovery index for expanding the platform's resource catalog."
    },
    {
      id: "gh-karan-system-design",
      title: "System Design Course",
      repo: "karanpratapsingh/system-design",
      url: "https://github.com/karanpratapsingh/system-design",
      stars: "25k+",
      description: "Structured written guide to core system design topics and common architectures.",
      topics: ["system-design", "distributed-systems", "course"],
      highlight: "Course-like progression from fundamentals to applied topics."
    },
    {
      id: "gh-awesome-scalability",
      title: "Awesome Scalability",
      repo: "binhnguyennus/awesome-scalability",
      url: "https://github.com/binhnguyennus/awesome-scalability",
      stars: "50k+",
      description: "Collection of articles and resources about building scalable and reliable systems.",
      topics: ["scalability", "reliability", "architecture"],
      highlight: "Excellent for production architecture and scalability reading."
    },
    {
      id: "gh-engineering-blogs",
      title: "Engineering Blogs",
      repo: "kilimchoi/engineering-blogs",
      url: "https://github.com/kilimchoi/engineering-blogs",
      stars: "28k+",
      description: "Index of engineering blogs from technology companies.",
      topics: ["engineering-blogs", "architecture", "case-studies"],
      highlight: "A discovery map to primary-source company engineering articles."
    },
    {
      id: "gh-checkcheckzz-system-design",
      title: "System Design Interview",
      repo: "checkcheckzz/system-design-interview",
      url: "https://github.com/checkcheckzz/system-design-interview",
      stars: "14k+",
      description: "Interview-oriented system design questions and learning references.",
      topics: ["system-design", "interview-prep", "questions"],
      highlight: "Helpful for building practice-question collections."
    },
    {
      id: "gh-machine-learning-systems",
      title: "Machine Learning Systems Design",
      repo: "chiphuyen/machine-learning-systems-design",
      url: "https://github.com/chiphuyen/machine-learning-systems-design",
      stars: "11k+",
      description: "Resources and references for designing production machine learning systems.",
      topics: ["ml-systems", "machine-learning", "architecture"],
      highlight: "Extends system design into ML infrastructure and serving."
    },
    {
      id: "gh-realworld-system-design",
      title: "Real World System Design",
      repo: "realworldsystems/realworld-system-design",
      url: "https://github.com/realworldsystems/realworld-system-design",
      stars: "8k+",
      description: "Repository link is a discovery candidate; verify repository availability and ownership before use.",
      topics: ["system-design", "case-studies", "verify-link"],
      highlight: "Keep only after checking current availability and maintenance."
    },
    {
      id: "gh-distributed-systems-reading",
      title: "Distributed Systems Reading List",
      repo: "mehdihadeli/awesome-software-architecture",
      url: "https://github.com/mehdihadeli/awesome-software-architecture",
      stars: "15k+",
      description: "Curated software architecture and distributed-systems learning material.",
      topics: ["software-architecture", "distributed-systems", "reading-list"],
      highlight: "Broader architecture reference beyond interview-specific content."
    },
    {
      id: "gh-system-design-fight-club",
      title: "System Design Fight Club",
      repo: "systemdesign42/system-design",
      url: "https://github.com/systemdesign42/system-design",
      stars: "7k+",
      description: "System design interview practice material and discussion prompts.",
      topics: ["system-design", "practice", "interview-prep"],
      highlight: "Potential practice resource; review repository contents before featuring."
    },
    {
      id: "gh-microservices-patterns",
      title: "Microservices Patterns",
      repo: "microservices-patterns",
      url: "https://microservices.io/patterns/index.html",
      stars: "Official",
      description: "Pattern catalog for microservice architecture, data management, and communication.",
      topics: ["microservices", "patterns", "architecture"],
      highlight: "Primary website with patterns such as saga, CQRS, and transactional outbox."
    },
    {
      id: "gh-design-patterns",
      title: "Refactoring.Guru Design Patterns",
      repo: "refactoringguru/design-patterns",
      url: "https://github.com/refactoringguru/design-patterns",
      stars: "10k+",
      description: "Examples and explanations of classic object-oriented design patterns.",
      topics: ["design-patterns", "oop", "lld"],
      highlight: "Useful for low-level design interviews and code-level architecture."
    },
    {
      id: "gh-system-design-2026",
      title: "System Design Roadmap 2026",
      repo: "ShreyJoshi74/SystemDesign",
      url: "https://github.com/ShreyJoshi74/SystemDesign",
      stars: "4k+",
      description: "A recent community roadmap covering system design topics and learning resources.",
      topics: ["roadmap", "system-design", "interview-prep"],
      highlight: "Treat as a community roadmap, not an authoritative standard."
    },
    {
      id: "gh-system-design-kit",
      title: "System Design KIT",
      repo: "pavanjoshi914/System-Design-KIT",
      url: "https://github.com/pavanjoshi914/System-Design-KIT",
      stars: "6k+",
      description: "Collection of system design concepts, estimation references, and common problems.",
      topics: ["system-design", "cheatsheets", "interview-prep"],
      highlight: "Useful as a checklist-style companion; verify each linked source."
    },
    {
      id: "gh-awesome-low-level-design",
      title: "Awesome Low Level Design",
      repo: "ashishps1/awesome-low-level-design",
      url: "https://github.com/ashishps1/awesome-low-level-design",
      stars: "8k+",
      description: "Curated low-level design, OOP, and machine-coding interview resources.",
      topics: ["low-level-design", "oop", "machine-coding"],
      highlight: "Adds LLD coverage alongside high-level architecture."
    },
    {
      id: "gh-aws-samples",
      title: "AWS Samples",
      repo: "aws-samples",
      url: "https://github.com/aws-samples",
      stars: "Official",
      description: "Official AWS sample applications and architecture implementations.",
      topics: ["aws", "cloud", "reference-architecture"],
      highlight: "Use for practical cloud implementation examples, not interview answers alone."
    },
    {
      id: "gh-googlecloudplatform",
      title: "Google Cloud Platform Samples",
      repo: "GoogleCloudPlatform",
      url: "https://github.com/GoogleCloudPlatform",
      stars: "Official",
      description: "Official Google Cloud sample repositories and deployment examples.",
      topics: ["gcp", "cloud", "reference-architecture"],
      highlight: "Useful implementation references for cloud-native system design."
    }
  ],
  engineeringBlogs: [
    {
      id: "blog-netflix",
      company: "Netflix",
      url: "https://netflixtechblog.com/",
      logoDomain: "netflix.com",
      description: "Engineering stories on streaming, reliability, data platforms, and large-scale infrastructure.",
      mustReadArticle: {
        title: "Netflix TechBlog: scaling and reliability case studies",
        topic: "Streaming architecture, resilience, and platform engineering"
      },
      tags: ["streaming", "reliability", "microservices"]
    },
    {
      id: "blog-uber",
      company: "Uber Engineering",
      url: "https://www.uber.com/blog/engineering/",
      logoDomain: "uber.com",
      description: "Production engineering across marketplace, storage, observability, and infrastructure.",
      mustReadArticle: {
        title: "Uber Engineering: engineering architecture articles",
        topic: "Large-scale services, data infrastructure, and reliability"
      },
      tags: ["marketplace", "data-infrastructure", "reliability"]
    },
    {
      id: "blog-meta",
      company: "Meta Engineering",
      url: "https://engineering.fb.com/",
      logoDomain: "meta.com",
      description: "Architecture and infrastructure posts from Meta's engineering teams.",
      mustReadArticle: {
        title: "Meta Engineering: infrastructure and systems articles",
        topic: "Caching, storage, messaging, and large-scale infrastructure"
      },
      tags: ["infrastructure", "storage", "messaging"]
    },
    {
      id: "blog-discord",
      company: "Discord",
      url: "https://discord.com/blog",
      logoDomain: "discord.com",
      description: "Detailed posts about scaling real-time messaging, databases, and backend services.",
      mustReadArticle: {
        title: "How Discord stores billions of messages",
        topic: "Database scaling and data model evolution"
      },
      tags: ["real-time", "databases", "messaging"]
    },
    {
      id: "blog-cloudflare",
      company: "Cloudflare",
      url: "https://blog.cloudflare.com/",
      logoDomain: "cloudflare.com",
      description: "Networking, edge infrastructure, security, DNS, and performance engineering.",
      mustReadArticle: {
        title: "Cloudflare Blog: architecture and network engineering",
        topic: "Edge networks, caching, DNS, and security"
      },
      tags: ["networking", "edge", "security"]
    },
    {
      id: "blog-aws-builders-library",
      company: "Amazon Builders' Library",
      url: "https://aws.amazon.com/builders-library/",
      logoDomain: "amazon.com",
      description: "Primary-source operational guidance on distributed systems and production engineering.",
      mustReadArticle: {
        title: "Timeouts, retries, and backoff with jitter",
        topic: "Resilient client behavior and retry control"
      },
      tags: ["distributed-systems", "reliability", "operations"]
    },
    {
      id: "blog-aws-architecture",
      company: "AWS Architecture Blog",
      url: "https://aws.amazon.com/blogs/architecture/",
      logoDomain: "amazon.com",
      description: "Reference architectures, design patterns, and cloud system trade-offs.",
      mustReadArticle: {
        title: "AWS Architecture Blog: Well-Architected patterns",
        topic: "Availability, security, cost, and operational excellence"
      },
      tags: ["cloud", "architecture", "reliability"]
    },
    {
      id: "blog-google-cloud",
      company: "Google Cloud Blog",
      url: "https://cloud.google.com/blog/products",
      logoDomain: "cloud.google.com",
      description: "Cloud architecture, data, AI infrastructure, and operational case studies.",
      mustReadArticle: {
        title: "Google Cloud architecture and infrastructure articles",
        topic: "Cloud-native design and platform trade-offs"
      },
      tags: ["cloud", "data", "infrastructure"]
    },
    {
      id: "blog-google-research",
      company: "Google Research",
      url: "https://research.google/blog/",
      logoDomain: "google.com",
      description: "Research-driven posts on systems, data processing, ML, and infrastructure.",
      mustReadArticle: {
        title: "Google Research: systems and data processing posts",
        topic: "Distributed computation and systems research"
      },
      tags: ["research", "distributed-computing", "ml-infrastructure"]
    },
    {
      id: "blog-microsoft-devblogs",
      company: "Microsoft DevBlogs",
      url: "https://devblogs.microsoft.com/",
      logoDomain: "microsoft.com",
      description: "Engineering posts covering cloud platforms, databases, developer tools, and reliability.",
      mustReadArticle: {
        title: "Microsoft engineering posts on cloud architecture",
        topic: "Distributed services and cloud platform design"
      },
      tags: ["cloud", "platform", "databases"]
    },
    {
      id: "blog-linkedin",
      company: "LinkedIn Engineering",
      url: "https://engineering.linkedin.com/blog",
      logoDomain: "linkedin.com",
      description: "Engineering case studies on data infrastructure, Kafka, search, and feed systems.",
      mustReadArticle: {
        title: "LinkedIn Engineering: Kafka and data infrastructure articles",
        topic: "Event streaming and large-scale data pipelines"
      },
      tags: ["kafka", "data-infrastructure", "search"]
    },
    {
      id: "blog-airbnb",
      company: "Airbnb Engineering",
      url: "https://airbnb.tech/",
      logoDomain: "airbnb.com",
      description: "Engineering articles about search, experimentation, data platforms, and service architecture.",
      mustReadArticle: {
        title: "Airbnb Tech: architecture and data platform articles",
        topic: "Search, experimentation, and data systems"
      },
      tags: ["search", "data-platform", "experimentation"]
    },
    {
      id: "blog-shopify",
      company: "Shopify Engineering",
      url: "https://shopify.engineering/",
      logoDomain: "shopify.com",
      description: "Commerce-scale engineering, databases, Ruby systems, and platform reliability.",
      mustReadArticle: {
        title: "Shopify Engineering: scaling commerce systems",
        topic: "Traffic spikes, data consistency, and platform design"
      },
      tags: ["ecommerce", "databases", "scaling"]
    },
    {
      id: "blog-spotify",
      company: "Spotify Engineering",
      url: "https://engineering.atspotify.com/",
      logoDomain: "spotify.com",
      description: "Backend, data, experimentation, and developer platform engineering.",
      mustReadArticle: {
        title: "Spotify Engineering: backend and platform case studies",
        topic: "Service architecture and data pipelines"
      },
      tags: ["backend", "data", "platform"]
    },
    {
      id: "blog-dropbox",
      company: "Dropbox Tech",
      url: "https://dropbox.tech/",
      logoDomain: "dropbox.com",
      description: "Storage, synchronization, infrastructure, and performance engineering.",
      mustReadArticle: {
        title: "Dropbox Tech: storage and synchronization articles",
        topic: "File storage, sync protocols, and infrastructure"
      },
      tags: ["storage", "sync", "distributed-systems"]
    },
    {
      id: "blog-pinterest",
      company: "Pinterest Engineering",
      url: "https://medium.com/pinterest-engineering",
      logoDomain: "pinterest.com",
      description: "Search, recommendation, storage, and large-scale data engineering.",
      mustReadArticle: {
        title: "Pinterest Engineering: search and data infrastructure posts",
        topic: "High-scale indexing and recommendation systems"
      },
      tags: ["search", "recommendation", "data"]
    },
    {
      id: "blog-doordash",
      company: "DoorDash Engineering",
      url: "https://careersatdoordash.com/blog/engineering/",
      logoDomain: "doordash.com",
      description: "Marketplace, logistics, dispatch, and platform engineering case studies.",
      mustReadArticle: {
        title: "DoorDash Engineering: dispatch and marketplace systems",
        topic: "Real-time logistics and distributed workflows"
      },
      tags: ["marketplace", "dispatch", "real-time"]
    },
    {
      id: "blog-etsy",
      company: "Etsy Engineering",
      url: "https://www.etsy.com/codeascraft",
      logoDomain: "etsy.com",
      description: "Practical engineering posts on experimentation, reliability, and data systems.",
      mustReadArticle: {
        title: "Code as Craft: production engineering posts",
        topic: "Observability, delivery, and data-driven engineering"
      },
      tags: ["observability", "data", "reliability"]
    },
    {
      id: "blog-cloudflare-learning",
      company: "Cloudflare Learning Center",
      url: "https://www.cloudflare.com/learning/",
      logoDomain: "cloudflare.com",
      description: "Accessible technical explanations of DNS, CDN, TLS, caching, and networking.",
      mustReadArticle: {
        title: "What is a CDN?",
        topic: "Content delivery networks and edge caching"
      },
      tags: ["networking", "cdn", "fundamentals"]
    },
    {
      id: "blog-martin-fowler",
      company: "Martin Fowler",
      url: "https://martinfowler.com/",
      logoDomain: "martinfowler.com",
      description: "Software architecture, refactoring, microservices, and design principles.",
      mustReadArticle: {
        title: "Microservices",
        topic: "Service boundaries and distributed architecture trade-offs"
      },
      tags: ["architecture", "microservices", "design"]
    },
    {
      id: "blog-high-scalability",
      company: "High Scalability",
      url: "http://highscalability.com/",
      logoDomain: "highscalability.com",
      description: "Architecture case studies and write-ups about high-traffic systems.",
      mustReadArticle: {
        title: "High Scalability architecture case studies",
        topic: "Patterns used in large production systems"
      },
      tags: ["case-studies", "scalability", "architecture"]
    },
    {
      id: "blog-infoq",
      company: "InfoQ Architecture",
      url: "https://www.infoq.com/architecture-design/",
      logoDomain: "infoq.com",
      description: "Software architecture articles, talks, and industry experience reports.",
      mustReadArticle: {
        title: "Architecture and Design articles",
        topic: "Modern architecture approaches and trade-offs"
      },
      tags: ["architecture", "engineering", "industry"]
    },
    {
      id: "blog-confluent",
      company: "Confluent Blog",
      url: "https://www.confluent.io/blog/",
      logoDomain: "confluent.io",
      description: "Event streaming, Kafka, stream processing, and data-in-motion architecture.",
      mustReadArticle: {
        title: "Kafka and event streaming architecture articles",
        topic: "Event-driven systems and stream processing"
      },
      tags: ["kafka", "event-driven", "streaming"]
    },
    {
      id: "blog-redis",
      company: "Redis Blog",
      url: "https://redis.io/blog/",
      logoDomain: "redis.io",
      description: "Caching, data structures, performance, and real-time application patterns.",
      mustReadArticle: {
        title: "Redis caching and data structure guides",
        topic: "Cache design and in-memory data patterns"
      },
      tags: ["redis", "caching", "performance"]
    },
    {
      id: "blog-cockroach",
      company: "Cockroach Labs",
      url: "https://www.cockroachlabs.com/blog/",
      logoDomain: "cockroachlabs.com",
      description: "Distributed SQL, replication, transactions, and database consistency.",
      mustReadArticle: {
        title: "Distributed SQL and transaction design articles",
        topic: "Replication, consistency, and geo-distributed databases"
      },
      tags: ["databases", "consistency", "transactions"]
    }
  ],
  booksAndWhitepapers: [
    {
      id: "book-ddia",
      type: "book",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      url: "https://dataintensive.net/",
      description: "Foundational book on data systems, replication, partitioning, transactions, and stream processing.",
      keyTakeaway: "Choose data models and consistency guarantees based on workload and failure behavior.",
      coverImageUrl: "/images/system-design/books/book-ddia.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2017,
      publisher: "O'Reilly Media",
      imageSource: "Open Library / O'Reilly",
      isbn: "9781449373320"
    },
    {
      id: "book-system-design-interview-1",
      type: "book",
      title: "System Design Interview — An Insider's Guide, Volume 1",
      author: "Alex Xu",
      url: "https://www.amazon.com/dp/1736049119",
      description: "Interview-oriented walkthroughs of common large-scale design problems.",
      keyTakeaway: "Use a repeatable process: requirements, estimates, APIs, data model, architecture, and bottlenecks.",
      coverImageUrl: "/images/system-design/books/book-system-design-interview-1.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2020,
      publisher: "Independently published",
      imageSource: "Open Library / Author",
      isbn: "9781736049112"
    },
    {
      id: "book-system-design-interview-2",
      type: "book",
      title: "System Design Interview — An Insider's Guide, Volume 2",
      author: "Alex Xu and Sahn Lam",
      url: "https://www.amazon.com/s?k=System+Design+Interview+Volume+2+Alex+Xu",
      description: "More advanced system design examples and architectural trade-offs.",
      keyTakeaway: "Explain not only the happy path but also scale limits, failure modes, and trade-offs.",
      coverImageUrl: "/images/system-design/books/book-system-design-interview-2.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2022,
      publisher: "ByteByteGo",
      imageSource: "Open Library / ByteByteGo",
      isbn: "9781736049129"
    },
    {
      id: "book-designing-distributed-systems",
      type: "book",
      title: "Designing Distributed Systems",
      author: "Brendan Burns",
      url: "https://www.oreilly.com/library/view/designing-distributed-systems/9781491983638/",
      description: "Patterns for building distributed applications, including cloud-native and container-oriented designs.",
      keyTakeaway: "Reusable distributed-system patterns help structure reliable applications.",
      coverImageUrl: "/images/system-design/books/book-designing-distributed-systems.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2018,
      publisher: "O'Reilly Media",
      imageSource: "Open Library / O'Reilly",
      isbn: "9781491983645"
    },
    {
      id: "book-understanding-distributed-systems",
      type: "book",
      title: "Understanding Distributed Systems",
      author: "Roberto Vitillo",
      url: "https://understandingdistributed.systems/",
      description: "Practical introduction to distributed systems concepts and failure handling.",
      keyTakeaway: "Reason about partial failure, coordination, consistency, and time explicitly.",
      coverImageUrl: "/images/system-design/books/book-understanding-distributed-systems.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2021,
      publisher: "Independently published",
      imageSource: "Official Author Publication",
      isbn: "9798404289411"
    },
    {
      id: "book-google-sre",
      type: "book",
      title: "Site Reliability Engineering",
      author: "Betsy Beyer, Chris Jones, Jennifer Petoff, and Niall Richard Murphy",
      url: "https://sre.google/sre-book/table-of-contents/",
      description: "Free online book about operating reliable production systems at scale.",
      keyTakeaway: "Use SLOs, error budgets, automation, and incident learning to manage reliability.",
      coverImageUrl: "/images/system-design/books/book-google-sre.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2016,
      publisher: "O'Reilly Media / Google",
      imageSource: "Open Library / Google SRE",
      isbn: "9781491929124"
    },
    {
      id: "book-sre-workbook",
      type: "book",
      title: "The Site Reliability Workbook",
      author: "Betsy Beyer and contributors",
      url: "https://sre.google/workbook/table-of-contents/",
      description: "Practical companion with SRE implementation examples and exercises.",
      keyTakeaway: "Turn reliability principles into operational practices and measurable objectives.",
      coverImageUrl: "/images/system-design/books/book-sre-workbook.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2018,
      publisher: "O'Reilly Media / Google",
      imageSource: "Google SRE Official Archive",
      isbn: "9781492044390"
    },
    {
      id: "book-release-it",
      type: "book",
      title: "Release It!",
      author: "Michael T. Nygard",
      url: "https://pragprog.com/titles/mnee2/release-it-second-edition/",
      description: "Production stability patterns, failure modes, and resilience techniques.",
      keyTakeaway: "Design for overload, timeouts, cascading failures, and recovery.",
      coverImageUrl: "/images/system-design/books/book-release-it.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2018,
      publisher: "Pragmatic Bookshelf",
      imageSource: "Open Library / Pragmatic Bookshelf",
      isbn: "9781680502398"
    },
    {
      id: "book-fundamentals-software-architecture",
      type: "book",
      title: "Fundamentals of Software Architecture",
      author: "Mark Richards and Neal Ford",
      url: "https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/",
      description: "Architecture characteristics, styles, decisions, and trade-off analysis.",
      keyTakeaway: "Architecture is about explicit trade-offs among quality attributes.",
      coverImageUrl: "/images/system-design/books/book-fundamentals-software-architecture.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2020,
      publisher: "O'Reilly Media",
      imageSource: "Open Library / O'Reilly",
      isbn: "9781492043454"
    },
    {
      id: "book-building-microservices",
      type: "book",
      title: "Building Microservices",
      author: "Sam Newman",
      url: "https://samnewman.io/books/building_microservices_2nd_edition/",
      description: "Practical guide to service decomposition, communication, deployment, and operations.",
      keyTakeaway: "Service boundaries and independent delivery matter more than simply splitting code.",
      coverImageUrl: "/images/system-design/books/book-building-microservices.jpg",
      fallbackImageUrl: "/images/system-design/book-fallback.svg",
      publicationYear: 2021,
      publisher: "O'Reilly Media",
      imageSource: "Open Library / O'Reilly",
      isbn: "9781492034025"
    },
    {
      id: "paper-dynamo",
      type: "paper",
      title: "Dynamo: Amazon's Highly Available Key-value Store",
      author: "Giuseppe DeCandia et al.",
      url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
      description: "Classic paper describing Dynamo's design for availability and eventual consistency.",
      keyTakeaway: "Understand quorum techniques, hinted handoff, and trade-offs in highly available stores.",
      coverImageUrl: "/images/system-design/papers/paper-dynamo.svg",
      fallbackImageUrl: "/images/system-design/paper-fallback.svg",
      publicationYear: 2007,
      publisher: "ACM SOSP",
      venue: "SOSP '07",
      imageSource: "Official SOSP '07 Proceedings"
    },
    {
      id: "paper-bigtable",
      type: "paper",
      title: "Bigtable: A Distributed Storage System for Structured Data",
      author: "Fay Chang et al.",
      url: "https://research.google/pubs/bigtable-a-distributed-storage-system-for-structured-data/",
      description: "Google paper on a distributed storage system for structured data.",
      keyTakeaway: "Data layout and partitioning strongly shape scalability and access patterns.",
      coverImageUrl: "/images/system-design/papers/paper-bigtable.svg",
      fallbackImageUrl: "/images/system-design/paper-fallback.svg",
      publicationYear: 2006,
      publisher: "USENIX OSDI",
      venue: "OSDI '06",
      imageSource: "Google Research & USENIX Archive"
    },
    {
      id: "paper-mapreduce",
      type: "paper",
      title: "MapReduce: Simplified Data Processing on Large Clusters",
      author: "Jeffrey Dean and Sanjay Ghemawat",
      url: "https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/",
      description: "Foundational paper on large-scale batch processing.",
      keyTakeaway: "A simple programming model can hide parallelization and fault-tolerance complexity.",
      coverImageUrl: "/images/system-design/papers/paper-mapreduce.svg",
      fallbackImageUrl: "/images/system-design/paper-fallback.svg",
      publicationYear: 2004,
      publisher: "USENIX OSDI",
      venue: "OSDI '04",
      imageSource: "Google Research & USENIX Archive"
    },
    {
      id: "paper-raft",
      type: "paper",
      title: "In Search of an Understandable Consensus Algorithm (Raft)",
      author: "Diego Ongaro and John Ousterhout",
      url: "https://raft.github.io/raft.pdf",
      description: "Consensus algorithm designed to be understandable and practical.",
      keyTakeaway: "Leader election, log replication, and safety rules underpin replicated state machines.",
      coverImageUrl: "/images/system-design/papers/paper-raft.svg",
      fallbackImageUrl: "/images/system-design/paper-fallback.svg",
      publicationYear: 2014,
      publisher: "USENIX ATC",
      venue: "USENIX ATC '14",
      imageSource: "Stanford University & USENIX"
    },
    {
      id: "paper-spanner",
      type: "paper",
      title: "Spanner: Google's Globally-Distributed Database",
      author: "James C. Corbett et al.",
      url: "https://research.google/pubs/spanner-googles-globally-distributed-database/",
      description: "Paper on a globally distributed database with externally consistent transactions.",
      keyTakeaway: "Global consistency has architectural costs and relies on explicit time assumptions.",
      coverImageUrl: "/images/system-design/papers/paper-spanner.svg",
      fallbackImageUrl: "/images/system-design/paper-fallback.svg",
      publicationYear: 2012,
      publisher: "USENIX OSDI",
      venue: "OSDI '12",
      imageSource: "Google Research & USENIX Archive"
    },
    {
      id: "paper-cap",
      type: "paper",
      title: "Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services",
      author: "Seth Gilbert and Nancy Lynch",
      url: "https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf",
      description: "Formal treatment of the CAP trade-off under network partition.",
      keyTakeaway: "During a partition, a distributed service cannot guarantee both full availability and strong consistency.",
      coverImageUrl: "/images/system-design/papers/paper-cap.svg",
      fallbackImageUrl: "/images/system-design/paper-fallback.svg",
      publicationYear: 2002,
      publisher: "ACM SIGACT",
      venue: "ACM SIGACT '02",
      imageSource: "ACM Digital Library & MIT CSAIL"
    },
    {
      id: "paper-end-to-end",
      type: "paper",
      title: "End-to-End Arguments in System Design",
      author: "Jerome H. Saltzer, David P. Reed, and David D. Clark",
      url: "https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf",
      description: "Classic paper on which functions belong in lower layers versus application endpoints.",
      keyTakeaway: "Some correctness guarantees can only be fully implemented at the endpoints.",
      coverImageUrl: "/images/system-design/papers/paper-end-to-end.svg",
      fallbackImageUrl: "/images/system-design/paper-fallback.svg",
      publicationYear: 1984,
      publisher: "ACM TOCS",
      venue: "ACM TOCS '84",
      imageSource: "ACM TOCS & MIT Laboratory for Computer Science"
    }
  ],
  architecturalCheatSheets: [
    {
      id: "cs-latency",
      title: "Latency Numbers & Back-of-the-Envelope Estimation",
      summary: "Estimate QPS, storage, bandwidth, and latency before choosing components.",
      keyPoints: [
        "Calculate average and peak traffic separately.",
        "Track p50, p95, and p99 latency instead of relying on averages.",
        "State assumptions and show the arithmetic so estimates can be challenged."
      ]
    },
    {
      id: "cs-cap",
      title: "CAP Theorem",
      summary: "Understand consistency and availability choices when a network partition occurs.",
      keyPoints: [
        "Partition tolerance matters when network partitions are possible.",
        "During a partition, strong consistency and full availability cannot both be guaranteed.",
        "CAP is not a simple label for every database's normal operating mode."
      ]
    },
    {
      id: "cs-acid-base",
      title: "ACID vs BASE",
      summary: "Compare transaction guarantees with availability-oriented, eventually consistent designs.",
      keyPoints: [
        "ACID emphasizes atomicity, consistency, isolation, and durability.",
        "BASE is a broad description of availability-oriented behavior, not a formal replacement for ACID.",
        "Choose guarantees based on business invariants and user-visible behavior."
      ]
    },
    {
      id: "cs-consistent-hashing",
      title: "Consistent Hashing",
      summary: "Distribute keys across nodes while limiting remapping when membership changes.",
      keyPoints: [
        "Hash both keys and nodes into a ring or equivalent space.",
        "Virtual nodes can improve load distribution.",
        "Plan for hot keys and uneven workloads; hashing alone does not eliminate hotspots."
      ]
    },
    {
      id: "cs-caching",
      title: "Caching Patterns",
      summary: "Choose cache placement, invalidation, and miss behavior deliberately.",
      keyPoints: [
        "Cache-aside is simple but requires explicit expiry and invalidation choices.",
        "TTL bounds staleness but does not guarantee immediate consistency.",
        "Protect the origin from cache stampedes with request coalescing, jitter, or stale-while-revalidate."
      ]
    },
    {
      id: "cs-replication",
      title: "Replication & Consistency",
      summary: "Reason about replicas, lag, read guarantees, and failover.",
      keyPoints: [
        "Synchronous replication can increase write latency; asynchronous replication can lose recent writes during failover.",
        "Read-your-writes and monotonic reads are useful session guarantees.",
        "Define the recovery point and recovery time objectives."
      ]
    },
    {
      id: "cs-sharding",
      title: "Sharding & Partitioning",
      summary: "Split data or workload across nodes and plan for rebalancing.",
      keyPoints: [
        "Choose a shard key that distributes load and supports important queries.",
        "Avoid monotonically increasing or highly skewed keys when they create hotspots.",
        "Design migrations, resharding, and cross-shard queries before scale forces them."
      ]
    },
    {
      id: "cs-queues",
      title: "Queues & Event-Driven Systems",
      summary: "Use asynchronous messaging to decouple producers and consumers.",
      keyPoints: [
        "Assume messages can be delivered more than once and make handlers idempotent.",
        "Use retries with backoff, dead-letter handling, and observability.",
        "Distinguish queue semantics, ordering guarantees, and stream retention."
      ]
    },
    {
      id: "cs-rate-limiting",
      title: "Rate Limiting",
      summary: "Protect services with per-user, per-key, or global request budgets.",
      keyPoints: [
        "Token bucket supports bursts while enforcing a sustained rate.",
        "Leaky bucket smooths output; fixed windows are simple but can allow boundary bursts.",
        "Distributed counters need a clear consistency, latency, and failure policy."
      ]
    },
    {
      id: "cs-resilience",
      title: "Timeouts, Retries & Circuit Breakers",
      summary: "Prevent transient failures from becoming cascading outages.",
      keyPoints: [
        "Set deadlines across the whole request path and leave time for cleanup.",
        "Retry only safe operations, with bounded attempts and exponential backoff plus jitter.",
        "Use circuit breakers, bulkheads, and load shedding where they fit the failure mode."
      ]
    },
    {
      id: "cs-database-choice",
      title: "Choosing a Database",
      summary: "Match data model and access patterns to consistency, query, and operational needs.",
      keyPoints: [
        "Relational databases suit relational data, transactions, and flexible querying.",
        "Key-value, document, wide-column, graph, and search systems optimize different access patterns.",
        "Evaluate indexes, write amplification, replication, backup, and operational complexity—not just benchmarks."
      ]
    },
    {
      id: "cs-api-design",
      title: "API & Idempotency",
      summary: "Design APIs that remain safe under retries and concurrent requests.",
      keyPoints: [
        "Use stable resource identifiers and explicit pagination contracts.",
        "Idempotency keys can prevent duplicate side effects when clients retry writes.",
        "Define versioning, authentication, authorization, timeouts, and error semantics."
      ]
    }
  ]
};
