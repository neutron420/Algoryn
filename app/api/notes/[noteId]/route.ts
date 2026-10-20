import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateNoteSchema } from "@/lib/validations/note";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing userId" },
        { status: 401 }
      );
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // Ownership check
    if (note.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to view this note" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      note: {
        id: note.id,
        userId: note.userId,
        title: note.title,
        mode: note.mode,
        elements: note.elements,
        appState: note.appState,
        files: note.files,
        thumbnailUrl: note.thumbnailUrl,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/notes/[noteId]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve canvas note" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params;

    // Check payload size limit (10MB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Payload exceeds 10MB limit." },
        { status: 413 }
      );
    }

    const body = await req.json();
    const parsed = UpdateNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { userId, title, mode, elements, appState, files, thumbnailUrl, isArchived } = parsed.data;

    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
      select: { id: true, userId: true },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // Strict ownership verification
    if (existingNote.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You cannot modify this note" },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (mode !== undefined) updateData.mode = mode;
    if (elements !== undefined) updateData.elements = elements;
    if (appState !== undefined) updateData.appState = appState;
    if (files !== undefined) updateData.files = files;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (isArchived !== undefined) updateData.isArchived = isArchived;

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
      select: {
        id: true,
        title: true,
        mode: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      note: updatedNote,
      message: "Canvas saved successfully",
    });
  } catch (error) {
    console.error("Error in PATCH /api/notes/[noteId]:", error);
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 }
    );
  }
}

// Support sendBeacon on page unload
export async function POST(
  req: Request,
  context: { params: Promise<{ noteId: string }> }
) {
  return PATCH(req, context);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing userId" },
        { status: 401 }
      );
    }

    const existing = await prisma.note.findUnique({
      where: { id: noteId },
      select: { id: true, userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete this note" },
        { status: 403 }
      );
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/notes/[noteId]:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
