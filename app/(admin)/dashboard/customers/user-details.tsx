import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { OrderType } from '@/models/order.model';
import { UserType } from '@/models/user.model';
import { Eye, UserCheck, UserMinus } from 'lucide-react'
import React from 'react'

interface UserDetailsProps<T> {
    user: T | UserType;
    updateUserStatus: (userId: string, newStatus: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserDetails<T extends Record<string, any>>({ user, updateUserStatus }: UserDetailsProps<T>) {
    return (
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-user-details">
                    <DialogHeader>
                        <DialogTitle>User Details - {user.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="font-semibold mb-2">Personal Information</h4>
                                <p><strong>Name: </strong> {user.name}</p>
                                <p><strong>Email: </strong> {user.email}</p>
                                <p><strong>User ID: </strong> {user._id}</p>
                                <p><strong>Join Date: </strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Account Details</h4>
                                <p><strong>Role: </strong> {user.role}</p>
                                <p><strong>Status: </strong>Active</p>
                                <p><strong>Total Orders: </strong> {user?.orders?.length}</p>
                                <p><strong>Total Spent: </strong> ₹{user.orders.reduce((total: number, order: OrderType) => total + order?.amount, 0) / 100}</p>
                            </div>
                        </div>

                        {user.orders.length > 0 ? (
                            <div>
                                <h4 className="font-semibold mb-2">Recent Orders</h4>
                                <div className="text-sm text-muted-foreground">
                                    {user.orders.map((order: OrderType) => (
                                        <div key={order._id} className="mb-2 p-2 border rounded">
                                            <p><strong>Order ID:</strong> {order._id}</p>
                                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p><strong>Amount:</strong> ₹{(order.amount / 100).toFixed(2)}</p>
                                            <p><strong>Status:</strong> {order.status}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h4 className="font-semibold mb-2">Recent Orders</h4>
                                <div className="text-sm text-muted-foreground">
                                    No recent orders to display
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* The below code is for updating user status, only if the user is not an admin this will be fix later */}
            {user.role !== "admin" && (
                <>
                    {user.email === "active" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateUserStatus(user._id, "inactive")}
                        >
                            <UserMinus className="h-4 w-4" />
                        </Button>
                    )}

                    {user.email === "inactive" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateUserStatus(user._id, "active")}
                        >
                            <UserCheck className="h-4 w-4" />
                        </Button>
                    )}


                </>
            )}
        </div>
    )
}
