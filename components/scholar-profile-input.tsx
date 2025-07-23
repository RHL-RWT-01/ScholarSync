"use client"

import type React from "react"

import { useState } from "react"
import { Search, ExternalLink, BookOpen, Award, TrendingUp } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { LoadingSpinner } from "./loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ScholarProfileInput() {
  const { state, dispatch } = useAppContext()
  const [profileUrl, setProfileUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock scholar data for demonstration
  const mockScholarData = {
    name: "Dr. Sarah Johnson",
    affiliation: "Stanford University, Computer Science Department",
    publications: [
      {
        title: "Deep Learning Approaches for Natural Language Understanding",
        authors: "S. Johnson, M. Chen, R. Williams",
        year: "2023",
        citations: 45,
      },
      {
        title: "Machine Learning in Healthcare: A Comprehensive Survey",
        authors: "S. Johnson, A. Smith, K. Brown",
        year: "2022",
        citations: 128,
      },
      {
        title: "Ethical AI: Principles and Practices",
        authors: "S. Johnson, L. Davis",
        year: "2021",
        citations: 89,
      },
    ],
    totalCitations: 1247,
    hIndex: 18,
    topics: ["Machine Learning", "Natural Language Processing", "AI Ethics", "Healthcare AI", "Deep Learning"],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileUrl.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a Google Scholar profile URL" })
      return
    }

    // Basic URL validation
    if (!profileUrl.includes("scholar.google.com")) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a valid Google Scholar profile URL" })
      return
    }

    setIsLoading(true)
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "CLEAR_ERROR" })

    try {
      // Simulate API call to fetch scholar data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, this would be the fetched data from the API
      dispatch({ type: "SET_SCHOLAR_DATA", payload: mockScholarData })
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch Google Scholar profile. Please check the URL and try again.",
      })
    } finally {
      setIsLoading(false)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  return (
    <div className="space-y-6">
      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="scholar-url" className="block text-sm font-medium text-gray-700 mb-2">
            Google Scholar Profile URL
          </label>
          <div className="flex space-x-2">
            <Input
              id="scholar-url"
              type="url"
              placeholder="https://scholar.google.com/citations?user=..."
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !profileUrl.trim()}>
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Fetch Profile
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter your Google Scholar profile URL to import your publications and research data
          </p>
        </div>
      </form>

      {/* Scholar Profile Display */}
      {state.scholarData && (
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Google Scholar Profile
            </h3>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              View on Scholar
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>

          {/* Profile Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900 mb-2">{state.scholarData.name}</h4>
              <p className="text-gray-600 text-sm mb-4">{state.scholarData.affiliation}</p>

              {/* Research Topics */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Research Topics</h5>
                <div className="flex flex-wrap gap-2">
                  {state.scholarData.topics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Citation Metrics */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">Total Citations</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">{state.scholarData.totalCitations}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-900">h-index</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-1">{state.scholarData.hIndex}</p>
              </div>
            </div>
          </div>

          {/* Publications */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Recent Publications</h4>
            <div className="space-y-4">
              {state.scholarData.publications.map((pub, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                  <h5 className="font-medium text-gray-900 text-sm">{pub.title}</h5>
                  <p className="text-gray-600 text-xs mt-1">{pub.authors}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Year: {pub.year}</span>
                    <span>Citations: {pub.citations}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
