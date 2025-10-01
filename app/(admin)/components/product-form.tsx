
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/shared/schema/product-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Category, ProductFormData, ProductWithAdditionalFields } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/lib/client/product-api";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import Image from "next/image";



export interface ProductFormProps {
    initialData?: Partial<ProductFormData | ProductWithAdditionalFields>;
    onCancel?: () => void;
    submitLabel?: string;
    onSubmit: (data: ProductFormData) => void;
}

export default function ProductForm({
    initialData,
    onSubmit,
    onCancel,
    submitLabel = "Save Product"
}: ProductFormProps) {

    const { data: fetchedCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories,
    })

    const formData = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: Number(initialData?.price) || 0,
            originalPrice: Number(initialData?.originalPrice) || 0,
            category: initialData?.category || "",
            images: initialData?.images || [],
            inStock: initialData?.inStock || false,
            featured: initialData?.featured || false
        }
    })

    const productImages = formData.watch("images");

    const categories: Category[] = fetchedCategories?.categories || []

    const handleSubmit = (data: ProductFormData) => {

        // handle product submission
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("originalPrice", data.originalPrice.toString());
        formData.append("category", data.category);
        formData.append("inStock", data?.inStock ? "true" : "false");
        formData.append("featured", data?.featured ? "true" : "false");

        //append multiple images
        data?.images?.forEach((file) => {
            formData.append("images", file);
        });

        onSubmit(formData as unknown as ProductFormData);
    };

    useEffect(() => {
        return () => {
            productImages?.forEach((file) => URL.revokeObjectURL(file as unknown as string));
        };
    }, [productImages]);


    return (
        <Card data-testid="form-product">
            <CardHeader>
                <CardTitle>{initialData ? 'Edit Product' : 'Add New Product'}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...formData} >

                    <form onSubmit={formData.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">

                                <FormField
                                    control={formData.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter product name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">
                                <FormField
                                    control={formData.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.length > 0 ? categories?.map(category => (
                                                            <SelectItem key={category._id} value={category.name}>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</SelectItem>
                                                        )) : (
                                                            <SelectItem value="default">Default</SelectItem>
                                                        )}

                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">

                                <FormField
                                    control={formData.control}
                                    name="originalPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Original Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter original price"
                                                    {...field}
                                                    value={field.value !== undefined ? String(field.value) : ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">

                                <FormField
                                    control={formData.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Selling Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter selling price"
                                                    {...field}
                                                    value={field.value !== undefined ? String(field.value) : ""}

                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-x-4 space-y-2">
                            <div className="mb-0">
                                <FormField
                                    control={formData.control}
                                    name="inStock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-x-2">
                                                <FormLabel>Stock Availability</FormLabel>
                                                <FormControl>
                                                    <Checkbox
                                                        className="border border-primary"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <FormField
                                    control={formData.control}
                                    name="featured"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-x-2">
                                                <FormLabel>Featured</FormLabel>
                                                <FormControl>
                                                    <Checkbox
                                                        className="border border-primary"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FormField
                                control={formData.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Description</FormLabel>
                                        <FormControl>
                                            <Textarea rows={4} placeholder="Enter product description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        {/* handle the product images */}
                        <div className="space-y-2">
                            {/* show the selected images */}
                            {productImages && productImages?.length as number > 0 ? (
                                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                                    {(productImages as File[]).map((file, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                                                {/* <span className="text-xs text-muted-foreground text-center p-2">
                                                    {file.name}
                                                </span> */}
                                                <Image
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                    width={500}
                                                    height={500}
                                                />

                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // remove the image
                                                    formData.setValue("images", (formData.getValues("images") ?? []).filter((_, i) => i !== index))
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                data-testid={`button-remove-image-${index}`}
                                            >
                                                <X className="text-white h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* add one functionality */}
                                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-border">
                                        <FormField
                                            control={formData.control}
                                            name="images"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            multiple={false}
                                                            accept="image/*"
                                                            className="hidden"
                                                            id="image-upload-single"
                                                            onChange={(e) => {
                                                                const images = formData.getValues("images") as File[];
                                                                images?.push(e.target.files?.[0] as File);
                                                                field.onChange(images);

                                                            }}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <label htmlFor="image-upload-single" className="cursor-pointer w-full h-full flex items-center justify-center">
                                            <Plus className="text-muted-foreground h-6 w-6" />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                // else show the upload form
                                <div className="space-y-2">
                                    <FormLabel>Upload Product Images</FormLabel>
                                    <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                                        <FormField
                                            control={formData.control}
                                            name="images"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            multiple={true}
                                                            accept="image/*"
                                                            className="hidden"
                                                            id="image-upload"
                                                            onChange={(e) => {
                                                                const files = Array.from(e.target.files || []);
                                                                field.onChange(files);

                                                            }}
                                                        />
                                                    </FormControl>
                                                    <label htmlFor="image-upload" className="cursor-pointer">
                                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground">
                                                            Click to upload images or drag and drop
                                                        </p>
                                                    </label>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            {onCancel && (
                                <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" data-testid="button-submit">
                                {submitLabel}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}