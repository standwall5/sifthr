import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import connectMongoDB from "@/app/lib/mongodbConnection";
import User from "@/app/lib/models/User";

export async function POST(req: NextRequest) {
  await connectMongoDB();

  const { email, password } = await req.json();

  // Check user in your own database or json-server
  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { password: _, ...userWithoutPassword } = user.toObject();

  // Success!
  return Response.json({
    success: true,
    user: userWithoutPassword,
  });
}
