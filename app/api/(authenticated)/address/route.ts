import { authOptions } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import { Address, User } from "@/models";
import { addressSchema } from "@/shared/schema/address-schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { address } = await req.json();

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const isValidAddress = addressSchema.safeParse(address);
    if (!isValidAddress.success) {
      return NextResponse.json(
        { success: false, message: isValidAddress.error.message },
        { status: 400 }
      );
    }

    await connectDB();
    if (Boolean(isValidAddress.data.isDefault) === true) {
      // set all other addresses to false
      await Address.updateMany(
        { isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = new Address({
      user: session.user.id,
      ...address,
    });

    const savedAddress = await newAddress.save();

    const user = await User.findById(session.user.id);
    if (user) {
      user.address.push(savedAddress._id);
      await user.save();
    }

    return NextResponse.json(
      {
        success: true,
        address: savedAddress,
        message: "Address created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    await connectDB();
    const user = await User.findById(session.user.id).populate({
      path: "address",
      model: "Address",
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        address: user.address,
        message: "Address fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
