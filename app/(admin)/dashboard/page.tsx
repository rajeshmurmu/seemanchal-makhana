import React from 'react'
import DashboardMetrics from './dashboard-metrics'

export default function page() {
    return (
        <div className="space-y-6" data-testid="page-dashboard">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your e-commerce admin dashboard</p>
            </div>
            <DashboardMetrics />
            {/* <AnalyticsCharts /> */}
        </div>
    )
}
