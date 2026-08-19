import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import {
  listInstructorCourses,
  createDraftCourse,
} from "@revolab/backend/services/instructor-courses";

export async function GET() {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const courses = await listInstructorCourses(session.user.id);
  return NextResponse.json({ courses });
}

export async function POST(request) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const body = await request.json().catch(() => ({}));
  const course = await createDraftCourse(session.user.id, {
    title: body.title,
    description: body.description,
  });

  return NextResponse.json({ course }, { status: 201 });
}
