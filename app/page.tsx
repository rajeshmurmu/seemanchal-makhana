import { HeroSection } from "@/components/hero-section";
import { FeaturedProducts } from "@/components/products/featured-products";
import { Products } from "@/components/products/products";

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* All Products */}
      <Products />
      {/* Featured Products */}
      <FeaturedProducts />

    </>
  );
}
