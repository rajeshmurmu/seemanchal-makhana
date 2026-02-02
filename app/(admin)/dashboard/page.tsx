"use client"
import React from 'react'
import DashboardMetrics from './dashboard-metrics'
import AnalyticsCharts from './analytics-charts'
import useDashboardData from '@/hooks/use-dashboard-data'

export default function AdminDashboard() {
    const { metrics, salesDataMetrics, topProductMetrics, loadingDashboardData, metricsLoading } = useDashboardData();
    return (
        <div className="space-y-6" data-testid="page-dashboard">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your e-commerce admin dashboard</p>
            </div>
            <DashboardMetrics
                metrics={
                    metrics ? metrics : {
                        orders: 0, users: 0, products: 0, revenue: 0
                    }
                }
                isLoading={loadingDashboardData}
                metricsIsLoading={metricsLoading}
            />
            <AnalyticsCharts
                salesData={salesDataMetrics}
                topProducts={topProductMetrics}
                isLoading={loadingDashboardData}
            />
        </div>
    )
}
