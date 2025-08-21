"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MaintenanceSchedule {
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

interface Asset {
  id: string
  name: string
  tag: string
}

interface CreateScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (schedule: Omit<MaintenanceSchedule, "id">) => void
  assets: Asset[]
  staff: string[]
}

export function CreateScheduleModal({ isOpen, onClose, onCreate, assets, staff }: CreateScheduleModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    assetId: "",
    startDate: "",
    startTime: "",
    endTime: "",
    assignedStaff: "",
    notes: "",
    priority: "medium" as MaintenanceSchedule["priority"],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.assetId ||
      !formData.startDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.assignedStaff
    ) {
      return
    }

    const selectedAsset = assets.find((asset) => asset.id === formData.assetId)
    if (!selectedAsset) return

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`)

    const schedule: Omit<MaintenanceSchedule, "id"> = {
      title: formData.title,
      assetId: formData.assetId,
      assetName: selectedAsset.name,
      assetTag: selectedAsset.tag,
      start: startDateTime,
      end: endDateTime,
      assignedStaff: formData.assignedStaff,
      notes: formData.notes,
      status: "pending",
      priority: formData.priority,
    }

    onCreate(schedule)

    // Reset form
    setFormData({
      title: "",
      assetId: "",
      startDate: "",
      startTime: "",
      endTime: "",
      assignedStaff: "",
      notes: "",
      priority: "medium",
    })

    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-0 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Schedule Maintenance</DialogTitle>
          <DialogDescription>Create a new maintenance schedule for an asset.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Maintenance Title *</Label>
            <Input
              id="title"
              placeholder="e.g., AC Unit Servicing"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset">Select Asset *</Label>
            <Select value={formData.assetId} onValueChange={(value) => handleChange("assetId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.tag})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff">Assigned Staff *</Label>
              <Select value={formData.assignedStaff} onValueChange={(value) => handleChange("assignedStaff", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or instructions..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Schedule Maintenance
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
