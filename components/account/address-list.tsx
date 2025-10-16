"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddressType } from "@/models/address.model"
import { AddressInput } from "@/types/types"

type Props = {
    addresses: AddressType[]
    onSetDefault: (id: string, address: AddressInput) => void
    onRemove: (id: string) => void
}

export function AddressList({ addresses, onSetDefault, onRemove }: Props) {
    if (addresses?.length === 0) {
        return <p className="text-muted-foreground">No saved addresses yet.</p>
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {addresses?.map((a) => (
                <Card key={a._id as string}>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>{a.fullName}</span>
                            {a.isDefault ? (
                                <span className="text-xs rounded px-2 py-1 bg-primary text-primary-foreground">Default</span>
                            ) : null}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p className="text-pretty">
                            {a.line1}
                            {a.line2 ? `, ${a.line2}` : ""}
                        </p>
                        <p>
                            {a.city}, {a.state} {a.postalCode}
                        </p>
                        <p>{a.country}</p>
                        <p>Phone: {a.phoneNumber}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {!a.isDefault && (
                                <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => onSetDefault(a._id as string, a as AddressInput)}>
                                    Set default
                                </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => onRemove(a._id as string)}>
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
