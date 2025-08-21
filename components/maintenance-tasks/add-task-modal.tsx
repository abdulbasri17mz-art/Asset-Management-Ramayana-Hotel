"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

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

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: Omit<Task, "id" | "createdAt">) => void
  technicians: Technician[]
}

// Mock assets data
const mockAssets = [
  "AC-001 (Room 101)",
  "AC-002 (Room 102)",
  "ELV-001 (Main Elevator)",
  "ELV-002 (Service Elevator)",
  "POOL-001 (Swimming Pool)",
  "GEN-001 (Backup Generator)",
  "FA-001 (Floor 1)",
  "FA-002 (Floor 2)",
  "FA-003 (Floor 3)",
  "HVAC-001 (Lobby)",
  "HVAC-002 (Restaurant)",
  "PUMP-001 (Water Pump)",
]

export function AddTaskModal({ isOpen, onClose, onSubmit, technicians }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    asset: "",
    assignedTechnician: "",
    status: "Created" as Task["status"],
    dueDate: "",
    description: "",
    priority: "Medium" as Task["priority"],
  })
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Task name is required"
    }

    if (!formData.asset) {
      newErrors.asset = "Asset selection is required"
    }

    if (!formData.assignedTechnician) {
      newErrors.assignedTechnician = "Technician assignment is required"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error("Error submitting task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      asset: "",
      assignedTechnician: "",
      status: "Created",
      dueDate: "",
      description: "",
      priority: "Medium",
    })
    setSelectedDate(undefined)
    setErrors({})
    setIsSubmitting(false)
    onClose()
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dueDate: format(date, "yyyy-MM-dd"),
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Maintenance Task</DialogTitle>
        </DialogHeader>

        <AnimatePresence>
          {isOpen && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6 mt-4"
            >
              {/* Task Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Task Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter task name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Asset Selection */}
              <div className="space-y-2">
                <Label htmlFor="asset">Asset *</Label>
                <Select
                  value={formData.asset}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, asset: value }))}
                >
                  <SelectTrigger className={errors.asset ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAssets.map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.asset && <p className="text-sm text-red-500">{errors.asset}</p>}
              </div>

              {/* Assigned Technician */}
              <div className="space-y-2">
                <Label htmlFor="technician">Assigned Technician *</Label>
                <Select
                  value={formData.assignedTechnician}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, assignedTechnician: value }))}
                >
                  <SelectTrigger className={errors.assignedTechnician ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((technician) => (
                      <SelectItem key={technician.id} value={technician.name}>
                        {technician.name} ({technician.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignedTechnician && <p className="text-sm text-red-500">{errors.assignedTechnician}</p>}
              </div>

              {/* Priority and Due Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Task["priority"]) => setFormData((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label>Due Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                          errors.dueDate && "border-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Task Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the maintenance task in detail..."
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
