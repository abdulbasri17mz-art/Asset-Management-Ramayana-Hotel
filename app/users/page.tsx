"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, UsersIcon, Key, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AddUserModal } from "@/components/users/add-user-modal"
import { EditUserModal } from "@/components/users/edit-user-modal"
import { ChangePasswordModal } from "@/components/users/change-password-modal"
import { ResetPasswordModal } from "@/components/users/reset-password-modal"
import { DeleteUserModal } from "@/components/users/delete-user-modal"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "viewer"
  createdAt: Date
  lastLogin?: Date
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Abdul Basri",
    email: "bas@ramayanahotel.com",
    role: "admin",
    createdAt: new Date(2024, 0, 1),
    lastLogin: new Date(2024, 11, 26),
  },
  {
    id: "2",
    name: "Kiswanto",
    email: "kiswanto@ramayanahotel.com",
    role: "staff",
    createdAt: new Date(2024, 1, 15),
    lastLogin: new Date(2024, 11, 25),
  },
  {
    id: "3",
    name: "CrewHotel",
    email: "crew@ramayanahotel.com",
    role: "staff",
    createdAt: new Date(2024, 2, 10),
    lastLogin: new Date(2024, 11, 24),
  },
  {
    id: "4",
    name: "viewer",
    email: "viewer@ramayanahotel.com",
    role: "viewer",
    createdAt: new Date(2024, 3, 5),
    lastLogin: new Date(2024, 11, 20),
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  const itemsPerPage = 5

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Admin</Badge>
      case "staff":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Staff</Badge>
      case "viewer":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Viewer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const handleAddUser = (userData: Omit<User, "id" | "createdAt" | "lastLogin">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setUsers([...users, newUser])
    setIsAddModalOpen(false)
    toast({
      title: "User added successfully",
      description: `${userData.name} has been added to the system`,
    })
  }

  const handleEditUser = (userData: Partial<User>) => {
    if (!selectedUser) return

    const updatedUsers = users.map((user) => (user.id === selectedUser.id ? { ...user, ...userData } : user))
    setUsers(updatedUsers)
    setIsEditModalOpen(false)
    setSelectedUser(null)
    toast({
      title: "User updated successfully",
      description: `${userData.name || selectedUser.name}'s information has been updated`,
    })
  }

  const handleDeleteUser = (user: User) => {
    setUsers(users.filter((u) => u.id !== user.id))
    setIsDeleteModalOpen(false)
    setSelectedUser(null)
    toast({
      title: "User deleted successfully",
      description: `${user.name} has been removed from the system`,
      variant: "destructive",
    })
  }

  const handleChangePassword = (passwordData: { oldPassword: string; newPassword: string }) => {
    // In a real app, this would make an API call
    toast({
      title: "Password changed successfully",
      description: "Your password has been updated",
    })
    setIsChangePasswordModalOpen(false)
  }

  const handleResetPassword = (user: User) => {
    // In a real app, this would generate a new password and send it via email
    const newPassword = Math.random().toString(36).slice(-8)
    toast({
      title: "Password reset successfully",
      description: `New password for ${user.name}: ${newPassword}`,
    })
    setIsResetPasswordModalOpen(false)
    setSelectedUser(null)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout title="User Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <p className="text-gray-600">Manage system users and their permissions</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsChangePasswordModalOpen(true)}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="glass-card border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Search & Filter Users</CardTitle>
              <CardDescription>Find users by name, email, or filter by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="glass-card border-0 shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    Users List
                  </CardTitle>
                  <CardDescription>
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                    {filteredUsers.length} users
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>{user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsEditModalOpen(true)
                              }}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsResetPasswordModalOpen(true)
                              }}
                              className="hover:bg-amber-50 hover:text-amber-600"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsDeleteModalOpen(true)
                              }}
                              className="hover:bg-red-50 hover:text-red-600"
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

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddUser} />

        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={handleEditUser}
          user={selectedUser}
        />

        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          onSubmit={handleChangePassword}
        />

        <ResetPasswordModal
          isOpen={isResetPasswordModalOpen}
          onClose={() => {
            setIsResetPasswordModalOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={() => selectedUser && handleResetPassword(selectedUser)}
          user={selectedUser}
        />

        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={() => selectedUser && handleDeleteUser(selectedUser)}
          user={selectedUser}
        />
      </MainLayout>
    </ProtectedRoute>
  )
}
