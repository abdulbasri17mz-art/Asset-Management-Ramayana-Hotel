"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Calendar, BarChart3, FileSpreadsheet, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    jsPDF: any
  }
}

interface ReportData {
  id: string
  type: "asset-history" | "maintenance-logs"
  title: string
  generatedAt: Date
  dateRange: {
    start: Date
    end: Date
  }
  category?: string
  recordCount: number
  data: AssetHistoryRecord[] | MaintenanceLogRecord[]
}

interface AssetHistoryRecord {
  assetTag: string
  assetName: string
  category: string
  location: string
  status: string
  purchaseDate: string
  lastMaintenance?: string
  value: number
}

interface MaintenanceLogRecord {
  date: string
  assetTag: string
  assetName: string
  taskTitle: string
  assignedStaff: string
  status: string
  priority: string
  completionNotes?: string
}

// Mock data
const mockAssetHistory: AssetHistoryRecord[] = [
  {
    assetTag: "RH-TV-001",
    assetName: 'Samsung 55" Smart TV',
    category: "Electronics",
    location: "Room 101",
    status: "Active",
    purchaseDate: "2023-01-15",
    lastMaintenance: "2024-12-26",
    value: 800,
  },
  {
    assetTag: "RH-AC-002",
    assetName: "Daikin Split AC Unit",
    category: "HVAC Systems",
    location: "Room 102",
    status: "Maintenance",
    purchaseDate: "2022-08-20",
    value: 1200,
  },
  {
    assetTag: "RH-BED-003",
    assetName: "King Size Bed",
    category: "Furniture",
    location: "Room 103",
    status: "Active",
    purchaseDate: "2023-03-10",
    value: 1500,
  },
  {
    assetTag: "RH-REF-004",
    assetName: "Mini Refrigerator",
    category: "Kitchen Equipment",
    location: "Room 104",
    status: "Retired",
    purchaseDate: "2021-05-12",
    value: 300,
  },
]

const mockMaintenanceLogs: MaintenanceLogRecord[] = [
  {
    date: "2024-12-26",
    assetTag: "RH-TV-001",
    assetName: 'Samsung 55" Smart TV',
    taskTitle: "TV Software Update",
    assignedStaff: "John Smith",
    status: "Completed",
    priority: "Low",
    completionNotes: "Updated to latest firmware version. All streaming apps working properly.",
  },
  {
    date: "2024-12-25",
    assetTag: "RH-AC-002",
    assetName: "Daikin Split AC Unit",
    taskTitle: "AC Unit Servicing",
    assignedStaff: "John Smith",
    status: "Pending",
    priority: "Medium",
  },
  {
    date: "2024-12-27",
    assetTag: "RH-REF-004",
    assetName: "Mini Refrigerator",
    taskTitle: "Refrigerator Temperature Check",
    assignedStaff: "Sarah Wilson",
    status: "In Progress",
    priority: "High",
  },
]

const categories = ["All Categories", "Electronics", "Furniture", "Kitchen Equipment", "HVAC Systems"]

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [reportType, setReportType] = useState<"asset-history" | "maintenance-logs">("asset-history")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [previewData, setPreviewData] = useState<AssetHistoryRecord[] | MaintenanceLogRecord[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      let data: AssetHistoryRecord[] | MaintenanceLogRecord[]
      let filteredData: AssetHistoryRecord[] | MaintenanceLogRecord[]

      if (reportType === "asset-history") {
        data = mockAssetHistory
        filteredData =
          selectedCategory === "All Categories"
            ? data
            : (data as AssetHistoryRecord[]).filter((item) => item.category === selectedCategory)
      } else {
        data = mockMaintenanceLogs
        const start = new Date(startDate)
        const end = new Date(endDate)
        filteredData = (data as MaintenanceLogRecord[]).filter((item) => {
          const itemDate = new Date(item.date)
          const matchesDate = itemDate >= start && itemDate <= end
          const matchesCategory =
            selectedCategory === "All Categories" ||
            mockAssetHistory.find((asset) => asset.assetTag === item.assetTag)?.category === selectedCategory
          return matchesDate && matchesCategory
        })
      }

      setPreviewData(filteredData)

      // Add to reports history
      const newReport: ReportData = {
        id: Date.now().toString(),
        type: reportType,
        title: `${reportType === "asset-history" ? "Asset History" : "Maintenance Logs"} Report - ${formatDate(
          startDate,
        )} to ${formatDate(endDate)}`,
        generatedAt: new Date(),
        dateRange: {
          start: new Date(startDate),
          end: new Date(endDate),
        },
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
        recordCount: filteredData.length,
        data: filteredData,
      }

      setReports([newReport, ...reports])
      setIsGenerating(false)

      toast({
        title: "Report generated",
        description: `Found ${filteredData.length} records matching your criteria`,
      })
    }, 2000)
  }

  const handleDownloadFromHistory = async (report: ReportData, format: "pdf" | "csv") => {
    if (format === "pdf") {
      await exportToPDF(report.data, report)
    } else {
      exportToCSV(report.data, report)
    }
  }

  const handlePreviewFromHistory = (report: ReportData) => {
    setPreviewData(report.data)
    setReportType(report.type)
    setStartDate(report.dateRange.start.toISOString().split("T")[0])
    setEndDate(report.dateRange.end.toISOString().split("T")[0])
    if (report.category) {
      setSelectedCategory(report.category)
    }

    toast({
      title: "Report loaded",
      description: "Report data has been loaded in preview section",
    })
  }

  const exportToPDF = async (data: AssetHistoryRecord[] | MaintenanceLogRecord[], report?: ReportData) => {
    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Add header
      doc.setFontSize(20)
      doc.text("Ramayana Hotel Makassar", 20, 20)
      doc.setFontSize(16)
      const reportTitle = report
        ? report.title
        : `${reportType === "asset-history" ? "Asset History Report" : "Maintenance Logs Report"}`
      doc.text(reportTitle, 20, 30)
      doc.setFontSize(12)
      doc.text(`Generated on: ${formatDate(new Date())}`, 20, 40)

      const dateRange = report
        ? `${formatDate(report.dateRange.start)} - ${formatDate(report.dateRange.end)}`
        : `${formatDate(startDate)} - ${formatDate(endDate)}`
      doc.text(`Date Range: ${dateRange}`, 20, 50)

      // Add data as text (simplified approach)
      let yPosition = 70
      doc.setFontSize(10)

      const currentReportType = report ? report.type : reportType
      if (currentReportType === "asset-history") {
        const assetData = data as AssetHistoryRecord[]
        doc.text("Asset Tag | Name | Category | Location | Status | Purchase Date | Value", 20, yPosition)
        yPosition += 10

        assetData.forEach((item) => {
          const line = `${item.assetTag} | ${item.assetName} | ${item.category} | ${item.location} | ${item.status} | ${formatDate(item.purchaseDate)} | $${item.value.toLocaleString()}`
          doc.text(line, 20, yPosition)
          yPosition += 8
          if (yPosition > 280) {
            doc.addPage()
            yPosition = 20
          }
        })
      } else {
        const maintenanceData = data as MaintenanceLogRecord[]
        doc.text("Date | Asset Tag | Asset Name | Task | Staff | Status | Priority", 20, yPosition)
        yPosition += 10

        maintenanceData.forEach((item) => {
          const line = `${formatDate(item.date)} | ${item.assetTag} | ${item.assetName} | ${item.taskTitle} | ${item.assignedStaff} | ${item.status} | ${item.priority}`
          doc.text(line, 20, yPosition)
          yPosition += 8
          if (yPosition > 280) {
            doc.addPage()
            yPosition = 20
          }
        })
      }

      const fileName = report
        ? `${report.type}-report-${report.id}.pdf`
        : `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)

      toast({
        title: "PDF exported",
        description: "Report has been downloaded as PDF",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = (data: AssetHistoryRecord[] | MaintenanceLogRecord[], report?: ReportData) => {
    try {
      let csvContent = ""
      const currentReportType = report ? report.type : reportType

      if (currentReportType === "asset-history") {
        const assetData = data as AssetHistoryRecord[]
        csvContent = "Asset Tag,Name,Category,Location,Status,Purchase Date,Value\n"
        assetData.forEach((item) => {
          csvContent += `"${item.assetTag}","${item.assetName}","${item.category}","${item.location}","${item.status}","${formatDate(item.purchaseDate)}","$${item.value.toLocaleString()}"\n`
        })
      } else {
        const maintenanceData = data as MaintenanceLogRecord[]
        csvContent = "Date,Asset Tag,Asset Name,Task,Staff,Status,Priority\n"
        maintenanceData.forEach((item) => {
          csvContent += `"${formatDate(item.date)}","${item.assetTag}","${item.assetName}","${item.taskTitle}","${item.assignedStaff}","${item.status}","${item.priority}"\n`
        })
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)

      const fileName = report
        ? `${report.type}-report-${report.id}.csv`
        : `${reportType}-report-${new Date().toISOString().split("T")[0]}.csv`
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "CSV exported",
        description: "Report has been downloaded as CSV file",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "maintenance":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Maintenance</Badge>
      case "retired":
        return <Badge variant="outline">Retired</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending</Badge>
      case "in progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <MainLayout title="Reports & Export">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reports & Export</h2>
              <p className="text-gray-600">Generate and export asset and maintenance reports</p>
            </div>
          </div>

          {/* Report Generation */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Generate New Report
              </CardTitle>
              <CardDescription>Configure and generate custom reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset-history">Asset History</SelectItem>
                      <SelectItem value="maintenance-logs">Maintenance Logs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isGenerating ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          {previewData && (
            <Card className="glass-card border-0 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Report Preview</CardTitle>
                    <CardDescription>
                      {previewData.length} records found •{" "}
                      {reportType === "asset-history" ? "Asset History" : "Maintenance Logs"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportToPDF(previewData)}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportToCSV(previewData)}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {reportType === "asset-history" ? (
                          <>
                            <TableHead>Asset Tag</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Purchase Date</TableHead>
                            <TableHead>Value</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>Date</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportType === "asset-history"
                        ? (previewData as AssetHistoryRecord[]).map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.assetTag}</TableCell>
                              <TableCell>{item.assetName}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.location}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                              <TableCell>${item.value.toLocaleString()}</TableCell>
                            </TableRow>
                          ))
                        : (previewData as MaintenanceLogRecord[]).map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{formatDate(item.date)}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.assetName}</p>
                                  <p className="text-sm text-gray-500">{item.assetTag}</p>
                                </div>
                              </TableCell>
                              <TableCell>{item.taskTitle}</TableCell>
                              <TableCell>{item.assignedStaff}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports History */}
          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Recent Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No reports generated yet</p>
                  <p className="text-sm">Generate your first report using the form above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <Badge variant="outline">
                            {report.type === "asset-history" ? "Asset History" : "Maintenance Logs"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Generated {formatDateTime(report.generatedAt)}
                          </span>
                          <span>•</span>
                          <span>{report.recordCount} records</span>
                          {report.category && (
                            <>
                              <span>•</span>
                              <span>{report.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewFromHistory(report)}
                          title="Preview Report"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadFromHistory(report, "pdf")}
                          title="Download PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadFromHistory(report, "csv")}
                          title="Download CSV"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
