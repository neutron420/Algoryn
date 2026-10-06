import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const username = searchParams.get("username");

    if (!userId && !username) {
      return NextResponse.json(
        { error: "Missing required userId or username parameter" },
        { status: 400 }
      );
    }

    const userInclude = {
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
        orderBy: { createdAt: "desc" as const },
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
        orderBy: { createdAt: "desc" as const },
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
        orderBy: { createdAt: "desc" as const },
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
        orderBy: { createdAt: "desc" as const },
        take: 15,
      },
      platformAccounts: {
        include: {
          stats: {
            orderBy: { fetchedAt: "desc" as const },
          },
        },
      },
      leaderboardEntry: true,
    };

    let user = null;

    if (username) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: { equals: username, mode: "insensitive" } },
            { id: username },
          ],
        },
        include: userInclude,
      });

      if (!user) {
        return NextResponse.json(
          { error: `User with username '${username}' not found` },
          { status: 404 }
        );
      }
    } else if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: userInclude,
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            id: userId,
          },
          include: userInclude,
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "User profile could not be retrieved" },
        { status: 404 }
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

    const STANDARD_DSA_TOPICS = [
      "Arrays",
      "Dynamic Programming",
      "Strings",
      "Graphs",
      "Hashing",
      "Recursion & Backtracking",
      "Linked List",
      "Stack & Queues",
      "Binary Search",
      "Binary Trees",
      "Mathematics",
      "Bit Manipulation",
      "Greedy Algorithms",
      "Heaps",
      "Sorting",
      "Binary Search Trees",
      "Tries",
      "Advanced Range Data Structures",
      "General & N-ary Trees",
      "Ordered Sets & Maps",
    ];

    const activityMap: Record<string, number> = {};
    const leetcodeActivityMap: Record<string, number> = {};
    const codeforcesActivityMap: Record<string, number> = {};

    for (const item of user.solved) {
      if (item.createdAt) {
        const d = item.createdAt.toISOString().split("T")[0];
        activityMap[d] = (activityMap[d] || 0) + 1;
      }
    }

    for (const sub of user.submissions) {
      if (sub.createdAt) {
        const d = sub.createdAt.toISOString().split("T")[0];
        activityMap[d] = (activityMap[d] || 0) + 1;
      }
    }

    let platformContests = 0;
    let platformContributions = 0;
    const leetcodeTopicMap = new Map<string, number>();
    const platformTopicMaps: Record<string, Map<string, number>> = {};

    for (const pa of user.platformAccounts) {
      const platKey = pa.platform.toUpperCase();
      const latestStat = Array.isArray(pa.stats) ? pa.stats[0] : (pa.stats as any);
      if (!latestStat) continue;

      const raw = latestStat.rawData as any;
      const cCount = latestStat.contestsCount ?? raw?.contestsCount;
      if (typeof cCount === "number") {
        platformContests += cCount;
      }

      if (raw?.dailySubmissions && typeof raw.dailySubmissions === "object") {
        for (const [d, count] of Object.entries(raw.dailySubmissions)) {
          const num = typeof count === "number" ? count : 0;
          if (num > 0) {
            activityMap[d] = (activityMap[d] || 0) + num;
            platformContributions += num;
            if (pa.platform === "LEETCODE") {
              leetcodeActivityMap[d] = (leetcodeActivityMap[d] || 0) + num;
            } else if (pa.platform === "CODEFORCES") {
              codeforcesActivityMap[d] = (codeforcesActivityMap[d] || 0) + num;
            }
          }
        }
      } else if (typeof latestStat.contributions === "number") {
        platformContributions += latestStat.contributions;
      }

      if (raw?.topicStats && typeof raw.topicStats === "object") {
        if (!platformTopicMaps[platKey]) {
          platformTopicMaps[platKey] = new Map<string, number>();
        }
        for (const [topName, count] of Object.entries(raw.topicStats)) {
          const num = typeof count === "number" ? count : 0;
          if (num > 0) {
            platformTopicMaps[platKey].set(topName, num);
            if (pa.platform === "LEETCODE") {
              leetcodeTopicMap.set(topName, num);
            }
          }
        }
      }
    }

    const sortedDates = Object.keys(activityMap).sort();
    let bestStreak = 0;
    let currentStreak = 0;
    if (sortedDates.length > 0) {
      let streak = 0;
      let prevDate: Date | null = null;
      for (const dateStr of sortedDates) {
        const currDate = new Date(dateStr);
        if (!prevDate) {
          streak = 1;
        } else {
          const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak++;
          } else if (diffDays > 1) {
            streak = 1;
          }
        }
        if (streak > bestStreak) bestStreak = streak;
        prevDate = currDate;
      }
      const today = new Date().toISOString().split("T")[0];
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split("T")[0];
      const lastActiveDate = sortedDates[sortedDates.length - 1];
      if (lastActiveDate === today || lastActiveDate === yesterday) {
        currentStreak = streak;
      }
    }

    const totalContributions = user.solved.length + user.submissions.length + platformContributions;
    const activeDays = Object.keys(activityMap).length;

    const topicStats = STANDARD_DSA_TOPICS.map((topicName) => {
      let count = topicSolvedCountMap.get(topicName) || 0;
      if (!count) {
        for (const [key, val] of topicSolvedCountMap.entries()) {
          if (key.toLowerCase() === topicName.toLowerCase()) {
            count = val;
            break;
          }
        }
      }
      return { name: topicName, count };
    });

    const leetcodeTopics = STANDARD_DSA_TOPICS.map((topicName) => {
      let count = leetcodeTopicMap.get(topicName) || 0;
      if (!count) {
        for (const [key, val] of leetcodeTopicMap.entries()) {
          if (key.toLowerCase() === topicName.toLowerCase()) {
            count = val;
            break;
          }
        }
      }
      return { name: topicName, count };
    });

    const platformTopics: Record<string, Array<{ name: string; count: number }>> = {};
    for (const [pKey, pMap] of Object.entries(platformTopicMaps)) {
      platformTopics[pKey] = STANDARD_DSA_TOPICS.map((topicName) => {
        let count = pMap.get(topicName) || 0;
        if (!count) {
          for (const [key, val] of pMap.entries()) {
            if (key.toLowerCase() === topicName.toLowerCase() || key.includes(topicName.toLowerCase()) || topicName.toLowerCase().includes(key)) {
              count = val;
              break;
            }
          }
        }
        return { name: topicName, count };
      });
    }

    const [totalProblemCount, easyProblemCount, mediumProblemCount, hardProblemCount] = await Promise.all([
      prisma.problem.count().catch(() => 0),
      prisma.problem.count({ where: { difficulty: "EASY" } }).catch(() => 0),
      prisma.problem.count({ where: { difficulty: "MEDIUM" } }).catch(() => 0),
      prisma.problem.count({ where: { difficulty: "HARD" } }).catch(() => 0),
    ]);

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
        username: user.username,
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
        twitterUrl: user.twitterUrl,
        instagramUrl: user.instagramUrl,
        portfolioUrl: user.portfolioUrl,
        roleType: user.roleType,
        graduationYear: user.graduationYear,
        educationHistory: user.educationHistory,
        experienceHistory: user.experienceHistory,
        skillsData: user.skillsData,
        projectList: user.projectList,
        connectionsData: user.connectionsData,
        sectionVisibility: user.sectionVisibility,
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
      topTopics: topicStats,
      leetcodeTopics,
      platformTopics,
      activity: {
        dailySubmissions: activityMap,
        leetcodeSubmissions: leetcodeActivityMap,
        codeforcesSubmissions: codeforcesActivityMap,
        totalContributions,
        activeDays,
        bestStreak,
        currentStreak,
        contestsCount: platformContests,
      },
      problemTargets: {
        total: totalProblemCount,
        easy: easyProblemCount,
        medium: mediumProblemCount,
        hard: hardProblemCount,
      },
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
      username,
      phoneNumber,
      headline,
      bio,
      collegeOrCompany,
      location,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      instagramUrl,
      portfolioUrl,
      photoUrl,
      bannerUrl,
      roleType,
      graduationYear,
      educationHistory,
      experienceHistory,
      skillsData,
      projectList,
      connectionsData,
      sectionVisibility,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId parameter" },
        { status: 400 }
      );
    }

    if (username) {
      const existing: any = await prisma.$queryRaw`
        SELECT "id" FROM "User" WHERE "username" = ${username.trim()} AND "id" != ${userId} LIMIT 1
      `;

      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { error: "This username is already taken. Please pick another." },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        displayName: displayName !== undefined ? displayName : undefined,
        username: username !== undefined ? (username ? username.trim() : null) : undefined,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : undefined,
        photoUrl: photoUrl !== undefined ? (photoUrl ? photoUrl : null) : undefined,
        bannerUrl: bannerUrl !== undefined ? (bannerUrl ? bannerUrl : null) : undefined,
        headline: headline !== undefined ? headline : undefined,
        bio: bio !== undefined ? bio : undefined,
        collegeOrCompany: collegeOrCompany !== undefined ? collegeOrCompany : undefined,
        location: location !== undefined ? location : undefined,
        githubUrl: githubUrl !== undefined ? githubUrl : undefined,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : undefined,
        twitterUrl: twitterUrl !== undefined ? twitterUrl : undefined,
        instagramUrl: instagramUrl !== undefined ? instagramUrl : undefined,
        portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : undefined,
        roleType: roleType !== undefined ? roleType : undefined,
        graduationYear: graduationYear !== undefined ? (graduationYear ? Number(graduationYear) : null) : undefined,
        educationHistory: educationHistory !== undefined ? educationHistory : undefined,
        experienceHistory: experienceHistory !== undefined ? experienceHistory : undefined,
        skillsData: skillsData !== undefined ? skillsData : undefined,
        projectList: projectList !== undefined ? projectList : undefined,
        connectionsData: connectionsData !== undefined ? connectionsData : undefined,
        sectionVisibility: sectionVisibility !== undefined ? sectionVisibility : undefined,
      },
      create: {
        id: userId,
        displayName: displayName || null,
        username: username ? username.trim() : null,
        phoneNumber: phoneNumber || null,
        photoUrl: photoUrl || null,
        bannerUrl: bannerUrl || null,
        headline: headline || null,
        bio: bio || null,
        collegeOrCompany: collegeOrCompany || null,
        location: location || null,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        twitterUrl: twitterUrl || null,
        instagramUrl: instagramUrl || null,
        portfolioUrl: portfolioUrl || null,
        roleType: roleType || null,
        graduationYear: graduationYear ? Number(graduationYear) : null,
        educationHistory: educationHistory || null,
        experienceHistory: experienceHistory || null,
        skillsData: skillsData || null,
        projectList: projectList || null,
        connectionsData: connectionsData || null,
        sectionVisibility: sectionVisibility || null,
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

