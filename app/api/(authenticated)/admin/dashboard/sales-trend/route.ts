import { Order } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const salesData = await Order.aggregate([
      // count only valid orders
      {
        $match: {
          orderStatus: {
            $in: ["confirmed", "shipped", "out_for_delivery", "delivered"],
          },
          status: { $ne: "failed" },
        },
      },

      // flatten items
      { $unwind: "$items" },

      // group by month
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            orderId: "$_id",
          },
          orderRevenue: {
            $sum: { $multiply: ["$items.qty", "$items.price"] },
          },
        },
      },

      // regroup to month level
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          sales: { $sum: "$orderRevenue" },
          orders: { $sum: 1 },
        },
      },

      // sort by month
      { $sort: { "_id.year": 1, "_id.month": 1 } },

      // format output
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              { $subtract: ["$_id.month", 1] },
            ],
          },
          sales: 1,
          orders: 1,
        },
      },
      // convert sales from paise to rupees (1 paise = 0.01 rupees)
      // {
      //   $addFields: {
      //     sales: { $divide: ["$sales", 100] },
      //   },
      // },
    ]);
    return NextResponse.json(
      {
        success: true,
        salesData,
        message: "Sales trend fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
