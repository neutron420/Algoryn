import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId parameter" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        targets: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                  select: { problems: true, communityProblems: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        solved: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                leetcodeUrl: true,
                companies: {
                  select: {
                    company: {
                      select: { id: true, name: true, slug: true },
                    },
                  },
                },
                topics: {
                  select: {
                    topic: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        bookmarks: {
          select: { problemId: true },
        },
        submissions: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            platform: true,
            roundType: true,
            createdAt: true,
            company: {
              select: { name: true, slug: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 15,
        },
        discussionPosts: {
          select: {
            id: true,
            title: true,
            content: true,
            category: true,
            viewsCount: true,
            likesCount: true,
            bookmarksCount: true,
            createdAt: true,
            _count: {
              select: { comments: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 15,
        },
        platformAccounts: {
          include: {
            stats: true,
          },
        },
        leaderboardEntry: true,
      },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          id: userId,
        },
      });

      user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          targets: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  _count: {
                    select: { problems: true, communityProblems: true },
                  },
                },
              },
            },
          },
          solved: {
            include: {
              problem: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  difficulty: true,
                  leetcodeUrl: true,
                  companies: {
                    select: {
                      company: {
                        select: { id: true, name: true, slug: true },
                      },
                    },
                  },
                  topics: {
                    select: {
                      topic: { select: { id: true, name: true } },
                    },
                  },
                },
              },
            },
          },
          bookmarks: { select: { problemId: true } },
          submissions: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              platform: true,
              roundType: true,
              createdAt: true,
              company: { select: { name: true, slug: true } },
            },
            take: 15,
          },
          discussionPosts: {
            select: {
              id: true,
              title: true,
              content: true,
              category: true,
              viewsCount: true,
              likesCount: true,
              bookmarksCount: true,
              createdAt: true,
              _count: { select: { comments: true } },
            },
            take: 15,
          },
          platformAccounts: { include: { stats: true } },
          leaderboardEntry: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "User profile could not be retrieved" },
        { status: 500 }
      );
    }

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    const companySolvedCountMap = new Map<number, number>();
    const topicSolvedCountMap = new Map<string, number>();

    const recentSolved = [];

    for (const item of user.solved) {
      if (!item.problem) continue;
      const prob = item.problem;

      if (prob.difficulty === "EASY") easySolved++;
      else if (prob.difficulty === "MEDIUM") mediumSolved++;
      else if (prob.difficulty === "HARD") hardSolved++;

      for (const cp of prob.companies) {
        companySolvedCountMap.set(
          cp.company.id,
          (companySolvedCountMap.get(cp.company.id) || 0) + 1
        );
      }

      for (const pt of prob.topics) {
        topicSolvedCountMap.set(
          pt.topic.name,
          (topicSolvedCountMap.get(pt.topic.name) || 0) + 1
        );
      }

      recentSolved.push({
        id: prob.id,
        title: prob.title,
        slug: prob.slug,
        difficulty: prob.difficulty,
        leetcodeUrl: prob.leetcodeUrl,
        solvedAt: item.createdAt.toISOString(),
        companies: prob.companies.map((c) => ({
          name: c.company.name,
          slug: c.company.slug,
        })),
        topics: prob.topics.map((t) => t.topic.name),
      });
    }

    const targetProgress = user.targets.map((t) => {
      const total =
        (t.company._count.problems || 0) + (t.company._count.communityProblems || 0);
      const solved = companySolvedCountMap.get(t.company.id) || 0;
      const percentage = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;

      return {
        companyId: t.company.id,
        companyName: t.company.name,
        companySlug: t.company.slug,
        totalProblems: total,
        solvedCount: solved,
        percentage,
      };
    });

    const topTopics = Array.from(topicSolvedCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const formattedPosts = user.discussionPosts.map((p) => ({
      id: p.id,
      title: p.title || "Untitled Discussion",
      category: p.category,
      viewsCount: p.viewsCount,
      likesCount: p.likesCount,
      commentsCount: p._count.comments,
      createdAt: p.createdAt.toISOString(),
      isInterviewExperience: p.category.toLowerCase().includes("interview"),
    }));

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoUrl,
        bannerUrl: user.bannerUrl,
        headline: user.headline,
        bio: user.bio,
        collegeOrCompany: user.collegeOrCompany,
        location: user.location,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      stats: {
        totalSolved: user.solved.length,
        easySolved,
        mediumSolved,
        hardSolved,
        bookmarksCount: user.bookmarks.length,
        submissionsCount: user.submissions.length,
        postsCount: user.discussionPosts.length,
        globalRank: user.leaderboardEntry?.globalRank || 0,
        totalScore: user.leaderboardEntry?.totalScore || 0,
      },
      targetProgress,
      topTopics,
      recentSolved: recentSolved.slice(0, 15),
      submissions: user.submissions,
      posts: formattedPosts,
      platformAccounts: user.platformAccounts,
    });
  } catch (error) {
    console.error("Error in /api/user/profile GET:", error);
    return NextResponse.json(
      { error: "Failed to load user profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      displayName,
      headline,
      bio,
      collegeOrCompany,
      location,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      photoUrl,
      bannerUrl,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId parameter" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        displayName: displayName !== undefined ? displayName : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
        bannerUrl: bannerUrl !== undefined ? bannerUrl : undefined,
        headline: headline !== undefined ? headline : undefined,
        bio: bio !== undefined ? bio : undefined,
        collegeOrCompany: collegeOrCompany !== undefined ? collegeOrCompany : undefined,
        location: location !== undefined ? location : undefined,
        githubUrl: githubUrl !== undefined ? githubUrl : undefined,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : undefined,
        portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : undefined,
      },
      create: {
        id: userId,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
        bannerUrl: bannerUrl || null,
        headline: headline || null,
        bio: bio || null,
        collegeOrCompany: collegeOrCompany || null,
        location: location || null,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        portfolioUrl: portfolioUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in /api/user/profile PATCH:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
