import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { ModeToggle } from "../ModeToggle";

export function Header() {
  return (
    <header className="fixed w-full dark:bg-gray-900  py-4 px-6 sm:px-8 lg:px-12 bg-white z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/auth/signin" className="flex items-center space-x-2">
          <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            TaskMaster
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="#features"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Dark Mode Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
}