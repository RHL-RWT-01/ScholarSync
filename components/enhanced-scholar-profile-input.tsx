"use client"

import React from "react"
import { useState } from "react"
import { Search, ExternalLink, BookOpen, Award, TrendingUp, Users, Calendar, Globe } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { LoadingSpinner } from "./loading-spinner"
import { AnimatedCounter } from "./ui/animated-counter"
import { useToast } from "./ui/toast"
import { ScholarService } from "@/lib/services/scholar-service"
import { useApi } from "@/lib/hooks/use-api"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EnhancedScholarProfileInput() {
  const { state, dispatch } = useAppContext()
  const { addToast } = useToast()
  const [profileUrl, setProfileUrl] = useState("")
  const [validationError, setValidationError] = useState("")

  const debouncedUrl = useDebounce(profileUrl, 500)
  const { loading, execute: fetchProfile } = useApi(ScholarService.fetchProfile)

  // Real-time URL validation
  React.useEffect(() => {
    if (debouncedUrl && !debouncedUrl.includes("scholar.google.com/citations")) {
      setValidationError("Please enter a valid Google Scholar profile URL")
    } else {
      setValidationError("")
    }
  }, [debouncedUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileUrl.trim()) {
      setValidationError("Please enter a Google Scholar profile URL")
      return
    }

    if (validationError) {
      return
    }

    try {
      const response = await fetchProfile(profileUrl)

      if (response?.success) {
        dispatch({ type: "SET_SCHOLAR_DATA", payload: response.data })

        addToast({
          type: "success",
          title: "Profile Imported Successfully!",
          description: `Found ${response.data.publications.length} publications and ${response.data.totalCitations} citations.`,
        })
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Import Failed",
        description: "Failed to fetch Google Scholar profile. Please check the URL and try again.",
      })
    }
  }

  const handleRefresh = async () => {
    if (state.scholarData?.id) {
      try {
        const refreshedData = await ScholarService.refreshProfile(state.scholarData.id)
        dispatch({ type: "SET_SCHOLAR_DATA", payload: refreshedData })

        addToast({
          type: "success",
          title: "Profile Refreshed",
          description: "Your Scholar profile has been updated with the latest data.",
        })
      } catch (error) {
        addToast({
          type: "error",
          title: "Refresh Failed",
          description: "Failed to refresh profile data.",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced URL Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="scholar-url" className="block text-sm font-medium text-gray-700 mb-2">
            Google Scholar Profile URL
          </label>
          <div className="relative">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  id="scholar-url"
                  type="url"
                  placeholder="https://scholar.google.com/citations?user=..."
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className={`pr-10 ${validationError ? "border-red-300 focus:border-red-500" : ""}`}
                  disabled={loading}
                />
                <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button
                type="submit"
                disabled={loading || !profileUrl.trim() || !!validationError}
                className="min-w-[120px]"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Fetch Profile
                  </>
                )}
              </Button>
            </div>

            {validationError && (
              <p className="text-red-600 text-xs mt-1 animate-in slide-in-from-top-1">{validationError}</p>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Enter your Google Scholar profile URL to import your publications and research data
            </p>
          </div>
        </div>
      </form>

      {/* Enhanced Scholar Profile Display */}
      {state.scholarData && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                Google Scholar Profile
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} className="bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <a
                  href={state.scholarData.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View on Scholar
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Profile Overview with animated metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{state.scholarData.name}</h4>
                  <p className="text-gray-600 mt-1">{state.scholarData.affiliation}</p>
                  {state.scholarData.email && <p className="text-blue-600 text-sm mt-1">{state.scholarData.email}</p>}
                </div>

                {/* Research Interests */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    Research Interests
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {state.scholarData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors animate-in fade-in-50"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Animated Citation Metrics */}
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">TOTAL</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter end={state.scholarData.totalCitations} />
                  </div>
                  <p className="text-sm text-blue-700">Citations</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 hover:bg-purple-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="text-xs text-purple-600 font-medium">H-INDEX</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    <AnimatedCounter end={state.scholarData.hIndex} />
                  </div>
                  <p className="text-sm text-purple-700">Impact Factor</p>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    <span className="text-xs text-orange-600 font-medium">i10-INDEX</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    <AnimatedCounter end={state.scholarData.i10Index} />
                  </div>
                  <p className="text-sm text-orange-700">Publications</p>
                </div>
              </div>
            </div>

            {/* Publications with enhanced cards */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                Recent Publications ({state.scholarData.publications.length})
              </h4>
              <div className="space-y-4">
                {state.scholarData.publications.map((pub, index) => (
                  <div
                    key={pub.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 animate-in slide-in-from-left-5"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900 text-sm leading-relaxed flex-1 mr-4">
                        {pub.url ? (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                          >
                            {pub.title}
                          </a>
                        ) : (
                          pub.title
                        )}
                      </h5>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{pub.year}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mb-2">{pub.authors}</p>
                    <p className="text-blue-600 text-xs mb-2 font-medium">{pub.venue}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {pub.citations} citations
                        </span>
                      </div>
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                        >
                          View Paper
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaborators */}
            {state.scholarData.coauthors && state.scholarData.coauthors.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                  Frequent Collaborators
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {state.scholarData.coauthors.slice(0, 6).map((coauthor, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-3 hover:bg-purple-100 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">{coauthor.name}</p>
                          <p className="text-xs text-gray-600 truncate">{coauthor.affiliation}</p>
                          <p className="text-xs text-purple-600">{coauthor.collaborations} collaborations</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {state.scholarData.recentActivity && state.scholarData.recentActivity.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {state.scholarData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
