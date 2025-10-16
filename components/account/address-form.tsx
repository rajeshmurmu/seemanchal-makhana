"use client"

import type React from "react"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addressSchema } from "@/shared/schema/address-schema"
import type { AddressSchema } from "@/shared/schema/address-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Checkbox } from "../ui/checkbox"

type Props = {
    initial?: Partial<AddressSchema>
    submitLabel?: string
    onSubmit: (data: AddressSchema) => void
    isCreating?: boolean
}

export function AddressForm({ initial, submitLabel = "Add address", onSubmit, isCreating = false }: Props) {
    const form = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            line1: "",
            line2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            isDefault: false
        }
    });

    // Set initial values
    useEffect(() => {
        if (!initial) return
        form.setValue("fullName", initial.fullName!)
        form.setValue("phoneNumber", initial.phoneNumber!)
        form.setValue("line1", initial.line1!)
        form.setValue("line2", initial.line2)
        form.setValue("city", initial.city!)
        form.setValue("state", initial.state!)
        form.setValue("postalCode", initial.postalCode!)
        form.setValue("country", initial.country!)
        form.setValue("isDefault", initial.isDefault!)
    }, [form, initial])


    return (
        <Form {...form}>
            <form onSubmit={
                form.handleSubmit((data) => {
                    onSubmit(data)
                    form.reset()
                })}
                className="space-y-4"
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full name</FormLabel>
                                    <FormControl>
                                        <Input id="fullName" placeholder="Enter your full name" {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="line1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address line 1</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your address" {...field} />
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )}
                    />

                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="line2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address line 2</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your address" {...field} />
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )}
                    />

                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your city" {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your state" {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your postal code" {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your city" {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default shipping?</FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            className="border border-primary"
                                            checked={field.value || false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button disabled={isCreating} type="submit" className="bg-primary text-primary-foreground">
                    {submitLabel}
                </Button>
            </form>
        </Form>
    )
}
