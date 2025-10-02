import z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  );

// Define the schema for an array of image file objects.
const arrayOfFilesSchema = z
  .array(imageFileSchema)
  .min(1, "At least one image is required.")
  .max(5, "You can upload a maximum of 5 images.");

// Define the schema for an array of strings (e.g., URLs).
const arrayOfStringsSchema = z
  .array(z.string())
  .min(1, "At least one image is required.")
  .max(5, "You can upload a maximum of 5 images.");

// Combine the two array schemas into a union.
const imagesSchema = z
  .union([arrayOfFilesSchema, arrayOfStringsSchema])
  .optional(); // The entire field is optional.

export const productSchema = z.object({
  name: z.string().min(5),
  description: z.string().min(10),
  price: z.coerce.number().int().positive(),
  originalPrice: z.coerce.number().int().positive(),
  images: imagesSchema,
  category: z.string(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
});
