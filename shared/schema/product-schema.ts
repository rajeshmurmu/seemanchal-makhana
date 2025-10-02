import z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const productSchema = z.object({
  name: z.string().min(5),
  description: z.string().min(10),
  price: z.coerce.number().int().positive(),
  originalPrice: z.coerce.number().int().positive(),
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
    )
    .max(5, "You can upload a maximum of 5 images.") // Example: limit to 5 images
    .optional(), // Optional field
  category: z.string(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
});
