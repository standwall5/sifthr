import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodbConnection";

import Quiz from "@/app/lib/models/Quiz";

export async function GET() {
  await connectMongoDB();

  const quizzes = await Quiz.find();

  return NextResponse.json(quizzes);
}
