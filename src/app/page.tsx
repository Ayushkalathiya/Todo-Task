import { Header } from "@/components/LandingPage/Heading"
import { Hero }  from "@/components/LandingPage/Hero"
import { Features } from "@/components/LandingPage/Features"
import  CTA   from "@/components/LandingPage/CTA"
import { Footer } from "@/components/LandingPage/Footer"

export default function Home() {
  
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black">
      <Header />
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2">

      <main className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </main>
      </div>
      <Footer />
    </div>
  )
}