import z from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  line1: z.string().min(1, { message: "Address line 1 is required" }),
  line2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

export type AddressSchema = z.infer<typeof addressSchema>;
