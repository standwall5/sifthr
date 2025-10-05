import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ moduleId: string; position: string }> }
) {
  const { moduleId, position } = await context.params;
  // Access context.params if needed (in Next.js route handlers, params are passed as part of the second argument)
  // const { moduleId, position } = context.params; // Not needed, already destructured from { params }
  if (!moduleId) {
    return Response.json({ error: "Module ID is required" }, { status: 400 });
  }

  // Fetch all sections for this moduleId from json-server
  const res = await fetch(
    `http://localhost:5000/moduleSections?moduleId=${moduleId}`
  );
  if (!res.ok) {
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
  const sections = await res.json();

  // Find the section with the matching position
  const section = sections.find(
    (s: any) => String(s.position) === String(position)
  );
  const totalPages = sections.length;

  if (section && totalPages) {
    return Response.json(
      {
        section,
        totalPages,
      },
      { status: 200 }
    );
  } else {
    return Response.json({ error: "Section not found" }, { status: 404 });
  }
}
