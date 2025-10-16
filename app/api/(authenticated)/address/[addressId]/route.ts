import { authOptions } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import { Address, User } from "@/models";
import { addressSchema } from "@/shared/schema/address-schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const { addressId } = await params;

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

    // validate address
    const isValidAddress = addressSchema.safeParse(address);
    if (!isValidAddress.success) {
      return NextResponse.json(
        { success: false, message: isValidAddress.error.message },
        { status: 400 }
      );
    }

    await connectDB();
    if (Boolean(isValidAddress.data.isDefault) === true) {
      await Address.updateMany({ isDefault: true }, { isDefault: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(addressId, address, {
      new: true,
    });
    if (!updatedAddress) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        address: updatedAddress,
        message: "Address updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const { addressId } = await params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // remove address from user document
    await User.updateOne(
      { _id: session.user.id },
      { $pull: { address: addressId } }
    );

    return NextResponse.json(
      { success: true, message: "Address deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
