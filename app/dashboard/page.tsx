"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Wrench, Calendar, FileText, TrendingUp, TrendingDown } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Mock data for charts
const assetCategoryData = [
  { name: "Furniture", value: 45, color: "#006d5b" },
  { name: "Electronics", value: 30, color: "#ffc107" },
  { name: "Kitchen Equipment", value: 15, color: "#10b981" },
  { name: "HVAC Systems", value: 10, color: "#f59e0b" },
]

const maintenanceOverTimeData = [
  { month: "Jan", completed: 12, scheduled: 15 },
  { month: "Feb", completed: 18, scheduled: 20 },
  { month: "Mar", completed: 15, scheduled: 18 },
  { month: "Apr", completed: 22, scheduled: 25 },
  { month: "May", completed: 28, scheduled: 30 },
  { month: "Jun", completed: 25, scheduled: 28 },
]

const overviewStats = [
  {
    title: "Total Assets",
    value: "1,247",
    change: "+12%",
    changeType: "increase" as const,
    icon: Package,
    description: "Active assets in system",
  },
  {
    title: "Assets in Maintenance",
    value: "23",
    change: "-8%",
    changeType: "decrease" as const,
    icon: Wrench,
    description: "Currently under maintenance",
  },
  {
    title: "Upcoming Schedules",
    value: "15",
    change: "+5%",
    changeType: "increase" as const,
    icon: Calendar,
    description: "Scheduled for next 7 days",
  },
  {
    title: "Reports Generated",
    value: "89",
    change: "+23%",
    changeType: "increase" as const,
    icon: FileText,
    description: "This month",
  },
]

const recentActivities = [
  {
    id: 1,
    action: "Asset Added",
    description: "New LED TV added to Room 205",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    action: "Maintenance Completed",
    description: "AC Unit servicing completed in Lobby",
    time: "4 hours ago",
    type: "info",
  },
  {
    id: 3,
    action: "Schedule Created",
    description: "Weekly cleaning scheduled for all rooms",
    time: "6 hours ago",
    type: "warning",
  },
  {
    id: 4,
    action: "Asset Retired",
    description: "Old printer removed from Reception",
    time: "1 day ago",
    type: "destructive",
  },
]

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <MainLayout title="Dashboard">
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="glass-card border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        {stat.changeType === "increase" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">from last month</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Categories Pie Chart */}
            <Card className="glass-card border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Asset Categories</CardTitle>
                <CardDescription>Distribution of assets by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assetCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Over Time Line Chart */}
            <Card className="glass-card border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Maintenance Over Time</CardTitle>
                <CardDescription>Monthly maintenance completion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={maintenanceOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#006d5b"
                        strokeWidth={3}
                        dot={{ fill: "#006d5b", strokeWidth: 2, r: 4 }}
                        name="Completed"
                      />
                      <Line
                        type="monotone"
                        dataKey="scheduled"
                        stroke="#ffc107"
                        strokeWidth={3}
                        dot={{ fill: "#ffc107", strokeWidth: 2, r: 4 }}
                        name="Scheduled"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Activities</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Badge
                        variant={
                          activity.type === "success"
                            ? "success"
                            : activity.type === "info"
                              ? "info"
                              : activity.type === "warning"
                                ? "warning"
                                : "destructive"
                        }
                        className="w-2 h-2 p-0 rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
