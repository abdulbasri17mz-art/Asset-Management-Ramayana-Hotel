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

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  user: User | null
}

export function ResetPasswordModal({ isOpen, onClose, onSubmit, user }: ResetPasswordModalProps) {
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
                  Reset Password
                  <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
                <DialogDescription>Generate a new password for this user</DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Reset password for {user?.name}?</p>
                    <p className="text-amber-700 mt-1">
                      A new temporary password will be generated and displayed. The user will need to change it on their
                      next login.
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
                  <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white">
                    Reset Password
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
