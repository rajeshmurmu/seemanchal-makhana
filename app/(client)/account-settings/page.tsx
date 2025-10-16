"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthModal } from "@/components/auth/auth-modal"
import { AddressForm } from "@/components/account/address-form"
import { AddressList } from "@/components/account/address-list"
import toast from "react-hot-toast"
import { AddressSchema } from "@/shared/schema/address-schema"
import { AddressType } from "@/models/address.model"
import { useAddressMutation } from "@/hooks/use-address-mutation"
import { useAddressData } from "@/hooks/use-address-data"
import { AddressInput } from "@/types/types"

export default function AccountSettingsPage() {
    const { user, updateProfile, logout } = useAuth()
    const [showAuth, setShowAuth] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setEmail(user.email || "")
            setAvatar(user.image || "")
        }
    }, [user])

    const onSaveProfile = (e: React.FormEvent) => {
        e.preventDefault()
        updateProfile({ name, image: avatar })
        toast("Your account details have been saved.")
    }

    const onChangePassword = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock change password success
        toast("Your password has been changed successfully.")
    }

    const onDeleteAccount = () => {
        logout()
        toast("Your account has been removed from this device.")
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-balance">Account Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your personal information and security preferences.</p>
                </div>

                {!user ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Sign in to manage your account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">You need to be signed in to view and update account settings.</p>
                            <div className="flex items-center gap-3">
                                <Button onClick={() => setShowAuth(true)} className="bg-primary text-primary-foreground">
                                    Sign In / Create Account
                                </Button>
                            </div>
                            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid grid-cols-3 max-w-xl">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="addresses">Addresses</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={onSaveProfile} className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" value={email} disabled />
                                                <p className="text-xs text-muted-foreground">Email changes are not supported in this demo.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="avatar">Avatar URL</Label>
                                            <Input
                                                id="avatar"
                                                placeholder="/diverse-user-avatars.png"
                                                value={avatar}
                                                onChange={(e) => setAvatar(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button type="submit" className="bg-primary text-primary-foreground">
                                                Save changes
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={onChangePassword} className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password">Current password</Label>
                                                <Input id="current-password" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">New password</Label>
                                                <Input id="new-password" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm new password</Label>
                                                <Input id="confirm-password" type="password" />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Button type="submit" className="bg-primary text-primary-foreground">
                                                Update password
                                            </Button>
                                            <Button type="button" variant="destructive" onClick={onDeleteAccount}>
                                                Delete account
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="addresses" className="mt-6">
                            <AddressesTab />
                        </TabsContent>
                    </Tabs>
                )}
            </main>
            <Footer />
        </div>
    )
}

function AddressesTab() {

    const { addAddressMutation, isAddressCreating, deleteAddressMutation, setDefaultAddressMutation } = useAddressMutation()
    const { addressData: addresses } = useAddressData()

    const handleAdd = (data: AddressSchema) => {
        addAddressMutation({ address: data })
    }

    const handleRemove = (addressId: string) => {
        deleteAddressMutation({ addressId })
    }

    const handleSetDefault = (addressId: string, address: AddressInput) => {
        setDefaultAddressMutation({ addressId, address })

    }


    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="max-h-fit">
                <CardHeader>
                    <CardTitle>Add a new address</CardTitle>
                </CardHeader>
                <CardContent>
                    <AddressForm isCreating={isAddressCreating} onSubmit={handleAdd} submitLabel="Save address" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Saved addresses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AddressList addresses={addresses as AddressType[]} onSetDefault={handleSetDefault} onRemove={handleRemove} />
                </CardContent>
            </Card>
        </div>
    )
}
