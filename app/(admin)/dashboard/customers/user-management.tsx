"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import UserDataTable from './user-data-table';
import { Search, } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { fetchAllUsers } from '@/lib/client/user-api';
import toast from 'react-hot-toast';
import LoadingState from '../../components/loading-state';

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


export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['users'],
        queryFn: fetchAllUsers,
    })

    useEffect(() => {
        if (data) {
            setUsers(data?.users)
        }
    }, [data])

    // handle user fectch error
    useEffect(() => {
        if (isError && error) {
            toast.error(error.message || "Failed to fetch users");
        }

    }, [isError, error])



    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const columns = [
        { key: "_id" as keyof User, label: "User ID" },
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
        },
        {
            key: "status" as keyof User,
            label: "Status",
        },
        {
            key: "totalOrders" as keyof User,
            label: "Orders",
        },
        {
            key: "totalSpent" as keyof User,
            label: "Total Spent",
        },
        {
            key: "joinDate" as keyof User,
            label: "Join Date"
        },
        {
            key: "id" as keyof User,
            label: "Actions"
        }
    ];

    if (isLoading) {
        return <LoadingState message="Please wait while loading users" />;
    }

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
