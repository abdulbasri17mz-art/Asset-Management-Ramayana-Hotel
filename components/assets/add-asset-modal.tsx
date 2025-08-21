"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Asset {
  assetTag: string
  name: string
  category: string
  location: string
  status: "active" | "maintenance" | "retired"
  purchaseDate: string
  value: number
  description?: string
}

interface AddAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (asset: Asset) => void
}

const categories = ["Electronics", "Furniture", "Kitchen Equipment", "HVAC Systems"]
const statuses = ["active", "maintenance", "retired"]

export function AddAssetModal({ isOpen, onClose, onAdd }: AddAssetModalProps) {
  const [formData, setFormData] = useState<Asset>({
    assetTag: "",
    name: "",
    category: "",
    location: "",
    status: "active",
    purchaseDate: "",
    value: 0,
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.assetTag || !formData.name || !formData.category || !formData.location) {
      return
    }

    onAdd(formData)
    setFormData({
      assetTag: "",
      name: "",
      category: "",
      location: "",
      status: "active",
      purchaseDate: "",
      value: 0,
      description: "",
    })
    onClose()
  }

  const handleChange = (field: keyof Asset, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-0 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Add New Asset</DialogTitle>
          <DialogDescription>Enter the details for the new asset to add it to the system.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetTag">Asset Tag *</Label>
              <Input
                id="assetTag"
                placeholder="RH-XXX-001"
                value={formData.assetTag}
                onChange={(e) => handleChange("assetTag", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value ($)</Label>
              <Input
                id="value"
                type="number"
                placeholder="0"
                value={formData.value}
                onChange={(e) => handleChange("value", Number.parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              placeholder="Enter asset name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="Room 101"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter asset description..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Add Asset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
