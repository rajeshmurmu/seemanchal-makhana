import { authOptions } from "@/lib/server/auth";
import { User } from "@/models";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized", message: "Access Denied" },
        { status: 401 },
      );
    }

    const users = await User.find()
      .populate("role")
      .populate("orders")
      .populate("address")
      .lean({ timeout: 30000 });

    if (!users) {
      return NextResponse.json(
        { success: false, message: "No users found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, users, message: "Users fetched successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
