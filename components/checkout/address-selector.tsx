"use client"

import { useEffect, useMemo, useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AddressForm } from "@/components/account/address-form"
import { useAddressData } from "@/hooks/use-address-data"
import { useAddressMutation } from "@/hooks/use-address-mutation"
import { AddressType } from "@/models/address.model"
import { Address } from "@/types/types"

type Props = {
  selectedId?: string | null
  onChange: (id: string | null) => void
}

export function AddressSelector({ selectedId, onChange }: Props) {
  const { addressData } = useAddressData()
  const { addAddressMutation, setDefaultAddressMutation, deleteAddressMutation } = useAddressMutation()
  const [adding, setAdding] = useState(false)
  const [addresses, setAddresses] = useState<AddressType[]>([])


  const defaultId = useMemo(() => addresses?.find((a) => a.isDefault)?._id ?? addresses[0]?._id ?? null, [addresses])

  const effectiveSelected = selectedId ?? defaultId ?? null

  useEffect(() => {
    if (addressData) {
      setAddresses(addressData as AddressType[])
    }
  }, [addressData])


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        <Button variant={adding ? "outline" : "default"} onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "Add new"}
        </Button>
      </div>

      {adding && (
        <Card>
          <CardContent className="pt-6">
            <AddressForm
              submitLabel="Save address"
              onSubmit={(data) => {
                addAddressMutation({ address: { ...data, isDefault: data.isDefault } })
                setAdding(false)
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {addresses?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No addresses yet. Click “Add new” to add your first shipping address.
          </p>
        ) : (
          <RadioGroup
            value={effectiveSelected as string ?? ""}
            onValueChange={(val) => onChange(val || null)}
            className="space-y-3"
          >
            {addresses?.map((addr) => (
              <Card key={addr._id as string} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem id={`addr-${addr._id}`} value={addr._id as string} />
                    <div className="flex-1">
                      <Label htmlFor={`addr-${addr._id}`} className="font-medium">
                        {addr.fullName} {addr.isDefault ? "(Default)" : ""}
                      </Label>
                      <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                        <p>{addr.line1}</p>
                        {addr.line2 ? <p>{addr.line2}</p> : null}
                        <p>
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p>
                          {addr.country} • {addr.phoneNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {!addr.isDefault && (
                          <Button size="sm" variant="outline" onClick={() => setDefaultAddressMutation({
                            addressId: addr._id as string,
                            address: { ...addr, isDefault: true } as Address
                          })}
                          >
                            Set default
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => deleteAddressMutation({ addressId: addr._id as string })}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        )}
      </div>

      <Separator />
    </div>
  )
}
