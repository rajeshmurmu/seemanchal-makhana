

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import React from 'react'
import { Product } from './page'
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';


interface Iprops {
    products: Product[],
    setEditingProduct: (product: Product) => void,
    handleDeleteProduct: (id: number | string) => void
}


export default function ProductDataTable({ products, setEditingProduct, handleDeleteProduct }: Iprops) {
    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Product Name' },
        { key: 'price', label: 'Price' },
        { key: 'stock', label: 'Stock' },
        { key: 'category', label: 'Category' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <div className='border rounded-md'>
            <Table className='mt-4 w-full' >
                <TableHeader>
                    <TableRow>
                        {columns.map((column: { key: string, label: string }) => (
                            <TableHead key={column.key}>{column.label}</TableHead>
                        ))}
                        <TableHead>Actions</TableHead>
                    </TableRow>

                </TableHeader>
                <TableBody>
                    {
                        products.map((product: Product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.status}</TableCell>
                                <TableCell>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingProduct(product)}
                                            data-testid={`button-edit-product-${product.name}`}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteProduct(product.id)}
                                            data-testid={`button-delete-product-${product.name}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }

                </TableBody>
            </Table>
        </div>

    )
}
