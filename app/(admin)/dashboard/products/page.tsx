"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ProductForm, { ProductFormData } from '../../components/product-form'
import ProductDataTable from './product-data-table'




export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    status: "active" | "inactive";
}

const fetchProducts: Product[] = [
    //todo: remove mock functionality
    { id: "1", name: "Wireless Headphones", price: 99.99, stock: 45, category: "Electronics", status: "active" },
    { id: "2", name: "Smartphone Case", price: 29.99, stock: 120, category: "Accessories", status: "active" },
    { id: "3", name: "Laptop Stand", price: 79.99, stock: 0, category: "Electronics", status: "inactive" },
    { id: "4", name: "USB Cable", price: 14.99, stock: 200, category: "Accessories", status: "active" },
    { id: "5", name: "Power Bank", price: 49.99, stock: 33, category: "Electronics", status: "active" },
]

export default function AllProducts() {

    const [products, setProducts] = useState<Product[]>([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleAddProduct = (formData: ProductFormData) => {
        const newProduct: Product = {
            id: Date.now().toString(),
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            status: "active",
        };
        setProducts(prev => [newProduct, ...(prev ?? [])]);
        setIsAddModalOpen(false);
        console.log('Product added:', newProduct);
    };

    const handleEditProduct = (formData: ProductFormData) => {
        if (editingProduct) {
            const updatedProduct: Product = {
                ...editingProduct,
                name: formData.name,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category: formData.category,
            };
            setProducts(prev =>
                (prev ?? []).map(p => p.id === editingProduct.id ? updatedProduct : p)
            );
            setEditingProduct(null);
            console.log('Product updated:', updatedProduct);
        }
    };

    const handleDeleteProduct = (productId: string | number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        console.log('Product deleted:', productId);
    };

    useEffect(() => {
        setProducts(fetchProducts);
    }, []);


    return (
        <div className="space-y-6" data-testid="page-products">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>

                {/* pop up for add product */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button data-testid="button-add-product">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <ProductForm
                            onSubmit={handleAddProduct}
                            onCancel={() => setIsAddModalOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Products table */}
            <ProductDataTable
                products={products}
                setEditingProduct={setEditingProduct}
                handleDeleteProduct={handleDeleteProduct}
            />

            {/* popup for edit product */}
            <Dialog open={editingProduct !== null} onOpenChange={(open) => !open && setEditingProduct(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                        <ProductForm
                            initialData={{
                                name: editingProduct.name,
                                price: editingProduct.price.toString(),
                                stock: editingProduct.stock.toString(),
                                category: editingProduct.category,
                                description: "",
                                images: [],
                            }}
                            onSubmit={handleEditProduct}
                            onCancel={() => setEditingProduct(null)}
                            submitLabel="Update Product"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
