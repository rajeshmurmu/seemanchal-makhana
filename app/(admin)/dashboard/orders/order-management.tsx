"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import { Search, } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingState from '../../components/loading-state';
import OrderDataTable from './order-data-table';
import { fetchAllOrders } from '@/lib/client/order-api';

import { OrderType } from '@/models/order.model';


export default function OrderManagement() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['users'],
        queryFn: fetchAllOrders,
    })

    useEffect(() => {
        if (data) {
            setOrders(data?.orders || []);
        }
    }, [data])

    // handle user fectch error
    useEffect(() => {
        if (isError && error) {
            toast.error(error.message || "Failed to fetch orders");

        }

    }, [isError, error])



    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const columns = [
        { key: "_id" as keyof OrderType, label: "Order ID" },
        {
            key: "customer" as keyof OrderType,
            label: "Customer"
        },
        {
            key: "total" as keyof OrderType,
            label: "Total"
        },
        {
            key: "status" as keyof OrderType,
            label: "Status",
        },
        {
            key: "orderDate" as keyof OrderType,
            label: "Order Date"
        },
        {
            key: "paymentMethod" as keyof OrderType,
            label: "Payment Method"
        },

    ];

    if (isLoading) {
        return <LoadingState message="Please wait while loading orders" />;
    }

    return (
        <Card data-testid="card-user-management">
            <CardHeader>
                <CardTitle className='text-3xl'>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={"Search orders..."}
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
                    <OrderDataTable orders={orders} columns={columns} />
                </div>
            </CardContent>
        </Card>
    )
}
