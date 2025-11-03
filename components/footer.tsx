import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                                <span className="text-primary font-bold text-sm">S</span>
                            </div>
                            <span className="font-bold text-xl">Seemanchal Makhana</span>
                        </div>
                        <p className="text-primary-foreground/80 text-sm">
                            Your trusted source for authentic traditional Indian foods, spices, and ingredients. Quality guaranteed
                            since 1995.
                        </p>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                                <Twitter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Quick Links</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/about"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/products"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                All Products
                            </Link>
                            <Link
                                href="#"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                Special Offers
                            </Link>

                        </nav>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Customer Service</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/contact"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href="/shipping"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                Shipping Info
                            </Link>
                            <Link
                                href="/returns"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                Returns & Refunds
                            </Link>
                            <Link
                                href="/faq"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                FAQ
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                            >
                                Privacy Policy
                            </Link>
                        </nav>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Get in Touch</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-4 w-4" />
                                <span className="text-primary-foreground/80">+91 96612 40793</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-4 w-4" />
                                <span className="text-primary-foreground/80">info@seemanchalmakhana.com</span>
                            </div>
                            <div className="flex items-start space-x-2 text-sm">
                                <MapPin className="h-4 w-4 mt-0.5" />
                                <span className="text-primary-foreground/80">
                                    855114 Semmanchal College Road,
                                    <br />
                                    Katihar, Bihar India 854105
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">Newsletter</h4>
                            <div className="flex space-x-2">
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                                />
                                <Button variant="secondary" size="sm">
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
                    <p className="text-primary-foreground/80 text-sm">
                        &copy; {new Date().getFullYear()} Seemanchal Makhana. All rights reserved. | Made with ❤️ for traditional food lovers.
                    </p>
                </div>
            </div>
        </footer>
    )
}
