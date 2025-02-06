import { CheckCircle, Clock, Users, Zap } from "lucide-react"

const features = [
  {
    name: "Easy Task Management",
    description: "Create, organize, and prioritize your tasks with just a few clicks.",
    icon: CheckCircle,
  },
  {
    name: "Collaborative Workspaces",
    description: "Share lists and collaborate with friends, family, or colleagues.",
    icon: Users,
  },
  {
    name: "Smart Reminders",
    description: "Never miss a deadline with our intelligent reminder system.",
    icon: Clock,
  },
  {
    name: "Lightning Fast",
    description: "Enjoy a seamless and responsive experience across all your devices.",
    icon: Zap,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TaskMaster?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

