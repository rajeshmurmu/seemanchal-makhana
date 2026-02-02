"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSalesTrend, fetchTopProducts } from "@/lib/client/dashboard-api";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Tooltip, Legend } from 'recharts';
import LoadingState from "../components/loading-state";

interface TopProduct {
    name: string;
    sales: number;
}

interface SalesData {
    month: string;
    sales: number;
    orders: number;
}

export default function AnalyticsCharts() {
    // mock data for sales data
    // const salesData = [
    //     { month: 'Jan', sales: 4000, orders: 120 },
    //     { month: 'Feb', sales: 3000, orders: 98 },
    //     { month: 'Mar', sales: 5000, orders: 156 },
    //     { month: 'Apr', sales: 4500, orders: 134 },
    //     { month: 'May', sales: 6000, orders: 187 },
    //     { month: 'Jun', sales: 5500, orders: 165 },
    // ];

    // mock data for top products
    // const topProducts = [
    //     { name: 'Wireless Headphones', sales: 890 },
    //     { name: 'Smartphone Case', sales: 760 },
    //     { name: 'Laptop Stand', sales: 650 },
    //     { name: 'USB Cable', sales: 540 },
    //     { name: 'Power Bank', sales: 420 },
    // ];

    const [topProductMetrics, setProductsMetrics] = useState<TopProduct[]>([]);
    const [salesDataMetrics, setSalesDataMetrics] = useState<SalesData[]>([]);

    const { data: salesTrendData, isLoading: salesTrendLoading, error: salesTrendError, isError: salesTrendIsError, refetch: salesTrendRefetch } = useQuery({
        queryKey: ['sales-trend'],
        queryFn: () => fetchSalesTrend()
    })


    const { data: topProductsData, isLoading: topProductsLoading, error: topProductsError, isError: topProductsIsError, refetch: topProductsRefetch } = useQuery({
        queryKey: ['top-products'],
        queryFn: () => fetchTopProducts()
    })

    // UseEffects to handle sales trend fetching results
    useEffect(() => {
        if (salesTrendData) {
            setSalesDataMetrics(salesTrendData.salesData || [])
        }
    }, [salesTrendData])

    useEffect(() => {
        if (salesTrendError || salesTrendIsError) {
            salesTrendRefetch()
            setSalesDataMetrics([])
        }
    }, [salesTrendError, salesTrendIsError, salesTrendRefetch])



    // UseEffects to handle top products fetching results
    useEffect(() => {
        if (topProductsData) {
            setProductsMetrics(topProductsData.topProducts || [])
        }
    }, [topProductsData])

    useEffect(() => {
        if (topProductsError || topProductsIsError) {
            topProductsRefetch()
            setProductsMetrics([])

        }
    }, [topProductsError, topProductsIsError, topProductsRefetch])




    return (
        <div className="flex flex-col gap-4">
            <Card className="lg:col-span-2" data-testid="card-sales-trend">
                <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        salesTrendLoading ? (
                            <div className="h-[300px] flex justify-center items-center">
                                <LoadingState message="Loading sales trend data" />
                            </div>
                        ) : salesDataMetrics.length === 0 ? (
                            <div className="h-[300px] flex justify-center items-center">
                                <p>No data available</p>
                            </div>
                        ) : (

                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesDataMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="green" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="brown"
                                            strokeWidth={2}
                                            dot={{ fill: "hsl(var(--primary))" }}
                                        />
                                        <Legend />
                                        <Tooltip />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                </CardContent>
            </Card>

            <Card className="lg:col-span-3" data-testid="card-top-products">
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        topProductsLoading ? (
                            <div className="h-[500px] flex justify-center items-center">
                                <LoadingState message="Loading top selling products" />
                            </div>
                        ) : topProductMetrics.length === 0 ? (
                            <div className="h-[500px] flex justify-center items-center">
                                <p>No data available</p>
                            </div>
                        ) : (
                            <div className="h-[500px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topProductMetrics} layout="horizontal">
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="green"
                                        />
                                        <XAxis
                                            dataKey={"name"}
                                            type="category"
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            dataKey="sales"
                                            type="number"
                                            width={100}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="sales"
                                            stroke="green"
                                            fill="brown"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    );
}