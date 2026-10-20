import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateNoteSchema } from "@/lib/validations/note";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const mode = searchParams.get("mode");
    const query = searchParams.get("q");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing required userId" },
        { status: 401 }
      );
    }

    const where: Record<string, unknown> = {
      userId,
      isArchived: false,
    };

    if (mode && (mode === "INFINITE_CANVAS" || mode === "FIXED_WHITEBOARD" || mode === "DOCUMENT_NOTE")) {
      where.mode = mode;
    }

    if (query && query.trim()) {
      where.title = {
        contains: query.trim(),
        mode: "insensitive",
      };
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        userId: true,
        title: true,
        mode: true,
        thumbnailUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error("Error in GET /api/notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch user notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { userId, title, mode, elements, appState, files } = parsed.data;

    // Verify or ensure user exists in DB
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // Default initial template for Fixed Whiteboard vs Infinite Canvas
    const initialElements = elements || [];
    const initialAppState = appState || {
      viewBackgroundColor: "#ffffff",
      gridSize: mode === "FIXED_WHITEBOARD" ? 20 : null,
    };

    const newNote = await prisma.note.create({
      data: {
        userId,
        title: title || "Untitled Note",
        mode,
        elements: initialElements,
        appState: initialAppState,
        files: files || {},
      },
      select: {
        id: true,
        userId: true,
        title: true,
        mode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, note: newNote }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/notes:", error);
    return NextResponse.json(
      { error: "Failed to create new note canvas" },
      { status: 500 }
    );
  }
}
