import { generateAccessToken } from "@/lib/server/generate-token";
import connectDB from "@/lib/server/mongodb";
import { registerSchema } from "@/lib/validation/auth.validator";
import User from "@/models/user.model";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const validate = registerSchema.safeParse({ name, email, password });

    if (!validate.success || validate.error) {
      return Response.json({ error: validate.error.message }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    const user = new User({ name, email, password });
    await user.save();

    const accessToken = generateAccessToken(user._id);
    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return Response.json({
      message: "User Register Successfully",
      token: accessToken,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return Response.json({ error: "Error logging in" }, { status: 500 });
  }
}
