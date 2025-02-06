import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
  
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          Organize Your Life with <span className="text-blue-600">TaskMaster</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          The ultimate todo list app that helps you stay productive and achieve your goals.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg">
            <Link href="/auth/signin">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
    
  )
}

