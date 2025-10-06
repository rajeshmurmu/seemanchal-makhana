import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ReactNode;
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
    return (
        <Card data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="text-muted-foreground">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold" data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {value}
                </div>
                <div className="flex items-center text-xs">
                    {trend === "up" ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-chart-1" />
                    ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-chart-5" />
                    )}
                    <span className={trend === "up" ? "text-chart-1" : "text-chart-5"}>
                        {change}
                    </span>
                    <span className="ml-1 text-muted-foreground">from last month</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardMetrics() {
    //todo: remove mock functionality
    const metrics = [
        {
            title: "Total Revenue",
            value: "$54,231",
            change: "+12.5%",
            trend: "up" as const,
            icon: <DollarSign className="h-4 w-4" />
        },
        {
            title: "Orders",
            value: "1,429",
            change: "+8.2%",
            trend: "up" as const,
            icon: <ShoppingCart className="h-4 w-4" />
        },
        {
            title: "Customers",
            value: "892",
            change: "+3.1%",
            trend: "up" as const,
            icon: <Users className="h-4 w-4" />
        },
        {
            title: "Products",
            value: "234",
            change: "-2.4%",
            trend: "down" as const,
            icon: <Package className="h-4 w-4" />
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
            ))}
        </div>
    );
}