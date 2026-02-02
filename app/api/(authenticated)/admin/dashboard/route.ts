import { Order, Product, User } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // fetching admin dashboard data

    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.find({
      status: "paid",
    }).countDocuments();

    const totalRevenue = await Order.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" },
        },
      },
    ]);

    const [productsCount, usersCount, revenue, orders] = await Promise.all([
      totalProducts,
      totalUsers,
      totalRevenue,
      totalOrders,
    ]);

    const metrics = {
      revenue: {
        title: "Total Revenue",
        value: (revenue[0]?.revenue || 0) / 100, // converting paise to rupees
      },
      orders: {
        title: "Total Orders",
        value: orders,
      },

      users: {
        title: "Customers",
        customers: usersCount,
      },
      products: {
        title: "Products",
        products: productsCount,
      },
    };

    return NextResponse.json(
      { metrics, message: "Admin dashboard data fetched successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin dashboard data" },
      { status: 500 },
    );
  }
}
