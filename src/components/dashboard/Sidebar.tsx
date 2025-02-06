"use client";

import {
  Briefcase,
  CheckSquare,
  Home,
  LogOut,
  Menu,
  X,
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
  const router = useRouter();
  const userName = user?.user?.name || "John Doe";
  const userInitials = userName.split(" ").map((name) => name[0]).join("").toUpperCase();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/dashboard/projects", label: "Projects", icon: Briefcase },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsOpen(window.innerWidth >= 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20 h-16 flex items-center px-4 shadow-sm">
        <div className="flex items-center space-x-4">
          {isMobile && !isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
            >
              <Menu size={24} />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <CheckSquare className="text-blue-600 w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              TaskMaster
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          
          <ModeToggle />
          <div className="relative group">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full cursor-pointer transform transition-transform group-hover:scale-105">
              {userInitials}
            </div>
          </div>
        </div>
      </nav>

      <aside className={`
        fixed top-0 bottom-0 left-0 bg-white dark:bg-gray-900
        transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "w-64" : "w-0"} 
        ${isMobile ? "z-50" : "z-10"}
        overflow-hidden shadow-lg
      `}>
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <CheckSquare className="text-blue-600 w-6 h-6" />
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              TaskMaster
            </span>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <ul className="flex-1 space-y-1 p-3 mt-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="p-2">
          <Button
            onClick={() => router.push("/auth/signin")}
            variant="outline"
            className="flex items-center w-full p-2 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;