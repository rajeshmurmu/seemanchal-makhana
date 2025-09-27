"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import UserDataTable from './user-data-table';
import { Eye, Search, Shield, UserCheck, UserMinus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface User {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    status: "active" | "inactive" | "banned";
    role: "customer" | "admin";
    totalOrders: number;
    totalSpent: number;
}

const dbUsers: User[] = [
    //todo: remove mock functionality
    {
        id: "USR-001",
        name: "John Doe",
        email: "john.doe@example.com",
        joinDate: "2023-06-15",
        status: "active",
        role: "customer",
        totalOrders: 12,
        totalSpent: 1299.87,
    },
    {
        id: "USR-002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        joinDate: "2023-08-22",
        status: "active",
        role: "customer",
        totalOrders: 8,
        totalSpent: 764.32,
    },
    {
        id: "USR-003",
        name: "Bob Wilson",
        email: "bob.wilson@example.com",
        joinDate: "2023-11-10",
        status: "inactive",
        role: "customer",
        totalOrders: 3,
        totalSpent: 189.97,
    },
    {
        id: "USR-004",
        name: "Admin User",
        email: "admin@example.com",
        joinDate: "2023-01-01",
        status: "active",
        role: "admin",
        totalOrders: 0,
        totalSpent: 0,
    },
]

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const updateUserStatus = (userId: string, newStatus: User["status"]) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            )
        );
        console.log(`User ${userId} status updated to ${newStatus}`);
    };

    const statusColors = {
        active: "default",
        inactive: "secondary",
        banned: "destructive",
    } as const;

    const roleColors = {
        customer: "secondary",
        admin: "default",
    } as const;

    const columns = [
        { key: "id" as keyof User, label: "User ID" },
        {
            key: "name" as keyof User,
            label: "Name"
        },
        {
            key: "email" as keyof User,
            label: "Email"
        },
        {
            key: "role" as keyof User,
            label: "Role",
            render: (value: User["role"]) => (
                <Badge variant={roleColors[value]} className="flex items-center gap-1 w-fit">
                    {value === "admin" && <Shield className="h-3 w-3" />}
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
            )
        },
        {
            key: "status" as keyof User,
            label: "Status",
            render: (value: User["status"]) => (
                <Badge variant={statusColors[value]}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
            )
        },
        {
            key: "totalOrders" as keyof User,
            label: "Orders",
        },
        {
            key: "totalSpent" as keyof User,
            label: "Total Spent",
            render: (value: number) => `$${value.toFixed(2)}`
        },
        {
            key: "joinDate" as keyof User,
            label: "Join Date"
        },
        {
            key: "id" as keyof User,
            label: "Actions",
            render: (value: string, user: User) => (
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-view-user-${value}`}
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
                                        <p><strong>Name:</strong> {user.name}</p>
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <p><strong>User ID:</strong> {user.id}</p>
                                        <p><strong>Join Date:</strong> {user.joinDate}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Account Details</h4>
                                        <p><strong>Role:</strong> {user.role}</p>
                                        <p><strong>Status:</strong> {user.status}</p>
                                        <p><strong>Total Orders:</strong> {user.totalOrders}</p>
                                        <p><strong>Total Spent:</strong> ${user.totalSpent.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Recent Orders</h4>
                                    <div className="text-sm text-muted-foreground">
                                        No recent orders to display
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {user.role !== "admin" && (
                        <>
                            {user.status === "active" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateUserStatus(user.id, "inactive")}
                                    data-testid={`button-deactivate-user-${value}`}
                                >
                                    <UserMinus className="h-4 w-4" />
                                </Button>
                            )}

                            {user.status === "inactive" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateUserStatus(user.id, "active")}
                                    data-testid={`button-activate-user-${value}`}
                                >
                                    <UserCheck className="h-4 w-4" />
                                </Button>
                            )}


                        </>
                    )}
                </div>
            )
        }
    ];


    useEffect(() => {
        setUsers(dbUsers)
    }, [])
    return (
        <Card data-testid="card-user-management">
            <CardHeader>
                <CardTitle className='text-3xl'>User Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={"Search users..."}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                            data-testid="input-search"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Show:</span>
                        <Select value={String(itemsPerPage)} onValueChange={(value: string) => setItemsPerPage(Number(value))}>
                            <SelectTrigger className="w-20" data-testid="select-items-per-page">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="my-8 border rounded-md">
                    <UserDataTable users={users} columns={columns} />
                </div>
            </CardContent>
        </Card>
    )
}
