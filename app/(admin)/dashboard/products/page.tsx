"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ProductForm from '../../components/product-form'
import ProductDataTable from './product-data-table'
import toast from 'react-hot-toast'
import { ProductFormData, ResponseProductType } from '@/types/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addNewCategory, addNewProduct, deleteProduct, getAllProducts, updateProduct } from '@/lib/client/product-api'
import { Input } from '@/components/ui/input'
import EditProductForm from '../../components/edit-product-form'



export default function AllProducts() {

    const queryClient = useQueryClient();
    const [products, setProducts] = useState<ResponseProductType[] | []>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ResponseProductType | null>(null);
    const [newCategory, setNewCategory] = useState<string>('');


    const { data: productData, isLoading: productIsLoading, error: productFetchError } = useQuery({
        queryKey: ['products'],
        queryFn: () => getAllProducts({})
    })

    const categoryMutation = useMutation({
        mutationFn: addNewCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] }) // refresh cache
        },
    })
    const handleAddCategory = () => {
        // api call to add new category
        categoryMutation.mutate({ category: newCategory });
        setIsCategoryModalOpen(false);
        setNewCategory('');

    }

    const addProductMutation = useMutation({
        mutationFn: addNewProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] }) // refresh cache
        },
    })

    const handleAddProduct = (productData: ProductFormData) => {
        // make api call to add product
        addProductMutation.mutate(productData);
        setIsAddModalOpen(false);
    };

    const updateProductMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] }) // refresh cache
        },
    })
    const handleEditProduct = (formData: ProductFormData) => {
        // make api call to update product
        updateProductMutation.mutate({ productId: editingProduct?._id, data: formData });
        setEditingProduct(null);
    };

    const deleteProductMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] }) // refresh cache
        },
    })

    const handleDeleteProduct = (productId: string) => {
        // make api call to delete product
        deleteProductMutation.mutate(productId);
    };

    useEffect(() => {
        // fetch and set products
        setProducts(productData?.products);
    }, [productData]);

    // handle the toast message
    useEffect(() => {
        if (addProductMutation.isSuccess) {
            toast.success(addProductMutation.data?.message || 'Product added successfully');
            addProductMutation.reset();
        }

        if (addProductMutation.isError) {
            toast.error(addProductMutation.error?.message || 'Error adding product');
            addProductMutation.reset();
        }

        if (categoryMutation.isSuccess) {
            toast.success(categoryMutation.data?.message || 'Category added successfully');
            categoryMutation.reset();
        }

        if (categoryMutation.isError) {
            toast.error(categoryMutation.error?.message || 'Error adding category');
            categoryMutation.reset();
        }

        if (deleteProductMutation.isError) {
            toast.error(deleteProductMutation.error?.message || 'Error deleting product');
            deleteProductMutation.reset();
        }

        if (deleteProductMutation.isSuccess) {
            toast.success(deleteProductMutation.data?.message || 'Product deleted successfully');
            deleteProductMutation.reset();
        }

    }, [addProductMutation, categoryMutation, deleteProductMutation]);


    if (productIsLoading) return (

        <div className='w-full h-full flex items-center justify-center'>
            <div className="loader flex flex-col items-center justify-center">
                <Loader2 className='animate-spin text-primary' size={50} />
                <p>Please wait while products are loading...</p>
            </div>
        </div>
    )


    if (productFetchError) return (
        <div className='text-red-500 w-full h-full flex items-center justify-center'>
            <p>{productFetchError?.message}</p>
        </div>
    )


    return (
        <div className="space-y-6" data-testid="page-products">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>

                <div className='flex items-center gap-x-4'>
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

                    {/* pop up for add category */}
                    <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" data-testid="button-add-category">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Category</DialogTitle>
                            </DialogHeader>
                            <div>
                                <Input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Enter category name"
                                />
                                <Button
                                    disabled={!newCategory || categoryMutation.isPending}
                                    onClick={handleAddCategory}
                                    className='mt-4'
                                >
                                    Add Category
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Products table */}
            <ProductDataTable
                products={products ?? []}
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
                        <EditProductForm
                            initialData={editingProduct}
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
