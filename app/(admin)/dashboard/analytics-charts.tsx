"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

export default function AnalyticsCharts() {
    //todo: remove mock functionality
    const salesData = [
        { month: 'Jan', sales: 4000, orders: 120 },
        { month: 'Feb', sales: 3000, orders: 98 },
        { month: 'Mar', sales: 5000, orders: 156 },
        { month: 'Apr', sales: 4500, orders: 134 },
        { month: 'May', sales: 6000, orders: 187 },
        { month: 'Jun', sales: 5500, orders: 165 },
    ];

    const topProducts = [
        { name: 'Wireless Headphones', sales: 890, color: 'hsl(var(--chart-1))' },
        { name: 'Smartphone Case', sales: 760, color: 'hsl(var(--chart-2))' },
        { name: 'Laptop Stand', sales: 650, color: 'hsl(var(--chart-3))' },
        { name: 'USB Cable', sales: 540, color: 'hsl(var(--chart-4))' },
        { name: 'Power Bank', sales: 420, color: 'hsl(var(--chart-5))' },
    ];



    return (
        <div className="flex flex-col gap-4">
            <Card className="lg:col-span-2" data-testid="card-sales-trend">
                <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="green" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={{ fill: "hsl(var(--primary))" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-3" data-testid="card-top-products">
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                                <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                                <Bar dataKey="sales" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}