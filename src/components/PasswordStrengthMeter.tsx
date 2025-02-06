"use client"

import { useEffect, useState } from "react"
import type React from "react" // Added import for React

interface PasswordStrengthMeterProps {
  password: string
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0
      if (password.length > 6) score++
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++
      if (password.match(/\d/)) score++
      if (password.match(/[^a-zA-Z\d]/)) score++
      setStrength(score)
    }

    calculateStrength()
  }, [password])

  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-blue-500"
      case 4:
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300 ease-in-out`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        {strength === 0 && "Very weak"}
        {strength === 1 && "Weak"}
        {strength === 2 && "Fair"}
        {strength === 3 && "Good"}
        {strength === 4 && "Strong"}
      </p>
    </div>
  )
}

export default PasswordStrengthMeter

