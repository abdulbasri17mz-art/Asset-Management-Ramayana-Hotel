"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, Search, CheckCircle, Clock, AlertCircle, Camera, Package, MapPin, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { useToast } from "@/hooks/use-toast"
import moment from "moment"

interface JobTask {
  id: string
  title: string
  description: string
  assetId: string
  assetName: string
  assetTag: string
  assetLocation: string
  assignedTo: string
  scheduledDate: Date
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  estimatedDuration: number // in minutes
  completedAt?: Date
  completionNotes?: string
}

interface Asset {
  id: string
  assetTag: string
  name: string
  category: string
  location: string
  status: "active" | "maintenance" | "retired"
  lastMaintenance?: Date
}

// Mock data
const mockTasks: JobTask[] = [
  {
    id: "1",
    title: "AC Unit Servicing",
    description: "Perform quarterly maintenance check on AC unit including filter cleaning and coolant level check",
    assetId: "2",
    assetName: "Daikin Split AC Unit",
    assetTag: "RH-AC-002",
    assetLocation: "Room 102",
    assignedTo: "John Smith",
    scheduledDate: new Date(2024, 11, 25, 9, 0),
    priority: "medium",
    status: "pending",
    estimatedDuration: 120,
  },
  {
    id: "2",
    title: "TV Software Update",
    description: "Check for and install any available software updates, verify all streaming services are working",
    assetId: "1",
    assetName: 'Samsung 55" Smart TV',
    assetTag: "RH-TV-001",
    assetLocation: "Room 101",
    assignedTo: "John Smith",
    scheduledDate: new Date(2024, 11, 26, 14, 0),
    priority: "low",
    status: "completed",
    estimatedDuration: 30,
    completedAt: new Date(2024, 11, 26, 14, 25),
    completionNotes: "Updated to latest firmware version. All streaming apps working properly.",
  },
  {
    id: "3",
    title: "Refrigerator Temperature Check",
    description: "Monitor and adjust refrigerator temperature, check for any unusual noises or issues",
    assetId: "4",
    assetName: "Mini Refrigerator",
    assetTag: "RH-REF-004",
    assetLocation: "Room 104",
    assignedTo: "John Smith",
    scheduledDate: new Date(2024, 11, 27, 10, 0),
    priority: "high",
    status: "in-progress",
    estimatedDuration: 45,
  },
]

const mockAssets: Asset[] = [
  {
    id: "1",
    assetTag: "RH-TV-001",
    name: 'Samsung 55" Smart TV',
    category: "Electronics",
    location: "Room 101",
    status: "active",
    lastMaintenance: new Date(2024, 11, 26),
  },
  {
    id: "2",
    assetTag: "RH-AC-002",
    name: "Daikin Split AC Unit",
    category: "HVAC Systems",
    location: "Room 102",
    status: "maintenance",
  },
  {
    id: "4",
    assetTag: "RH-REF-004",
    name: "Mini Refrigerator",
    category: "Kitchen Equipment",
    location: "Room 104",
    status: "active",
  },
]

export default function JobTasksPage() {
  const [tasks, setTasks] = useState<JobTask[]>(mockTasks)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [selectedTask, setSelectedTask] = useState<JobTask | null>(null)
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)
  const [isAssetDetailsOpen, setIsAssetDetailsOpen] = useState(false)
  const [isCompleteTaskOpen, setIsCompleteTaskOpen] = useState(false)
  const [qrInput, setQrInput] = useState("")
  const [completionNotes, setCompletionNotes] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  // Filter tasks for current user
  const userTasks = tasks.filter((task) => task.assignedTo === user?.name)
  const pendingTasks = userTasks.filter((task) => task.status === "pending")
  const inProgressTasks = userTasks.filter((task) => task.status === "in-progress")
  const completedTasks = userTasks.filter((task) => task.status === "completed")

  const handleQRScan = () => {
    // Simulate QR code scanning
    const asset = mockAssets.find((a) => a.assetTag === qrInput.toUpperCase())
    if (asset) {
      setSelectedAsset(asset)
      setIsQRScannerOpen(false)
      setIsAssetDetailsOpen(true)
      setQrInput("")
      toast({
        title: "Asset found",
        description: `Loaded details for ${asset.name}`,
      })
    } else {
      toast({
        title: "Asset not found",
        description: "Please check the asset tag and try again",
        variant: "destructive",
      })
    }
  }

  const handleStartTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "in-progress" as const } : task)))
    toast({
      title: "Task started",
      description: "Task status updated to in-progress",
    })
  }

  const handleCompleteTask = (taskId: string, notes: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed" as const,
              completedAt: new Date(),
              completionNotes: notes,
            }
          : task,
      ),
    )
    setIsCompleteTaskOpen(false)
    setSelectedTask(null)
    setCompletionNotes("")
    toast({
      title: "Task completed",
      description: "Task has been marked as completed",
    })
  }

  const getStatusBadge = (status: JobTask["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="info" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: JobTask["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="warning">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getAssetTasks = (assetId: string) => {
    return userTasks.filter((task) => task.assetId === assetId)
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <MainLayout title="Job Tasks">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Job Tasks</h2>
              <p className="text-gray-600">Manage your assigned maintenance tasks</p>
            </div>
            <Button onClick={() => setIsQRScannerOpen(true)} className="bg-primary hover:bg-primary/90">
              <QrCode className="w-4 h-4 mr-2" />
              Scan Asset QR
            </Button>
          </div>

          {/* Task Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
                <Clock className="w-5 h-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{pendingTasks.length}</div>
                <p className="text-xs text-gray-500 mt-1">Awaiting start</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                <AlertCircle className="w-5 h-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{inProgressTasks.length}</div>
                <p className="text-xs text-gray-500 mt-1">Currently working</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{completedTasks.length}</div>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Tasks */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Active Tasks</CardTitle>
              <CardDescription>Pending and in-progress tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...pendingTasks, ...inProgressTasks].map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {task.assetName} ({task.assetTag})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {task.assetLocation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {moment(task.scheduledDate).format("MMM DD, h:mm A")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.estimatedDuration} min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {task.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => handleStartTask(task.id)}>
                          Start Task
                        </Button>
                      )}
                      {task.status === "in-progress" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task)
                            setIsCompleteTaskOpen(true)
                          }}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {[...pendingTasks, ...inProgressTasks].length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No active tasks at the moment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Recently Completed</CardTitle>
              <CardDescription>Tasks you've completed recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {getStatusBadge(task.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>
                          {task.assetName} ({task.assetTag})
                        </span>
                        <span>•</span>
                        <span>Completed {moment(task.completedAt).format("MMM DD, h:mm A")}</span>
                      </div>
                      {task.completionNotes && (
                        <p className="text-sm text-gray-600 bg-white p-2 rounded border">{task.completionNotes}</p>
                      )}
                    </div>
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No completed tasks yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Scanner Modal */}
        <Dialog open={isQRScannerOpen} onOpenChange={setIsQRScannerOpen}>
          <DialogContent className="glass-card border-0 shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">Scan Asset QR Code</DialogTitle>
              <DialogDescription>
                Enter the asset tag from the QR code to view asset details and related tasks
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qrInput">Asset Tag</Label>
                <Input
                  id="qrInput"
                  placeholder="Enter asset tag (e.g., RH-TV-001)"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleQRScan()}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsQRScannerOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleQRScan} className="bg-primary hover:bg-primary/90">
                  <Search className="w-4 h-4 mr-2" />
                  Find Asset
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Asset Details Modal */}
        {selectedAsset && (
          <Dialog open={isAssetDetailsOpen} onOpenChange={setIsAssetDetailsOpen}>
            <DialogContent className="glass-card border-0 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">Asset Details</DialogTitle>
                <DialogDescription>
                  {selectedAsset.name} ({selectedAsset.assetTag})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Asset Info */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Location:</span>
                    <span className="text-sm text-gray-900">{selectedAsset.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <span className="text-sm text-gray-900">{selectedAsset.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <Badge variant={selectedAsset.status === "active" ? "success" : "warning"}>
                      {selectedAsset.status}
                    </Badge>
                  </div>
                  {selectedAsset.lastMaintenance && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Last Maintenance:</span>
                      <span className="text-sm text-gray-900">
                        {moment(selectedAsset.lastMaintenance).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Related Tasks */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Related Tasks</h4>
                  <div className="space-y-2">
                    {getAssetTasks(selectedAsset.id).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-500">{moment(task.scheduledDate).format("MMM DD, h:mm A")}</p>
                        </div>
                        {getStatusBadge(task.status)}
                      </div>
                    ))}
                    {getAssetTasks(selectedAsset.id).length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No tasks assigned for this asset</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setIsAssetDetailsOpen(false)}>Close</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Complete Task Modal */}
        {selectedTask && (
          <Dialog open={isCompleteTaskOpen} onOpenChange={setIsCompleteTaskOpen}>
            <DialogContent className="glass-card border-0 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">Complete Task</DialogTitle>
                <DialogDescription>Mark "{selectedTask.title}" as completed</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedTask.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{selectedTask.description}</p>
                  <div className="text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {selectedTask.assetName} ({selectedTask.assetTag})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completionNotes">Completion Notes</Label>
                  <Textarea
                    id="completionNotes"
                    placeholder="Add any notes about the completed work..."
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsCompleteTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleCompleteTask(selectedTask.id, completionNotes)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </MainLayout>
    </ProtectedRoute>
  )
}
