import connectDB from "@/lib/server/mongodb";
import { registerSchema } from "@/shared/schema/register-schema";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const validate = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword: password,
    });

    console.log(validate.error);
    if (!validate.success || validate.error) {
      return Response.json({ error: validate.error.message }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validate.data.password, salt);

    const user = new User({
      name: validate.data.name,
      email: validate.data.email,
      password: hashedPassword,
    });

    await user.save();

    return Response.json(
      {
        message: "User Register Successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Error logging in:", error);
    return Response.json({ error: "Error logging in" }, { status: 500 });
  }
}
