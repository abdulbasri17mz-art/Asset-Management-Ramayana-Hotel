"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"

interface MainLayoutProps {
  children: React.ReactNode
  title: string
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Navbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
