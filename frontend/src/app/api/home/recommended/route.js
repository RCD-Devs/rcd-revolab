import { NextResponse } from "next/server";
import { getRecommendedCourses } from "@revolab/backend/services/courses";

export async function GET() {
  const courses = await getRecommendedCourses();
  return NextResponse.json({ courses });
}
