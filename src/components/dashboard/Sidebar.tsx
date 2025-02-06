"use client";

import {
  Briefcase,
  CheckSquare,
  Home,
  LogOut,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUserStore } from "@/store/authStore";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";



export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const user = useUserStore();
  const userName = user?.user?.name || "John Doe";

  const router = useRouter();

  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/dashboard/projects", label: "Projects", icon: Briefcase },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileSize = width < 1024;
      setIsMobile(isMobileSize);
      setIsOpen(!isMobileSize);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-30 h-16 flex items-center px-4">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Project Logo */}
          <div className="flex ml-3 items-center space-x-2">
            <CheckSquare className="text-blue-600 w-8 h-8" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              TaskMaster
            </span>
          </div>
        </div>

        {/* Navbar Right Side (Dark Mode + User Avatar) */}
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <div className="relative">
          
              <div
                className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md cursor-pointer"
                title={userName}
              >
                {userInitials}
              </div>
        
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 bottom-0 left-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800
          transition-all duration-300 ease-in-out flex flex-col
          ${isMobile ? (isOpen ? "w-64 z-50" : "w-0") : "w-64 z-20"}
          overflow-hidden
        `}
      >
        {/* Navigation Items */}
        <ul className="flex-1 space-y-2 p-2 overflow-y-auto">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="border-t dark:border-gray-800 p-2">
          <Button
           onClick={() => router.push("/auth/signin")} 
           variant='outline'
            className="flex items-center w-full p-2 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
