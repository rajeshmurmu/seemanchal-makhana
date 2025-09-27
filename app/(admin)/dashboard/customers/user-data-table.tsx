/* eslint-disable @typescript-eslint/no-explicit-any */


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import React from 'react'
import { User } from './user-management'


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
                    users.map((user) => (
                        <TableRow key={user.email}>
                            {
                                columns.map((column) => (
                                    <TableCell key={user.name + column.label}>{column.render ? column.render(user[column.key as keyof User], user) : user[column.key as keyof User]}</TableCell>
                                ))
                            }

                        </TableRow>
                    ))
                }

            </TableBody>
        </Table>
    )
}
