

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import React from 'react'

import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ResponseProductType } from '@/types/types';
import { Badge } from '@/components/ui/badge';


interface Iprops {
    products: ResponseProductType[],
    setEditingProduct: (product: ResponseProductType) => void,
    handleDeleteProduct: (id: | string) => void
}


export default function ProductDataTable({ products, setEditingProduct, handleDeleteProduct }: Iprops) {
    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Product Name' },
        { key: 'originalPrice', label: 'Original Price' },
        { key: 'sellingPrice', label: 'Selling Price' },
        { key: 'stock', label: 'Stock' },
        { key: 'category', label: 'Category' },
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
                        products && products?.map((product) => (
                            <TableRow key={product?._id}>
                                <TableCell>{product?._id}</TableCell>
                                <TableCell>{product?.name}</TableCell>
                                <TableCell>{product?.originalPrice}</TableCell>
                                <TableCell>{product?.price}</TableCell>
                                <TableCell>{product?.inStock ?
                                    <Badge
                                        className='bg-green-600 text-white' variant={"outline"}>Available
                                    </Badge> :
                                    <Badge className='text-white' variant={"destructive"}>
                                        Out of Stock
                                    </Badge>}
                                </TableCell>
                                <TableCell>{product?.category}</TableCell>
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
                                            onClick={() => handleDeleteProduct(product._id)}
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
