import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { createLessonVideoUploadUrl } from "@revolab/backend/services/instructor-courses";
import { MAX_LESSON_VIDEO_BYTES } from "@revolab/backend/constants/lesson-video";

export async function POST(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const contentType = body?.contentType;
  const size = body?.size;

  if (!contentType || typeof size !== "number") {
    return NextResponse.json({ error: "Falta 'contentType' o 'size'" }, { status: 400 });
  }

  if (size > MAX_LESSON_VIDEO_BYTES) {
    return NextResponse.json(
      {
        error: `El video supera el máximo permitido de ${Math.round(MAX_LESSON_VIDEO_BYTES / (1024 * 1024))} MB.`,
      },
      { status: 413 },
    );
  }

  const isAdmin = session.user.role === "ADMIN";
  const result = await createLessonVideoUploadUrl(id, session.user.id, contentType, isAdmin);

  if (!result) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }

  return NextResponse.json(result);
}
