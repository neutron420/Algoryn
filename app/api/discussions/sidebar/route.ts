import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEFAULT_POPULAR_TAGS = [
  "Design", "NLP", "Tech", "Leetcode", "Python", "Regex", "SQL", "DBT",
  "Strings", "JSON", "XML", "Markdown", "Unicode", "React", "TypeScript",
  "Next.js", "CSS", "TailwindCSS", "AWS", "Docker", "Kubernetes", "PostgreSQL",
  "Kafka", "Redis", "MongoDB", "GraphQL", "REST API", "Microservices",
  "Algorithms", "Dynamic Programming", "Graphs", "Trees", "System Design",
  "System Architecture", "Node.js", "Java", "C++", "Golang", "Rust", "Linux",
  "Git", "CI/CD", "Testing", "FastAPI", "Pandas", "PyTorch", "OpenAI",
  "LLMs", "LangChain", "RAG", "FAANG", "Mock Interview", "Behavioral",
  "Resume Review", "Salary Negotiation", "Career Advice", "Frontend", "Backend",
  "Fullstack", "DevOps", "Cybersecurity", "WebSockets", "Events", "Hackathon"
];

function cleanTitle(rawTitle: string | null | undefined, rawContent: string): string {
  const source = rawTitle?.trim() || rawContent || "Community Discussion";
  const firstLine = source
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 0) || "Community Discussion";

  const cleaned = firstLine
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#+\s*/g, "")
    .replace(/^>\s*/g, "")
    .replace(/^[-*+]\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_~`#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length > 60) {
    return cleaned.slice(0, 60) + "...";
  }
  return cleaned || "Community Discussion";
}

export async function GET() {
  try {
    // 1. Fetch Trending Posts from database
    const trendingPosts = await prisma.discussionPost.findMany({
      orderBy: [
        { likesCount: "desc" },
        { viewsCount: "desc" },
        { createdAt: "desc" },
      ],
      take: 5,
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        likesCount: true,
        viewsCount: true,
        _count: {
          select: { comments: true },
        },
      },
    });

    const formattedTrending = trendingPosts.map((post) => ({
      id: post.id,
      title: cleanTitle(post.title, post.content),
      likes: post.likesCount,
      comments: post._count.comments,
      views: post.viewsCount,
      category: post.category,
    }));

    // 2. Fetch Top Contributors from database
    const topAuthors = await prisma.discussionPost.groupBy({
      by: ["authorName", "authorHandle", "authorRole", "avatarUrl"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    let formattedContributors = topAuthors.map((author) => ({
      name: author.authorName,
      handle: author.authorHandle || `@${author.authorName.toLowerCase().replace(/\s+/g, "")}`,
      role: author.authorRole || "Software Engineer",
      avatar: author.avatarUrl || null,
      postCount: author._count.id,
    }));

    // If fewer than 5 contributors, augment with real platform users from database
    if (formattedContributors.length < 5) {
      const dbUsers = await prisma.user.findMany({
        where: {
          displayName: { not: null },
        },
        take: 5 - formattedContributors.length,
        select: {
          id: true,
          displayName: true,
          email: true,
          photoUrl: true,
        },
      });

      const userContributors = dbUsers
        .filter((u) => !formattedContributors.some((c) => c.name === u.displayName))
        .map((u) => ({
          name: u.displayName || "Developer",
          handle: u.email ? `@${u.email.split("@")[0]}` : "@developer",
          role: "Software Engineer",
          avatar: u.photoUrl || null,
          postCount: 0,
        }));

      formattedContributors = [...formattedContributors, ...userContributors];
    }

    // 3. Aggregate all Tags from database
    const postTags = await prisma.discussionPost.findMany({
      select: { tags: true },
    });

    const dbTags = Array.from(
      new Set(
        postTags
          .flatMap((p) => p.tags)
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    // Merge with default topics to ensure rich tag cloud
    const mergedTags = Array.from(new Set([...dbTags, ...DEFAULT_POPULAR_TAGS]));

    // Chunk into pages of 12 tags
    const pageSize = 12;
    const tagPages: string[][] = [];
    for (let i = 0; i < mergedTags.length; i += pageSize) {
      tagPages.push(mergedTags.slice(i, i + pageSize));
    }

    return NextResponse.json({
      success: true,
      trending: formattedTrending,
      contributors: formattedContributors,
      tagPages: tagPages.length > 0 ? tagPages : [DEFAULT_POPULAR_TAGS.slice(0, 12)],
    });
  } catch (error: unknown) {
    console.error("Error fetching sidebar data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sidebar data" },
      { status: 500 }
    );
  }
}
