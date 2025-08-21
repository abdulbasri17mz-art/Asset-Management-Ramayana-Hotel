"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Printer } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface Asset {
  id: string
  assetTag: string
  name: string
  category: string
  location: string
  status: "active" | "maintenance" | "retired"
  purchaseDate: string
  value: number
  description?: string
}

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset
}

export function QRCodeModal({ isOpen, onClose, asset }: QRCodeModalProps) {
  const qrData = JSON.stringify({
    id: asset.id,
    assetTag: asset.assetTag,
    name: asset.name,
    location: asset.location,
  })

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `${asset.assetTag}-qr-code.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }

      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${asset.assetTag}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px; 
              }
              .qr-container { 
                display: inline-block; 
                border: 2px solid #000; 
                padding: 20px; 
                margin: 20px; 
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>${asset.name}</h2>
              <p><strong>Asset Tag:</strong> ${asset.assetTag}</p>
              <p><strong>Location:</strong> ${asset.location}</p>
              <div id="qr-code"></div>
            </div>
          </body>
        </html>
      `)

      // Add QR code to print window
      const qrElement = printWindow.document.getElementById("qr-code")
      if (qrElement) {
        qrElement.innerHTML = document.getElementById("qr-code-svg")?.outerHTML || ""
      }

      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-0 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Asset QR Code</DialogTitle>
          <DialogDescription>
            QR code for {asset.name} ({asset.assetTag})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <QRCodeSVG id="qr-code-svg" value={qrData} size={200} level="M" includeMargin={true} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold text-gray-900">{asset.name}</h3>
            <p className="text-sm text-gray-600">Asset Tag: {asset.assetTag}</p>
            <p className="text-sm text-gray-600">Location: {asset.location}</p>
          </div>

          <div className="flex justify-center space-x-3">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
