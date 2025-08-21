"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { FileText, Download, Calendar, TrendingUp, Package, Wrench } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportData {
  date: string
  asset: string
  action: string
  cost: number
  status: string
}

interface ChartData {
  totalAssets: number
  maintenanceCosts: { month: string; cost: number }[]
  taskCompletion: { month: string; completed: number; total: number; rate: number }[]
}

// Mock data
const mockReportData: ReportData[] = [
  {
    date: "2024-12-26",
    asset: 'Samsung 55" Smart TV (RH-TV-001)',
    action: "Software Update",
    cost: 0,
    status: "Completed",
  },
  {
    date: "2024-12-25",
    asset: "Daikin Split AC Unit (RH-AC-002)",
    action: "Routine Maintenance",
    cost: 150,
    status: "In Progress",
  },
  {
    date: "2024-12-24",
    asset: "King Size Bed (RH-BED-003)",
    action: "Repair",
    cost: 75,
    status: "Completed",
  },
  {
    date: "2024-12-23",
    asset: "Mini Refrigerator (RH-REF-004)",
    action: "Temperature Calibration",
    cost: 50,
    status: "Completed",
  },
  {
    date: "2024-12-22",
    asset: "Elevator System (RH-ELV-001)",
    action: "Safety Inspection",
    cost: 300,
    status: "Completed",
  },
  {
    date: "2024-12-21",
    asset: "Fire Safety System (RH-FS-001)",
    action: "System Check",
    cost: 200,
    status: "Pending",
  },
]

const mockChartData: ChartData = {
  totalAssets: 156,
  maintenanceCosts: [
    { month: "Jul", cost: 2400 },
    { month: "Aug", cost: 1800 },
    { month: "Sep", cost: 3200 },
    { month: "Oct", cost: 2800 },
    { month: "Nov", cost: 3600 },
    { month: "Dec", cost: 2200 },
  ],
  taskCompletion: [
    { month: "Jul", completed: 45, total: 50, rate: 90 },
    { month: "Aug", completed: 38, total: 42, rate: 90.5 },
    { month: "Sep", completed: 52, total: 58, rate: 89.7 },
    { month: "Oct", completed: 48, total: 52, rate: 92.3 },
    { month: "Nov", completed: 55, total: 60, rate: 91.7 },
    { month: "Dec", completed: 42, total: 45, rate: 93.3 },
  ],
}

const assetCategoryData = [
  { name: "Electronics", value: 45, color: "#10b981" },
  { name: "Furniture", value: 38, color: "#f59e0b" },
  { name: "HVAC Systems", value: 28, color: "#3b82f6" },
  { name: "Kitchen Equipment", value: 25, color: "#ef4444" },
  { name: "Safety Systems", value: 20, color: "#8b5cf6" },
]

// Async placeholder functions
const getReports = async (startDate?: string, endDate?: string): Promise<ReportData[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let filteredData = mockReportData

  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    filteredData = mockReportData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= start && itemDate <= end
    })
  }

  return filteredData
}

const exportToCSV = async (data: ReportData[]): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const csvContent = [
    "Date,Asset,Action,Cost,Status",
    ...data.map((item) => `"${item.date}","${item.asset}","${item.action}","$${item.cost}","${item.status}"`),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `reports-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportToPDF = async (data: ReportData[]): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    // Add header
    doc.setFontSize(20)
    doc.text("Ramayana Hotel Makassar", 20, 20)
    doc.setFontSize(16)
    doc.text("Asset Management Report", 20, 30)
    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40)

    // Add data
    let yPosition = 60
    doc.setFontSize(10)
    doc.text("Date | Asset | Action | Cost | Status", 20, yPosition)
    yPosition += 10

    data.forEach((item) => {
      const line = `${item.date} | ${item.asset} | ${item.action} | $${item.cost} | ${item.status}`
      doc.text(line, 20, yPosition)
      yPosition += 8
      if (yPosition > 280) {
        doc.addPage()
        yPosition = 20
      }
    })

    doc.save(`reports-${new Date().toISOString().split("T")[0]}.pdf`)
  } catch (error) {
    throw new Error("Failed to generate PDF")
  }
}

export default function ReportsDashboardPage() {
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [chartData, setChartData] = useState<ChartData>(mockChartData)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  // Load initial data
  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setIsLoading(true)
    try {
      const data = await getReports(startDate, endDate)
      setReportData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateFilter = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    await loadReports()
    toast({
      title: "Filter applied",
      description: `Showing data from ${startDate} to ${endDate}`,
    })
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      await exportToCSV(reportData)
      toast({
        title: "Export successful",
        description: "CSV file has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export CSV file",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(reportData)
      toast({
        title: "Export successful",
        description: "PDF file has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export PDF file",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "in progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <MainLayout title="Reports Dashboard">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reports Dashboard</h2>
              <p className="text-gray-600">Asset management analytics and reports</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV} disabled={isExporting || reportData.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF} disabled={isExporting || reportData.length === 0}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Assets */}
            <Card className="glass-card border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Total Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">{chartData.totalAssets}</div>
                <div className="text-sm text-gray-600">Active assets in system</div>
                <div className="mt-4">
                  <ChartContainer
                    config={{
                      electronics: { label: "Electronics", color: "#10b981" },
                      furniture: { label: "Furniture", color: "#f59e0b" },
                      hvac: { label: "HVAC", color: "#3b82f6" },
                      kitchen: { label: "Kitchen", color: "#ef4444" },
                      safety: { label: "Safety", color: "#8b5cf6" },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {assetCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Cost */}
            <Card className="glass-card border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  Maintenance Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {formatCurrency(
                    chartData.maintenanceCosts.reduce((sum, item) => sum + item.cost, 0) /
                      chartData.maintenanceCosts.length,
                  )}
                </div>
                <div className="text-sm text-gray-600">Average monthly cost</div>
                <div className="mt-4">
                  <ChartContainer
                    config={{
                      cost: { label: "Cost", color: "#f59e0b" },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.maintenanceCosts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="cost"
                          stroke="var(--color-cost)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-cost)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Task Completion Rate */}
            <Card className="glass-card border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-green-600" />
                  Task Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {(
                    chartData.taskCompletion.reduce((sum, item) => sum + item.rate, 0) / chartData.taskCompletion.length
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-gray-600">Average completion rate</div>
                <div className="mt-4">
                  <ChartContainer
                    config={{
                      rate: { label: "Completion Rate", color: "#10b981" },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.taskCompletion}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="rate" fill="var(--color-rate)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date Range Filter */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date Range Filter
              </CardTitle>
              <CardDescription>Filter reports by date range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <Button onClick={handleDateFilter} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Apply Filter"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Asset Activity Report</CardTitle>
              <CardDescription>
                {reportData.length} records found
                {startDate && endDate && ` • ${startDate} to ${endDate}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>{item.asset}</TableCell>
                        <TableCell>{item.action}</TableCell>
                        <TableCell>{formatCurrency(item.cost)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
