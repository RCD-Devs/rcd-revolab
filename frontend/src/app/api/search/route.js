import { NextResponse } from "next/server";
import { searchCourses } from "@revolab/backend/services/courses";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const courses = await searchCourses(query);
  return NextResponse.json({ courses });
}
