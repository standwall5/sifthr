import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("http://localhost:5000/modules");
  const modules = await res.json();

  return NextResponse.json(modules);
}
