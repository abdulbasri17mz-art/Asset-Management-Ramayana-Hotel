"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Plus, CalendarIcon, List, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { CreateScheduleModal } from "@/components/maintenance/create-schedule-modal"
import { useToast } from "@/hooks/use-toast"

const localizer = momentLocalizer(moment)

interface MaintenanceSchedule {
  id: string
  title: string
  assetId: string
  assetName: string
  assetTag: string
  start: Date
  end: Date
  assignedStaff: string
  notes: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
}

// Mock data
const mockSchedules: MaintenanceSchedule[] = [
  {
    id: "1",
    title: "AC Unit Servicing",
    assetId: "2",
    assetName: "Daikin Split AC Unit",
    assetTag: "RH-AC-002",
    start: new Date(2024, 11, 25, 9, 0),
    end: new Date(2024, 11, 25, 11, 0),
    assignedStaff: "John Smith",
    notes: "Regular quarterly maintenance check",
    status: "pending",
    priority: "medium",
  },
  {
    id: "2",
    title: "TV Inspection",
    assetId: "1",
    assetName: 'Samsung 55" Smart TV',
    assetTag: "RH-TV-001",
    start: new Date(2024, 11, 26, 14, 0),
    end: new Date(2024, 11, 26, 15, 0),
    assignedStaff: "Mike Johnson",
    notes: "Check for software updates and connectivity",
    status: "completed",
    priority: "low",
  },
  {
    id: "3",
    title: "Refrigerator Repair",
    assetId: "4",
    assetName: "Mini Refrigerator",
    assetTag: "RH-REF-004",
    start: new Date(2024, 11, 27, 10, 0),
    end: new Date(2024, 11, 27, 12, 0),
    assignedStaff: "Sarah Wilson",
    notes: "Temperature control issue reported",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "4",
    title: "Desk Maintenance",
    assetId: "5",
    assetName: "Executive Desk",
    assetTag: "RH-DESK-005",
    start: new Date(2024, 11, 28, 16, 0),
    end: new Date(2024, 11, 28, 17, 0),
    assignedStaff: "Tom Brown",
    notes: "Polish and check for damages",
    status: "pending",
    priority: "low",
  },
]

const mockAssets = [
  { id: "1", name: 'Samsung 55" Smart TV', tag: "RH-TV-001" },
  { id: "2", name: "Daikin Split AC Unit", tag: "RH-AC-002" },
  { id: "3", name: "King Size Bed", tag: "RH-BED-003" },
  { id: "4", name: "Mini Refrigerator", tag: "RH-REF-004" },
  { id: "5", name: "Executive Desk", tag: "RH-DESK-005" },
]

const mockStaff = ["John Smith", "Mike Johnson", "Sarah Wilson", "Tom Brown", "Lisa Davis"]

export default function MaintenancePage() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(mockSchedules)
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { toast } = useToast()

  const handleCreateSchedule = (newSchedule: Omit<MaintenanceSchedule, "id">) => {
    const schedule: MaintenanceSchedule = {
      ...newSchedule,
      id: Date.now().toString(),
    }
    setSchedules([...schedules, schedule])
    toast({
      title: "Schedule created successfully",
      description: `Maintenance scheduled for ${schedule.assetName}`,
    })
  }

  const handleStatusChange = (scheduleId: string, newStatus: MaintenanceSchedule["status"]) => {
    setSchedules(
      schedules.map((schedule) => (schedule.id === scheduleId ? { ...schedule, status: newStatus } : schedule)),
    )

    const schedule = schedules.find((s) => s.id === scheduleId)
    toast({
      title: "Status updated",
      description: `${schedule?.title} marked as ${newStatus}`,
    })
  }

  const getStatusBadge = (status: MaintenanceSchedule["status"]) => {
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

  const getPriorityBadge = (priority: MaintenanceSchedule["priority"]) => {
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

  const eventStyleGetter = (event: MaintenanceSchedule) => {
    let backgroundColor = "#006d5b"

    switch (event.status) {
      case "pending":
        backgroundColor = "#ffc107"
        break
      case "in-progress":
        backgroundColor = "#17a2b8"
        break
      case "completed":
        backgroundColor = "#28a745"
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    }
  }

  const upcomingSchedules = schedules
    .filter((schedule) => schedule.status !== "completed")
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 10)

  return (
    <ProtectedRoute>
      <MainLayout title="Maintenance Scheduling">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Maintenance Scheduling</h2>
              <p className="text-gray-600">Schedule and track maintenance activities</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("calendar")}
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  Calendar
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("list")}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>
          </div>

          {/* Calendar View */}
          {view === "calendar" && (
            <Card className="glass-card border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Maintenance Calendar</CardTitle>
                <CardDescription>View and manage scheduled maintenance activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Calendar
                    localizer={localizer}
                    events={schedules}
                    startAccessor="start"
                    endAccessor="end"
                    titleAccessor="title"
                    eventPropGetter={eventStyleGetter}
                    views={["month", "week", "day"]}
                    defaultView="month"
                    popup
                    className="maintenance-calendar"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* List View */}
          {view === "list" && (
            <Card className="glass-card border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">All Schedules</CardTitle>
                <CardDescription>Complete list of maintenance schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Assigned Staff</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{schedule.assetName}</p>
                              <p className="text-sm text-gray-500">{schedule.assetTag}</p>
                            </div>
                          </TableCell>
                          <TableCell>{schedule.title}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{moment(schedule.start).format("MMM DD, YYYY")}</p>
                              <p className="text-sm text-gray-500">
                                {moment(schedule.start).format("h:mm A")} - {moment(schedule.end).format("h:mm A")}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{schedule.assignedStaff}</TableCell>
                          <TableCell>{getPriorityBadge(schedule.priority)}</TableCell>
                          <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {schedule.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(schedule.id, "in-progress")}
                                >
                                  Start
                                </Button>
                              )}
                              {schedule.status === "in-progress" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(schedule.id, "completed")}
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Schedules */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Schedules</CardTitle>
              <CardDescription>Next 10 pending and in-progress maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                        {getStatusBadge(schedule.status)}
                        {getPriorityBadge(schedule.priority)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          {schedule.assetName} ({schedule.assetTag})
                        </span>
                        <span>•</span>
                        <span>{moment(schedule.start).format("MMM DD, h:mm A")}</span>
                        <span>•</span>
                        <span>Assigned to {schedule.assignedStaff}</span>
                      </div>
                      {schedule.notes && <p className="text-sm text-gray-500 mt-1">{schedule.notes}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {schedule.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(schedule.id, "in-progress")}
                        >
                          Start
                        </Button>
                      )}
                      {schedule.status === "in-progress" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(schedule.id, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Schedule Modal */}
        <CreateScheduleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSchedule}
          assets={mockAssets}
          staff={mockStaff}
        />
      </MainLayout>
    </ProtectedRoute>
  )
}
