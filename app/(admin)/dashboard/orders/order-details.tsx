/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderType } from '@/models/order.model'
import { ProductType } from '@/models/product.model'
import { Eye } from 'lucide-react'
import React from 'react'

interface IOrderDetailsProps<T> {
    order: T | OrderType;
    setSelectedOrder: React.Dispatch<React.SetStateAction<any>>;
}

export default function OrderDetails<T extends Record<string, any>>({ order, setSelectedOrder }: IOrderDetailsProps<T>) {
    console.log({
        order
    })
    const [orderStatus, setOrderStatus] = React.useState<OrderType["orderStatus"]>(order.orderStatus);

    const updateOrderStatus = (orderId: string, newStatus: OrderType["orderStatus"]) => {
        console.log(`Order ${orderId} status updated to ${newStatus}`);
        setOrderStatus(newStatus);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-fit">
                <DialogHeader>
                    <DialogTitle>Order Details - {order?.clientOrderId}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-96 rounded-md p-4 border">
                    <div className="space-y-6">
                        <div className="">
                            <div>
                                <h4 className="font-semibold">Customer Information</h4>
                                <p><strong>Name:</strong> {order?.user?.name}</p>
                                <p><strong>Email:</strong> {order.user?.email}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mt-4">Order Information</h4>
                                <p><strong>Order ID:</strong> {order.clientOrderId}</p>
                                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p><strong>Payment Method:</strong> {order?.paymentMethod?.charAt(0).toUpperCase() + order?.paymentMethod?.slice(1)}</p>
                                <p>{order?.paymentMethod === "razorpay" && <><strong>RazorPay Payment ID:</strong> {order?.razorpayPaymentId}</> || ""}</p>
                                <p><strong>Payment Status:</strong> {order?.status?.toUpperCase()}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            <div className="space-y-2">
                                {order.items.map((item: OrderType["items"][0]) => {
                                    const productName = item.productId && typeof item.productId === 'object' && 'name' in item.productId
                                        ? (item.productId as any).name
                                        : String(item.productId);
                                    return (
                                        <div key={item._id as unknown as string} className="flex justify-between items-center p-2 bg-muted rounded">
                                            <div>
                                                <p className="font-medium">{productName}</p>
                                                <p className="text-sm text-muted-foreground">Quantity: {item.qty}</p>
                                            </div>
                                            <p className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</p>
                                        </div>
                                    )
                                })}

                                <div className="flex justify-between items-center p-2 bg-primary/10 rounded font-semibold">
                                    <span>Sub Total:</span>
                                    <span>
                                        ₹{order.items.reduce((total: number, item: ProductType) => total + item.price * item.qty, 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-primary/10 rounded font-semibold">
                                    <span>Delivery Charges:</span>
                                    <span>
                                        ₹{(order.status === "paid" ? order.amount.toFixed(2) / 100 : order.amount) - (order.items.reduce((total: number, item: ProductType) => total + item.price * item.qty, 0).toFixed(2))}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-primary/10 rounded font-semibold">
                                    <span>Total:</span>
                                    <span>
                                        ₹{order.status === "paid" ? order.amount.toFixed(2) / 100 : order.amount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Delivery Address</h4>
                            <div className="text-sm text-muted-foreground">
                                <div key={order.deliveryAddress._id} className="mb-2 p-2 border rounded">
                                    <p>
                                        <strong>Address Line 1: </strong>
                                        {order.deliveryAddress.line1}
                                    </p>
                                    <p>
                                        <strong>Address Line 2: </strong>
                                        {order.deliveryAddress.line2}
                                    </p>
                                    <p>
                                        <strong>City: </strong>
                                        {order.deliveryAddress.city}
                                    </p>
                                    <p>
                                        <strong>State: </strong>
                                        {order.deliveryAddress.state}
                                    </p>
                                    <p>
                                        <strong>Pincode: </strong>
                                        {order.deliveryAddress.postalCode}
                                    </p>
                                    <p>
                                        <strong>Country: </strong>
                                        {order.deliveryAddress.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Update Status</h4>
                            <Select
                                value={orderStatus}
                                onValueChange={(value: OrderType["orderStatus"]) => updateOrderStatus(order._id, value)}
                            >
                                <SelectTrigger data-testid="select-order-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>

    )
}
