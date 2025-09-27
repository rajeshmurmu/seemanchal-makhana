import React from 'react'
import UserManagement from './user-management'

export default function page() {
    return (
        <div className="space-y-6" data-testid="page-customers">
            <div>
                <h1 className="text-3xl font-bold">Customers</h1>
                <p className="text-muted-foreground">Manage customer accounts and information</p>
            </div>
            <UserManagement />
        </div>
    )
}
