import { Order } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // data for dashboard analytics
    const topProducts = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $in: ["confirmed", "shipped", "out_for_delivery", "delivered"],
          },
          status: { $ne: "failed" },
        },
      },

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          sales: { $sum: "$items.qty" },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      { $unwind: "$product" },

      { $sort: { sales: -1 } },
      { $project: { _id: 0, name: "$product.name", sales: 1 } },
    ]);

    if (!topProducts) {
      return NextResponse.json(
        { success: false, message: "No top products found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        topProducts,
        message: "Top products fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
