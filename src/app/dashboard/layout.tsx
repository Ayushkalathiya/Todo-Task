import { Inter } from "next/font/google"
import type React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TaskMaster",
  description: "A comprehensive task management application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      <div 
        className={`
          ${inter.className} 
          bg-gray-50 dark:bg-gray-950 
          text-gray-900 dark:text-gray-100 
          antialiased
        `}
      >
        <div className="flex h-screen">
          <Sidebar />
          <main 
            className={`
              flex-1 
              overflow-y-auto 
              bg-white 
              dark:bg-gray-900 
              transition-all 
              duration-300 
              ease-in-out 
              pl-0 
              md:pl-64
              mt-16
              p-6 
              md:p-8
            `}
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
   
  )
}