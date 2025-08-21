"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, QrCode, Eye } from "lucide-react"
import { AddAssetModal } from "@/components/assets/add-asset-modal"
import { EditAssetModal } from "@/components/assets/edit-asset-modal"
import { QRCodeModal } from "@/components/assets/qr-code-modal"
import { ViewAssetModal } from "@/components/assets/view-asset-modal"
import { useToast } from "@/hooks/use-toast"

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

// Mock data
const mockAssets: Asset[] = [
  {
    id: "1",
    assetTag: "RH-TV-001",
    name: 'Samsung 55" Smart TV',
    category: "Electronics",
    location: "Room 101",
    status: "active",
    purchaseDate: "2023-01-15",
    value: 800,
    description: "55-inch Smart TV for guest room entertainment",
  },
  {
    id: "2",
    assetTag: "RH-AC-002",
    name: "Daikin Split AC Unit",
    category: "HVAC Systems",
    location: "Room 102",
    status: "maintenance",
    purchaseDate: "2022-08-20",
    value: 1200,
    description: "2.5 ton split AC unit for room cooling",
  },
  {
    id: "3",
    assetTag: "RH-BED-003",
    name: "King Size Bed",
    category: "Furniture",
    location: "Room 103",
    status: "active",
    purchaseDate: "2023-03-10",
    value: 1500,
    description: "Premium king size bed with memory foam mattress",
  },
  {
    id: "4",
    assetTag: "RH-REF-004",
    name: "Mini Refrigerator",
    category: "Kitchen Equipment",
    location: "Room 104",
    status: "retired",
    purchaseDate: "2021-05-12",
    value: 300,
    description: "Compact mini fridge for guest convenience",
  },
  {
    id: "5",
    assetTag: "RH-DESK-005",
    name: "Executive Desk",
    category: "Furniture",
    location: "Business Center",
    status: "active",
    purchaseDate: "2023-02-28",
    value: 600,
    description: "Wooden executive desk for business center",
  },
]

const categories = ["All", "Electronics", "Furniture", "Kitchen Equipment", "HVAC Systems"]
const statuses = ["All", "Active", "Maintenance", "Retired"]

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const { toast } = useToast()

  // Filter assets based on search and filters
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All" || asset.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || asset.status === selectedStatus.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddAsset = (newAsset: Omit<Asset, "id">) => {
    const asset: Asset = {
      ...newAsset,
      id: Date.now().toString(),
    }
    setAssets([...assets, asset])
    toast({
      title: "Asset added successfully",
      description: `${asset.name} has been added to the system.`,
    })
  }

  const handleEditAsset = (updatedAsset: Asset) => {
    setAssets(assets.map((asset) => (asset.id === updatedAsset.id ? updatedAsset : asset)))
    toast({
      title: "Asset updated successfully",
      description: `${updatedAsset.name} has been updated.`,
    })
  }

  const handleDeleteAsset = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId)
    setAssets(assets.filter((a) => a.id !== assetId))
    toast({
      title: "Asset deleted successfully",
      description: `${asset?.name} has been removed from the system.`,
      variant: "destructive",
    })
  }

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

  return (
    <ProtectedRoute>
      <MainLayout title="Asset Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Assets</h2>
              <p className="text-gray-600">Manage your hotel assets and equipment</p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>

          {/* Filters */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
              <CardDescription>Search and filter your assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assets Table */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Assets List</CardTitle>
                  <CardDescription>
                    {filteredAssets.length} of {assets.length} assets
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Tag</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.assetTag}</TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.category}</TableCell>
                        <TableCell>{asset.location}</TableCell>
                        <TableCell>{getStatusBadge(asset.status)}</TableCell>
                        <TableCell>${asset.value.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAsset(asset)
                                setIsViewModalOpen(true)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAsset(asset)
                                setIsQRModalOpen(true)
                              }}
                            >
                              <QrCode className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAsset(asset)
                                setIsEditModalOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddAsset} />

        {selectedAsset && (
          <>
            <EditAssetModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false)
                setSelectedAsset(null)
              }}
              onEdit={handleEditAsset}
              asset={selectedAsset}
            />

            <QRCodeModal
              isOpen={isQRModalOpen}
              onClose={() => {
                setIsQRModalOpen(false)
                setSelectedAsset(null)
              }}
              asset={selectedAsset}
            />

            <ViewAssetModal
              isOpen={isViewModalOpen}
              onClose={() => {
                setIsViewModalOpen(false)
                setSelectedAsset(null)
              }}
              asset={selectedAsset}
            />
          </>
        )}
      </MainLayout>
    </ProtectedRoute>
  )
}
