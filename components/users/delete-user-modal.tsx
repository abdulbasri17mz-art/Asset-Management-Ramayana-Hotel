"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "viewer"
  createdAt: Date
  lastLogin?: Date
}

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  user: User | null
}

export function DeleteUserModal({ isOpen, onClose, onSubmit, user }: DeleteUserModalProps) {
  const handleSubmit = () => {
    onSubmit()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  Delete User
                  <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
                <DialogDescription>This action cannot be undone</DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">Delete {user?.name}?</p>
                    <p className="text-red-700 mt-1">
                      This will permanently remove the user from the system. All associated data will be lost.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>User:</strong> {user?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Role:</strong> {user?.role}
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-6">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} variant="destructive">
                    Delete User
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
