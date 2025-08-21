"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Filter, MoreHorizontal, Calendar, User, Wrench } from "lucide-react"
import { AddTaskModal } from "@/components/maintenance-tasks/add-task-modal"

// Types
interface Task {
  id: string
  name: string
  asset: string
  assignedTechnician: string
  status: "Created" | "Assigned" | "In Progress" | "Completed" | "Verified"
  dueDate: string
  description?: string
  priority: "Low" | "Medium" | "High"
  createdAt: string
}

interface Technician {
  id: string
  name: string
  email: string
  role: "Technician"
}

// Mock data
const mockTechnicians: Technician[] = [
  { id: "1", name: "Ahmad Rizki", email: "ahmad@ramayanahotel.com", role: "Technician" },
  { id: "2", name: "Siti Nurhaliza", email: "siti@ramayanahotel.com", role: "Technician" },
  { id: "3", name: "Budi Santoso", email: "budi@ramayanahotel.com", role: "Technician" },
  { id: "4", name: "Maya Sari", email: "maya@ramayanahotel.com", role: "Technician" },
]

const mockTasks: Task[] = [
  {
    id: "1",
    name: "AC Unit Maintenance",
    asset: "AC-001 (Room 101)",
    assignedTechnician: "Ahmad Rizki",
    status: "In Progress",
    dueDate: "2024-01-25",
    description: "Regular maintenance check for AC unit",
    priority: "High",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Elevator Inspection",
    asset: "ELV-001 (Main Elevator)",
    assignedTechnician: "Siti Nurhaliza",
    status: "Assigned",
    dueDate: "2024-01-28",
    description: "Monthly safety inspection",
    priority: "High",
    createdAt: "2024-01-21",
  },
  {
    id: "3",
    name: "Pool Filter Cleaning",
    asset: "POOL-001 (Swimming Pool)",
    assignedTechnician: "Budi Santoso",
    status: "Completed",
    dueDate: "2024-01-22",
    description: "Weekly pool filter maintenance",
    priority: "Medium",
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    name: "Generator Testing",
    asset: "GEN-001 (Backup Generator)",
    assignedTechnician: "Maya Sari",
    status: "Created",
    dueDate: "2024-01-30",
    description: "Monthly generator functionality test",
    priority: "Medium",
    createdAt: "2024-01-22",
  },
  {
    id: "5",
    name: "Fire Alarm Check",
    asset: "FA-001 (Floor 3)",
    assignedTechnician: "Ahmad Rizki",
    status: "Verified",
    dueDate: "2024-01-20",
    description: "Quarterly fire alarm system check",
    priority: "High",
    createdAt: "2024-01-15",
  },
]

// Async placeholder functions
const getTasks = async (): Promise<Task[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockTasks
}

const createTask = async (taskData: Omit<Task, "id" | "createdAt">): Promise<Task> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newTask: Task = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  }
  return newTask
}

const updateTaskStatus = async (taskId: string, status: Task["status"]): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log(`Task ${taskId} status updated to ${status}`)
}

const deleteTask = async (taskId: string): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log(`Task ${taskId} deleted`)
}

const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "Created":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "Assigned":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "Verified":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200"
    case "Medium":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getNextStatus = (currentStatus: Task["status"]): Task["status"] | null => {
  const statusFlow: Record<Task["status"], Task["status"] | null> = {
    Created: "Assigned",
    Assigned: "In Progress",
    "In Progress": "Completed",
    Completed: "Verified",
    Verified: null,
  }
  return statusFlow[currentStatus]
}

export default function MaintenanceTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { toast } = useToast()

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await getTasks()
        setTasks(tasksData)
        setFilteredTasks(tasksData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [toast])

  // Filter tasks based on search and status
  useEffect(() => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignedTechnician.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter])

  const handleAddTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      const newTask = await createTask(taskData)
      setTasks((prev) => [newTask, ...prev])
      toast({
        title: "Success",
        description: "Task created successfully",
      })
      setIsAddModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const handleStatusUpdate = async (taskId: string, newStatus: Task["status"]) => {
    try {
      await updateTaskStatus(taskId, newStatus)
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
      toast({
        title: "Success",
        description: `Task status updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const taskStats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    overdue: tasks.filter((t) => new Date(t.dueDate) < new Date() && !["Completed", "Verified"].includes(t.status))
      .length,
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading tasks...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance & Task Management</h1>
            <p className="text-gray-600 mt-1">Manage maintenance tasks and track progress</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{taskStats.total}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks, assets, or technicians..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Created">Created</SelectItem>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Assigned Technician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-gray-500">
                          <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No tasks found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{task.asset}</TableCell>
                        <TableCell>{task.assignedTechnician}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`${new Date(task.dueDate) < new Date() && !["Completed", "Verified"].includes(task.status) ? "text-red-600 font-medium" : ""}`}
                          >
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {getNextStatus(task.status) && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(task.id, getNextStatus(task.status)!)}
                                >
                                  Mark as {getNextStatus(task.status)}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-600">
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddTask}
          technicians={mockTechnicians}
        />
      </div>
    </MainLayout>
  )
}
