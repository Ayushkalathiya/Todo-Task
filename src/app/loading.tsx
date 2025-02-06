"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ListTodo } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

const TodoLoading = () => {
  const [progress, setProgress] = useState(0)
  const loadingSteps = [
    "Initializing workspace",
    "Syncing tasks",
    "Optimizing performance",
    "Setting up collaboration tools"
  ]
  const [currentStep, setCurrentStep] = useState(loadingSteps[0])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        const stepIndex = Math.floor(progress / 25)
        setCurrentStep(loadingSteps[stepIndex] || loadingSteps[loadingSteps.length - 1])
        setProgress(prev => prev + 25)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br 
      from-blue-100 to-indigo-200 
      dark:from-gray-900 dark:via-indigo-950 dark:to-gray-950 
      transition-all duration-500 ease-in-out"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 
          bg-white/90 dark:bg-gray-800/90 
          backdrop-blur-sm 
          rounded-xl shadow-2xl 
          border border-gray-200 dark:border-gray-700 
          max-w-md w-full"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
          className="mx-auto w-24 h-24 mb-6 flex items-center justify-center"
        >
          <ListTodo className="w-16 h-16 
            text-indigo-600 dark:text-indigo-400 
            transition-colors duration-500 
            animate-pulse" 
          />
        </motion.div>

        <h2 className="text-2xl font-bold mb-4 
          text-gray-800 dark:text-white 
          transition-colors duration-500"
        >
          Preparing Your Todo List
        </h2>

        <Progress 
          value={progress} 
          className="w-full mb-4 
            bg-gray-200 dark:bg-gray-700 
            transition-colors duration-500" 
        />

        <div className="flex items-center justify-center space-x-2 
          text-gray-600 dark:text-gray-300 
          transition-colors duration-500"
        >
          <span className="animate-pulse">{currentStep}</span>
          {progress === 100 && <CheckCircle2 className="w-5 h-5 text-green-500 animate-bounce" />}
        </div>

        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <p className="text-sm 
              text-gray-500 dark:text-gray-400 
              mb-4 
              transition-colors duration-500"
            >
              Your workspace is ready! Get organized and boost your productivity.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 
                bg-indigo-600 dark:bg-indigo-700 
                text-white 
                rounded-lg 
                hover:bg-indigo-700 dark:hover:bg-indigo-600 
                transition-all duration-300"
            >
              Start Working
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default TodoLoading