import { HeroSection } from "@/components/hero-section";
import { FeaturedProducts } from "@/components/products/featured-products";
import { Products } from "@/components/products/products";
import { CustomerReviewsSection } from "@/components/customer-reviews-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* All Products */}
      <Products />
      {/* Featured Products */}
      <FeaturedProducts />
      <CustomerReviewsSection />
    </>
  );
}
