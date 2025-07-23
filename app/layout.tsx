import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AppProvider } from "@/context/app-context"
import { ToastProvider } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "ScholarSync - Research Project Matching",
  description: "Connect your resume and Google Scholar profile to discover relevant research projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <ToastProvider>
          <AppProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AppProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
