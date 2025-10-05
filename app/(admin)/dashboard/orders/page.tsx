import React from 'react'
import OrderManagement from './order-management'

export default function page() {
    return (
        <div className="space-y-6" data-testid="page-customers">
            <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground">Manage orders and information</p>
            </div>
            <OrderManagement />
        </div>
    )
}
