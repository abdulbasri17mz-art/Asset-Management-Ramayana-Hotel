"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-context"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Shield, Calendar, Edit2, Save, X, Camera, Upload } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [editedEmail, setEditedEmail] = useState(user?.email || "")
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "/hotel-manager-avatar.png")
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG, GIF).",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewPhoto(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSave = () => {
    const updatedProfile = {
      name: editedName,
      email: editedEmail,
      profilePhoto: previewPhoto || profilePhoto,
    }

    updateUserProfile(updatedProfile)

    if (previewPhoto) {
      setProfilePhoto(previewPhoto)
      setPreviewPhoto(null)
    }

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedName(user?.name || "")
    setEditedEmail(user?.email || "")
    setPreviewPhoto(null)
    setIsEditing(false)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200"
      case "staff":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "viewer":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar
                  className="w-20 h-20 cursor-pointer transition-all duration-200 group-hover:ring-4 group-hover:ring-emerald-200"
                  onClick={triggerPhotoUpload}
                >
                  <AvatarImage src={previewPhoto || profilePhoto} alt={user?.name || "User"} className="object-cover" />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  onClick={triggerPhotoUpload}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={triggerPhotoUpload}
                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 bg-transparent"
              >
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </Button>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

              {previewPhoto && (
                <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  New photo selected - Save to apply
                </div>
              )}

              <Badge className={`${getRoleBadgeColor(user?.role || "")} border`}>
                <Shield className="w-3 h-3 mr-1" />
                {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || "User"}
              </Badge>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md text-sm">{user?.name || "Not provided"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md text-sm">{user?.email || "Not provided"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <div className="p-3 bg-gray-50 rounded-md text-sm">January 2024</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
