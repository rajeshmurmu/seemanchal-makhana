import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: string;
    images: File[];
}

export interface ProductFormProps {
    initialData?: Partial<ProductFormData>;
    onSubmit: (data: ProductFormData) => void;
    onCancel?: () => void;
    submitLabel?: string;
}

export default function ProductForm({
    initialData,
    onSubmit,
    onCancel,
    submitLabel = "Save Product"
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        stock: initialData?.stock || "",
        category: initialData?.category || "",
        images: initialData?.images || [],
    });

    const [errors, setErrors] = useState<Partial<ProductFormData>>({});

    const categories = [
        "Electronics",
        "Accessories",
        "Clothing",
        "Books",
        "Home & Garden",
        "Sports",
        "Other"
    ];

    const handleInputChange = (field: keyof ProductFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
        console.log(`Added ${files.length} images`);
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        console.log(`Removed image at index ${index}`);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ProductFormData> = {};

        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.price.trim()) newErrors.price = "Price is required";
        if (formData.price && isNaN(Number(formData.price))) newErrors.price = "Price must be a number";
        if (!formData.stock.trim()) newErrors.stock = "Stock quantity is required";
        if (formData.stock && isNaN(Number(formData.stock))) newErrors.stock = "Stock must be a number";
        if (!formData.category) newErrors.category = "Category is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            console.log('Product form submitted:', formData);
        }
    };

    return (
        <Card data-testid="form-product">
            <CardHeader>
                <CardTitle>{initialData ? 'Edit Product' : 'Add New Product'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter product name"
                                data-testid="input-product-name"
                                className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive" data-testid="error-name">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger data-testid="select-category" className={errors.category ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-destructive" data-testid="error-category">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                placeholder="0.00"
                                data-testid="input-price"
                                className={errors.price ? "border-destructive" : ""}
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive" data-testid="error-price">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleInputChange('stock', e.target.value)}
                                placeholder="0"
                                data-testid="input-stock"
                                className={errors.stock ? "border-destructive" : ""}
                            />
                            {errors.stock && (
                                <p className="text-sm text-destructive" data-testid="error-stock">
                                    {errors.stock}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter product description"
                            rows={4}
                            data-testid="textarea-description"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Product Images</Label>
                        <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                                data-testid="input-images"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Click to upload images or drag and drop
                                </p>
                            </label>
                        </div>

                        {formData.images.length > 0 && (
                            <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                                {formData.images.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                                            <span className="text-xs text-muted-foreground text-center p-2">
                                                {file.name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            data-testid={`button-remove-image-${index}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
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
            </CardContent>
        </Card>
    );
}