"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MapPin, Tag, DollarSign, Package } from "lucide-react"

interface Asset {
  id: string
  assetTag: string
  name: string
  category: string
  location: string
  status: "active" | "maintenance" | "retired"
  purchaseDate: string
  value: number
  description?: string
}

interface ViewAssetModalProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset
}

export function ViewAssetModal({ isOpen, onClose, asset }: ViewAssetModalProps) {
  const getStatusBadge = (status: Asset["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>
      case "maintenance":
        return <Badge variant="warning">Maintenance</Badge>
      case "retired":
        return <Badge variant="outline">Retired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-0 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Asset Details</DialogTitle>
          <DialogDescription>Complete information for {asset.assetTag}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Header */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
            <div className="flex justify-center">{getStatusBadge(asset.status)}</div>
          </div>

          {/* Asset Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Asset Tag</p>
                <p className="text-sm text-gray-600">{asset.assetTag}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Category</p>
                <p className="text-sm text-gray-600">{asset.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">{asset.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Value</p>
                <p className="text-sm text-gray-600">${asset.value.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Purchase Date</p>
                <p className="text-sm text-gray-600">{formatDate(asset.purchaseDate)}</p>
              </div>
            </div>

            {asset.description && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Description</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{asset.description}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
