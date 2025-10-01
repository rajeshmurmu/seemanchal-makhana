import type { Review } from "../types/types";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Makhana",
    description:
      "Authentic puffed makhna with aromatic fragrance. Perfect for spicy and traditional dishes.",
    price: 299,
    originalPrice: 399,
    image: "/premium-makhana-bag.jpeg",
    category: "Makhana",
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Seemanchal Makhana",
    description:
      "Pure organic turmeric powder with high curcumin content. Essential for healthy cooking.",
    price: 149,
    originalPrice: 199,
    image: "/seemanchal-makhana-bag.jpeg",
    category: "Spices",
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Traditional makhana",
    description:
      "Pure cow ghee made using traditional methods. Rich in flavor and nutrients.",
    price: 599,
    originalPrice: 699,
    image: "/traditional-makhana-bag.jpeg",
    category: "Traditional",
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Mixed Makhana",
    description:
      "Homestyle mixed Makhana made with authentic spices. Perfect accompaniment for meals.",
    price: 199,
    image: "/traditional-makhana-bag.jpeg",
    category: "Mixed",
    rating: 4.6,
    reviewCount: 124,
    inStock: true,
  },
  {
    id: "5",
    name: "Namkeen Makhana",
    description:
      "Salty Namkeen Makhana made with authentic spices. Perfect accompaniment for meals.",
    price: 89,
    originalPrice: 109,
    image: "/seemanchal-makhana-bag.jpeg",
    category: "Namkeen",
    rating: 4.5,
    reviewCount: 67,
    inStock: true,
  },
  {
    id: "6",
    name: "Spicy Makhana",
    description:
      "Aromatic blend of traditional spices. Essential for authentic Indian cooking.",
    price: 129,
    image: "/premium-makhana-bag.jpeg",
    category: "Spices",
    rating: 4.8,
    reviewCount: 145,
    inStock: true,
    featured: true,
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userName: "Priya Sharma",
    rating: 5,
    comment:
      "Excellent quality basmati rice! The aroma is amazing and it cooks perfectly every time.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    productId: "1",
    userName: "Rajesh Kumar",
    rating: 4,
    comment:
      "Good quality rice, though a bit pricey. But worth it for special occasions.",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: "3",
    productId: "2",
    userName: "Meera Patel",
    rating: 5,
    comment:
      "Pure and organic turmeric. The color and quality is excellent. Highly recommended!",
    date: "2024-01-12",
    verified: true,
  },
];

export const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
