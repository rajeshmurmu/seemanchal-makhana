"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, ResponseProductType } from "../types/types"

interface CartContextType {
    items: CartItem[]
    addToCart: (product: ResponseProductType, quantity?: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
    cartIsOpen: boolean
    setCartIsOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [cartIsOpen, setCartIsOpen] = useState(false)

    useEffect(() => {
        // Load cart from localStorage on mount
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            setItems(JSON.parse(savedCart))
        }
    }, [])

    useEffect(() => {
        // Save cart to localStorage whenever items change
        localStorage.setItem("cart", JSON.stringify(items))
    }, [items])

    const addToCart = (product: ResponseProductType, quantity = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.product._id === product._id)

            if (existingItem) {
                return prevItems.map((item) =>
                    item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item,
                )
            }

            return [...prevItems, { product, quantity }]
        })
    }

    const removeFromCart = (productId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.product._id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setItems((prevItems) => prevItems.map((item) => (item.product._id === productId ? { ...item, quantity } : item)))
    }

    const clearCart = () => {
        setItems([])
    }

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0)
    }

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
                cartIsOpen,
                setCartIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
