"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";

export default function DashboardSettings() {

    const { user } = useAuth()

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
                            <Button variant="outline" className="w-full" data-testid="button-export-products">
                                Export Products (CSV)
                            </Button>
                            <Button variant="outline" className="w-full" data-testid="button-export-orders">
                                Export Orders (CSV)
                            </Button>
                            <Button variant="outline" className="w-full" data-testid="button-export-customers">
                                Export Customers (CSV)
                            </Button>
                        </div>
                        <Separator />
                        <Button variant="outline" className="w-full" data-testid="button-backup-database">
                            Create Database Backup
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}