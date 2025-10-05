/* eslint-disable @typescript-eslint/no-explicit-any */


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { BadgeCheck, Trash2 } from 'lucide-react';
import UserDetails from './user-details';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserById } from '@/lib/client/user-api';
import toast from 'react-hot-toast';


interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

interface UserDataTableProps<T> {
    users: T[];
    columns: Column<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    onRowClick?: (row: T) => void;
    className?: string;
    testId?: string;
}

export default function UserDataTable<T extends Record<string, any>>({ users, columns }
    : UserDataTableProps<T>) {
    const queryClient = useQueryClient();
    const { mutate, error, isError, isPending } = useMutation({
        mutationFn: deleteUserById,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }

    })

    useEffect(() => {
        if (isError) {
            console.error("Error deleting user:", error);
            toast.error(error.message || "Failed to delete user");
        }
    }, [isError, error]);


    return (
        <Table className='mt-4 w-full'>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead key={column.label} className={column.key as string}>{column.label}</TableHead>
                    ))}
                </TableRow>

            </TableHeader>
            <TableBody>
                {
                    users?.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>
                                {user._id}
                            </TableCell>
                            <TableCell>
                                {user.name}
                            </TableCell>
                            <TableCell>
                                {user.email}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary"> {user.role === 'admin' && <BadgeCheck />}{user.role.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell>
                                {user.status || 'active'}
                            </TableCell>
                            <TableCell>
                                {user.orders?.length || 0}
                            </TableCell>
                            <TableCell>
                                ₹ {user.orders?.reduce((acc: number, order: any) => acc + order.amount, 0) / 100 || 0}
                            </TableCell>
                            <TableCell>
                                {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <UserDetails
                                        user={user} updateUserStatus={() => { }} />
                                    <Button
                                        disabled={isPending}
                                        onClick={() => mutate({ id: user._id })}
                                        variant={"destructive"} ><Trash2 /></Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }

            </TableBody>
        </Table>
    )
}
