import { NextResponse } from "next/server";
import { listCourses } from "@revolab/backend/services/courses";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const filter = searchParams.get("filter") ?? undefined;
  const search = searchParams.get("q") ?? undefined;

  const courses = await listCourses({ category, filter, search });
  return NextResponse.json({ courses });
}
