"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import AutoPlay from "embla-carousel-autoplay"

import { one, two, three, four, five, six, seven } from "../images/bannerImage"
import Image from "next/image"
const carouselItems = [one, two, three, four, five, six, seven]


export function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-secondary/20 via-background to-accent/10">
            <Carousel
                opts={{
                    loop: true,

                }}

                plugins={[
                    AutoPlay({ delay: 5000 }),
                ]}
            >
                <CarouselContent>
                    {
                        carouselItems.map((item, index) => (
                            <CarouselItem key={index} className="flex items-center justify-center border-y border-amber-300 lg:h-[80vh]">
                                <Image src={item.src} alt="" className="object-center w-full h-full" width={1920} height={1080} />
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <CarouselPrevious className="cursor-pointer" />
                    <CarouselNext className="cursor-pointer" />
                </div>
            </Carousel>
        </section>
    )
}
