import { User } from "@/models";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.role || session.user.role !== "admin") {
      return Response.json(
        { error: "Unauthorized", message: "Access Denied" },
        { status: 401 }
      );
    }

    const users = User.find({})
      .populate("role")
      .populate("orders")
      .populate("address")
      .lean();

    if (!users) {
      return new Response("No users found", { status: 404 });
    }

    return Response.json(
      { success: true, users, message: "Users fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
