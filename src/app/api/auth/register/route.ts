import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import connectMongoDB from "@/app/lib/mongodbConnection";
import User from "@/app/lib/models/User";

export async function POST(req: NextRequest) {
  await connectMongoDB();
  try {
    const { name, age, email, password, repeatPassword } = await req.json();

    console.log("Sending data:", {
      name,
      age,
      email,
      password,
      repeatPassword,
    });

    // Basic validation
    if (!name || !email || !password || !repeatPassword) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user object
    const createdUser = await User.create({
      name,
      age,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    const { password: _, ...userWithoutPassword } = createdUser.toObject();

    return Response.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (e) {
    console.error("Registration error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
