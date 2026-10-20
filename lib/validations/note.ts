import { z } from "zod";

export const NoteWorkspaceModeEnum = z.enum(["INFINITE_CANVAS", "FIXED_WHITEBOARD", "DOCUMENT_NOTE"]);

export const CreateNoteSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().trim().min(1, "Title cannot be empty").max(200, "Title cannot exceed 200 characters").default("Untitled Note"),
  mode: NoteWorkspaceModeEnum.default("INFINITE_CANVAS"),
  elements: z.unknown().optional(),
  appState: z.unknown().optional(),
  files: z.unknown().optional(),
});

export const UpdateNoteSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().trim().min(1).max(200).optional(),
  mode: NoteWorkspaceModeEnum.optional(),
  elements: z.unknown().optional(),
  appState: z.unknown().optional(),
  files: z.unknown().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  isArchived: z.boolean().optional(),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
