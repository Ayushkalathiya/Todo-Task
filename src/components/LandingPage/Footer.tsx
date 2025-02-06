import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
        <nav className="flex flex-wrap justify-center space-x-4">
          <Link href="#" className="text-sm hover:text-blue-600">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:text-blue-600">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:text-blue-600">
            Contact Us
          </Link>
        </nav>
        <div className="mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} TaskMaster. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

