"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Hotel, Bell, Palette, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [hotelName, setHotelName] = useState("Ramayana Hotel Makassar")
  const [hotelAddress, setHotelAddress] = useState("Jl. Somba Opu No. 297, Makassar, South Sulawesi")
  const [hotelPhone, setHotelPhone] = useState("+62 411 872 2272")
  const [hotelEmail, setHotelEmail] = useState("info@ramayanahotel.com")
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true)
  const [taskReminders, setTaskReminders] = useState(true)
  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    })
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout title="Settings">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600">Manage your hotel and system preferences</p>
          </div>

          {/* Hotel Information */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                Hotel Information
              </CardTitle>
              <CardDescription>Update your hotel's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Hotel Name</Label>
                  <Input id="hotelName" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelPhone">Phone Number</Label>
                  <Input id="hotelPhone" value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelEmail">Email Address</Label>
                <Input
                  id="hotelEmail"
                  type="email"
                  value={hotelEmail}
                  onChange={(e) => setHotelEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelAddress">Address</Label>
                <Textarea
                  id="hotelAddress"
                  value={hotelAddress}
                  onChange={(e) => setHotelAddress(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Settings
              </CardTitle>
              <CardDescription>Customize the appearance of your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                </div>
                <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceAlerts">Maintenance Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified about upcoming maintenance</p>
                </div>
                <Switch id="maintenanceAlerts" checked={maintenanceAlerts} onCheckedChange={setMaintenanceAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="taskReminders">Task Reminders</Label>
                  <p className="text-sm text-gray-500">Receive reminders for assigned tasks</p>
                </div>
                <Switch id="taskReminders" checked={taskReminders} onCheckedChange={setTaskReminders} />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
