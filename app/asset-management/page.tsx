"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AddAssetManagementModal } from "@/components/asset-management/add-asset-modal"
import { EditAssetManagementModal } from "@/components/asset-management/edit-asset-modal"

interface Asset {
  id: string
  name: string
  category: string
  location: string
  status: "active" | "maintenance" | "retired" | "pending"
  purchaseDate: string
  assignedUser: string
  description?: string
}

// Mock data
const mockAssets: Asset[] = [
  {
    id: "1",
    name: 'Samsung 55" Smart TV',
    category: "Electronics",
    location: "Room 101",
    status: "active",
    purchaseDate: "2023-01-15",
    assignedUser: "John Doe",
    description: "55-inch Smart TV for guest room entertainment",
  },
  {
    id: "2",
    name: "Daikin Split AC Unit",
    category: "HVAC",
    location: "Room 102",
    status: "maintenance",
    purchaseDate: "2022-08-20",
    assignedUser: "Jane Smith",
    description: "2.5 ton split AC unit for room cooling",
  },
  {
    id: "3",
    name: "King Size Bed",
    category: "Furniture",
    location: "Room 103",
    status: "active",
    purchaseDate: "2023-03-10",
    assignedUser: "Mike Johnson",
    description: "Premium king size bed with memory foam mattress",
  },
  {
    id: "4",
    name: "Mini Refrigerator",
    category: "Appliances",
    location: "Room 104",
    status: "retired",
    purchaseDate: "2021-05-12",
    assignedUser: "Sarah Wilson",
    description: "Compact mini fridge for guest convenience",
  },
  {
    id: "5",
    name: "Executive Desk",
    category: "Furniture",
    location: "Business Center",
    status: "pending",
    purchaseDate: "2023-02-28",
    assignedUser: "David Lee",
    description: "Wooden executive desk for business center",
  },
]

const categories = ["All", "Electronics", "HVAC", "Furniture", "Appliances", "Kitchen Equipment"]
const statuses = ["All", "Active", "Maintenance", "Retired", "Pending"]

// Async placeholder functions
const getAssets = async (): Promise<Asset[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockAssets
}

const createAsset = async (asset: Omit<Asset, "id">): Promise<Asset> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { ...asset, id: Date.now().toString() }
}

const updateAsset = async (asset: Asset): Promise<Asset> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return asset
}

const deleteAsset = async (id: string): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export default function AssetManagementPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  // Load assets on component mount
  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      setLoading(true)
      const data = await getAssets()
      setAssets(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter assets based on search and filters
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedUser.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All" || asset.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || asset.status === selectedStatus.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddAsset = async (newAsset: Omit<Asset, "id">) => {
    try {
      setActionLoading("add")
      const asset = await createAsset(newAsset)
      setAssets([...assets, asset])
      toast({
        title: "Success",
        description: `${asset.name} has been added successfully.`,
      })
      setIsAddModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add asset",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditAsset = async (updatedAsset: Asset) => {
    try {
      setActionLoading("edit")
      const asset = await updateAsset(updatedAsset)
      setAssets(assets.map((a) => (a.id === asset.id ? asset : a)))
      toast({
        title: "Success",
        description: `${asset.name} has been updated successfully.`,
      })
      setIsEditModalOpen(false)
      setSelectedAsset(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update asset",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteAsset = async (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId)
    if (!asset) return

    try {
      setActionLoading(`delete-${assetId}`)
      await deleteAsset(assetId)
      setAssets(assets.filter((a) => a.id !== assetId))
      toast({
        title: "Success",
        description: `${asset.name} has been deleted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: Asset["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "maintenance":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Maintenance</Badge>
      case "retired":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Retired</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout title="Asset Management">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout title="Asset Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Asset Management</h2>
              <p className="text-gray-600">Manage and track all hotel assets</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
              disabled={actionLoading === "add"}
            >
              {actionLoading === "add" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Asset
            </Button>
          </div>

          {/* Filters */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Search & Filter</CardTitle>
              <CardDescription>Find assets by name, location, or assigned user</CardDescription>
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
                  <CardTitle className="text-lg">Assets</CardTitle>
                  <CardDescription>
                    {filteredAssets.length} of {assets.length} assets
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead className="bg-white">Asset Name</TableHead>
                        <TableHead className="bg-white">Category</TableHead>
                        <TableHead className="bg-white">Location</TableHead>
                        <TableHead className="bg-white">Status</TableHead>
                        <TableHead className="bg-white">Purchase Date</TableHead>
                        <TableHead className="bg-white">Assigned User</TableHead>
                        <TableHead className="text-right bg-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.name}</TableCell>
                          <TableCell>{asset.category}</TableCell>
                          <TableCell>{asset.location}</TableCell>
                          <TableCell>{getStatusBadge(asset.status)}</TableCell>
                          <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                          <TableCell>{asset.assignedUser}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAsset(asset)
                                  setIsEditModalOpen(true)
                                }}
                                disabled={actionLoading === "edit"}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAsset(asset.id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={actionLoading === `delete-${asset.id}`}
                              >
                                {actionLoading === `delete-${asset.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <AddAssetManagementModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddAsset}
          loading={actionLoading === "add"}
        />

        {selectedAsset && (
          <EditAssetManagementModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedAsset(null)
            }}
            onEdit={handleEditAsset}
            asset={selectedAsset}
            loading={actionLoading === "edit"}
          />
        )}
      </MainLayout>
    </ProtectedRoute>
  )
}
