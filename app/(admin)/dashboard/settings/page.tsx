"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth-context";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { getAllProducts } from "@/lib/client/product-api";
import { fetchAllOrders } from "@/lib/client/order-api";
import { fetchAllUsers } from "@/lib/client/user-api";
import { OrderType } from "@/models/order.model";
import { useState } from "react";
import { ProductType } from "@/models/product.model";
import { UserType } from "@/models/user.model";

export default function DashboardSettings() {

    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false);


    async function exportToCSV(filename = "data-export.csv", type: "products" | "orders" | "customers") {
        try {
            toast.dismissAll();
            setIsLoading(true);
            toast.success("Preparing data for export...");
            let data;
            if (type === "products") {
                const fetchedData = await getAllProducts({});
                data = fetchedData.products.map((product: ProductType) => ({
                    id: product._id,
                    name: product.name,
                    seelingPrice: product.price,
                    originalPrice: product.originalPrice,
                    category: product.category || "N/A",
                    inStock: product.inStock,
                    featured: product.featured,
                    createdAt: new Date(product.createdAt).toString(),
                }))
            }

            if (type === "orders") {
                const fetchedData = await fetchAllOrders();

                data = fetchedData.orders.map((order: OrderType) => ({
                    id: order._id,
                    customerName: order.user?.name || "N/A",
                    customerEmail: order.user?.email || "N/A",
                    numberOfItems: order.items.length,
                    totalAmount: order.amount,
                    paymentStatus: order.status,
                    orderStatus: order.orderStatus,
                    paymentMethod: order.paymentMethod,
                    deliveryAddress: `${order.deliveryAddress?.city || ""}, ${order.deliveryAddress?.state || ""}, ${order.deliveryAddress?.postalCode || ""}, ${order.deliveryAddress?.country || ""}`,
                    createdAt: new Date(order.createdAt).toString(),
                }));
            }

            if (type === "customers") {
                const fetchedData = await fetchAllUsers();
                data = fetchedData.users.map((user: UserType) => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.address[0]?.phoneNumber || "N/A",
                    role: user.role,
                    totalOrders: user.orders ? user.orders.length : 0,
                    createdAt: new Date(user.createdAt).toString(),
                }));
            }

            if (!data) {
                toast.error("Invalid data type for export");
                setIsLoading(false)
                return;
            }

            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, filename);
            setIsLoading(false);
            toast.success("Data exported successfully!");
        } catch (error) {
            console.error("Error exporting data:", error);
            toast.error("Failed to export data");
            setIsLoading(false);

        }

    }

    return (
        <div className="space-y-6" data-testid="page-settings">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Configure your admin dashboard preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="site-name">Site Name</Label>
                            <Input id="site-name" placeholder="Enter site name" readOnly defaultValue="Seemanchal Makhana" data-testid="input-site-name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-email">Admin Email</Label>
                            <Input id="admin-email" type="email" placeholder="admin@example.com" readOnly defaultValue={user?.email || ""} data-testid="input-admin-email" />
                        </div>
                        {/* <Button>Save Changes</Button> */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <Switch id="email-notifications" data-testid="switch-email-notifications" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="order-alerts">Order Alerts</Label>
                            <Switch id="order-alerts" defaultChecked data-testid="switch-order-alerts" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="inventory-alerts">Low Inventory Alerts</Label>
                            <Switch id="inventory-alerts" defaultChecked data-testid="switch-inventory-alerts" />
                        </div>
                        <Button data-testid="button-save-notifications">Save Preferences</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" data-testid="input-current-password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" data-testid="input-new-password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" data-testid="input-confirm-password" />
                        </div>
                        <Button data-testid="button-update-password">Update Password</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Export & Backup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground mb-4">
                            Export your data for backup or analysis purposes
                        </div>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                data-testid="button-export-products"
                                onClick={() => {
                                    exportToCSV("products.csv", "products");
                                }}
                                disabled={!!isLoading}
                            >
                                Export Products (CSV)
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                data-testid="button-export-orders"
                                onClick={() => {
                                    exportToCSV("orders.csv", "orders");
                                }}
                                disabled={!!isLoading}
                            >
                                Export Orders (CSV)
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                data-testid="button-export-customers"
                                onClick={() => {
                                    exportToCSV("customers.csv", "customers");
                                }}
                                disabled={!!isLoading}
                            >
                                Export Customers (CSV)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}