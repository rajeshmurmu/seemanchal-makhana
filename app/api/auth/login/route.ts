import connectDB from "@/lib/server/mongodb";
import { loginSchema } from "@/lib/validation/auth.validator";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const validate = loginSchema.safeParse({ email, password });

    if (!validate.success) {
      return Response.json({ error: validate.error.message }, { status: 400 });
    }

    return Response.json({ email, password });
  } catch (error) {
    console.error("Error logging in:", error);
    return Response.json({ error: "Error logging in" }, { status: 500 });
  }
}
