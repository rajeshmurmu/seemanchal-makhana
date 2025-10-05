/* eslint-disable @typescript-eslint/no-explicit-any */


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { Badge } from '@/components/ui/badge';
import OrderDetails from './order-details';


interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

interface OrderDataTableProps<T> {
    orders: T[];
    columns: Column<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    onRowClick?: (row: T) => void;
    className?: string;
    testId?: string;
}

export default function OrderDataTable<T extends Record<string, any>>({ orders, columns }: OrderDataTableProps<T>) {

    return (
        <Table className='mt-4 w-full'>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead key={column.key as string} className={column.key as string}>{column.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                </TableRow>

            </TableHeader>
            <TableBody>
                {
                    orders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell>
                                {order?.clientOrderId || order._id}
                            </TableCell>
                            <TableCell>
                                {order?.user?.name}
                            </TableCell>
                            <TableCell>
                                {order?.items?.length || 0}
                            </TableCell>
                            <TableCell>
                                {order?.orderStatus === "delivered" ? <Badge className='bg-green-500 text-white'>Delivered</Badge> : order?.orderStatus === "cancelled" ? <Badge className='bg-red-500 text-white'>Cancelled</Badge> : <Badge className='bg-yellow-500 text-white'>{order?.orderStatus}</Badge>}
                            </TableCell>
                            <TableCell>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {order?.paymentMethod === "cod" ? <Badge className='bg-green-500 text-white'>COD</Badge> : <Badge className='bg-blue-500 text-white'>Online</Badge>}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <OrderDetails order={order} setSelectedOrder={() => { }} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }

            </TableBody>
        </Table>
    )
}
