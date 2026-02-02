
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDashboardMetrics } from "@/hooks/use-dashboard-data";
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, IndianRupee } from "lucide-react";

interface Metrics {
    title: string;
    value: string;
    change?: string;
    trend?: "up" | "down";
    icon?: React.ReactNode;
}

interface MetricCardProps {
    metrics: Metrics,
    isLoading?: boolean;
}

interface DashboardMetricsProps {
    metrics: IDashboardMetrics;
    isLoading?: boolean;
    metricsIsLoading?: boolean;
}

function MetricCard({ metrics: { title, value, change, trend, icon }, isLoading }: MetricCardProps) {
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
                    {isLoading ? <span className="animate-pulse px-12 rounded bg-muted"></span> : value}
                </div>

                {trend && change && (
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
                )}
            </CardContent>
        </Card>
    );
}

export default function DashboardMetrics({ metrics, metricsIsLoading }: DashboardMetricsProps) {
    //todo: remove mock data
    // const metrics = [
    //     {
    //         title: "Total Revenue",
    //         value: "$54,231",
    //         change: "+12.5%",
    //         trend: "up" as const,
    //         icon: <IndianRupee className="h-4 w-4" />
    //     },
    //     {
    //         title: "Orders",
    //         value: "1,429",
    //         change: "+8.2%",
    //         trend: "up" as const,
    //         icon: <ShoppingCart className="h-4 w-4" />
    //     },
    //     {
    //         title: "Customers",
    //         value: "892",
    //         change: "+3.1%",
    //         trend: "up" as const,
    //         icon: <Users className="h-4 w-4" />
    //     },
    //     {
    //         title: "Products",
    //         value: "234",
    //         change: "-2.4%",
    //         trend: "down" as const,
    //         icon: <Package className="h-4 w-4" />
    //     }
    // ];

    const fetchedMetrics: Metrics[] = [
        {
            title: "Total Revenue",
            value: `₹${Number(metrics.revenue).toFixed(2)}`,
            icon: <IndianRupee className="h-4 w-4" />
        },
        {
            title: "Total Orders",
            value: metrics.orders.toString(),
            icon: <ShoppingCart className="h-4 w-4" />
        },
        {
            title: "Customers",
            value: metrics.users.toString(),
            icon: <Users className="h-4 w-4" />
        },
        {
            title: "Products",
            value: metrics.products.toString(),
            icon: <Package className="h-4 w-4" />
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {fetchedMetrics.map((metric) => (
                <MetricCard
                    isLoading={metricsIsLoading}
                    key={metric.title}
                    metrics={metric}
                />
            ))}
        </div>
    );
}