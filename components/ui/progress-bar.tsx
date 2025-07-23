"use client"

import { useEffect, useState } from "react"

interface ProgressBarProps {
  progress: number
  className?: string
  showPercentage?: boolean
  animated?: boolean
  color?: "blue" | "green" | "purple" | "orange"
}

export function ProgressBar({
  progress,
  className = "",
  showPercentage = false,
  animated = true,
  color = "blue",
}: ProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedProgress(progress)
    }
  }, [progress, animated])

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && <span className="text-sm font-medium text-gray-700">{Math.round(animatedProgress)}%</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClasses[color]}`}
          style={{ width: `${Math.min(animatedProgress, 100)}%` }}
        />
      </div>
    </div>
  )
}
