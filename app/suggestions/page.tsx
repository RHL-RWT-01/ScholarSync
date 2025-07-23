"use client"

import { useEffect, useState } from "react"
import { EnhancedProjectSuggestionCard } from "@/components/enhanced-project-suggestion-card"
import { ErrorBanner } from "@/components/error-banner"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SkeletonCard } from "@/components/ui/skeleton"
import { useAppContext } from "@/context/app-context"
import { useToast } from "@/components/ui/toast"
import { ProjectService, type ProjectFilters } from "@/lib/services/project-service"
import { useApi } from "@/lib/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Lightbulb,
  RefreshCw,
  Filter,
  Search,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react"

export default function ProjectSuggestionsPage() {
  const { state, dispatch } = useAppContext()
  const { addToast } = useToast()
  const [filters, setFilters] = useState<ProjectFilters>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const { data: suggestionsResponse, loading, execute: fetchSuggestions } = useApi(ProjectService.getSuggestions)

  useEffect(() => {
    // Fetch suggestions when component mounts or when user data changes
    if (state.resumeData || state.scholarData) {
      fetchSuggestions(state.resumeData?.id, state.scholarData?.id, filters, page)
    }
  }, [state.resumeData, state.scholarData, filters, page, fetchSuggestions])

  // Update context when suggestions are fetched
  useEffect(() => {
    if (suggestionsResponse?.success) {
      dispatch({
        type: "SET_PROJECT_SUGGESTIONS",
        payload: suggestionsResponse.data,
      })
    }
  }, [suggestionsResponse, dispatch])

  const handleRefreshSuggestions = async () => {
    try {
      await fetchSuggestions(state.resumeData?.id, state.scholarData?.id, filters, 1)
      setPage(1)
      addToast({
        type: "success",
        title: "Suggestions Refreshed",
        description: "Found new project matches for your profile.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Refresh Failed",
        description: "Failed to refresh suggestions. Please try again.",
      })
    }
  }

  const handleFilterChange = (newFilters: Partial<ProjectFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }

  const handleBookmark = (projectId: string) => {
    addToast({
      type: "success",
      title: "Bookmark Updated",
      description: "Project bookmark status updated successfully.",
    })
  }

  const handleApply = (projectId: string) => {
    // In a real app, this would handle the application process
    addToast({
      type: "info",
      title: "Application Process",
      description: "Redirecting to application form...",
    })
  }

  const loadMore = async () => {
    if (suggestionsResponse?.hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  // Check if user has uploaded data
  const hasUserData = state.resumeData || state.scholarData
  const hasCompleteProfile = state.resumeData && state.scholarData
  const suggestions = suggestionsResponse?.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-purple-100 rounded-full p-4">
              <Lightbulb className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Project Suggestions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover research projects that match your expertise and interests. These suggestions are personalized based
            on your resume and Google Scholar profile.
          </p>
        </div>

        {/* Profile Completion Status */}
        {!hasCompleteProfile && hasUserData && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <Sparkles className="h-6 w-6 text-yellow-600 mt-0.5 mr-4 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  Complete Your Profile for Better Suggestions
                </h3>
                <p className="text-yellow-700 mb-4">
                  {!state.resumeData && !state.scholarData
                    ? "Upload your resume and connect your Google Scholar profile to get personalized project suggestions."
                    : !state.resumeData
                      ? "Upload your resume to get more accurate project matches based on your professional experience."
                      : "Connect your Google Scholar profile to include your research interests and academic background."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {!state.resumeData && (
                    <Link href="/resume">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                      >
                        Upload Resume
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  {!state.scholarData && (
                    <Link href="/scholar">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                      >
                        Connect Scholar Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {state.error && <ErrorBanner message={state.error} onClose={() => dispatch({ type: "CLEAR_ERROR" })} />}

        {/* No Data State */}
        {!hasUserData && !loading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border shadow-sm p-12 max-w-2xl mx-auto">
              <Lightbulb className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Profile Data Available</h3>
              <p className="text-gray-600 mb-8 text-lg">
                To get personalized project suggestions, please upload your resume and connect your Google Scholar
                profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/resume">
                  <Button size="lg" className="min-w-[180px]">
                    Upload Resume
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/scholar">
                  <Button variant="outline" size="lg" className="min-w-[180px] bg-transparent">
                    Connect Scholar Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        {hasUserData && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects by title, skills, or organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-transparent"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshSuggestions}
                  disabled={loading}
                  className="bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Collaboration Type</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      onChange={(e) =>
                        handleFilterChange({
                          collaborationType: e.target.value ? [e.target.value] : undefined,
                        })
                      }
                    >
                      <option value="">All Types</option>
                      <option value="Research">Research</option>
                      <option value="Industry">Industry</option>
                      <option value="Academic">Academic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      onChange={(e) =>
                        handleFilterChange({
                          difficulty: e.target.value ? [e.target.value] : undefined,
                        })
                      }
                    >
                      <option value="">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      onChange={(e) =>
                        handleFilterChange({
                          sortBy: (e.target.value as any) || "relevance",
                        })
                      }
                    >
                      <option value="relevance">Relevance</option>
                      <option value="match_score">Match Score</option>
                      <option value="date">Date Posted</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && page === 1 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Finding perfect project matches..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Project Suggestions */}
        {hasUserData && !loading && suggestions.length > 0 && (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  {suggestions.length} Projects Found
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {hasCompleteProfile
                    ? "Based on your complete profile - showing best matches first"
                    : "Based on your partial profile - complete it for better matches"}
                </p>
              </div>

              {hasCompleteProfile && (
                <div className="mt-4 sm:mt-0">
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="text-green-800 text-sm font-medium">
                      ✨ Profile Complete - Premium Matching Active
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {suggestions.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EnhancedProjectSuggestionCard project={project} onBookmark={handleBookmark} onApply={handleApply} />
                </div>
              ))}
            </div>

            {/* Load More */}
            {suggestionsResponse?.hasMore && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-transparent min-w-[200px]"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Loading More...
                    </>
                  ) : (
                    <>
                      Load More Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {hasUserData && !loading && suggestions.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border shadow-sm p-12 max-w-2xl mx-auto">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any projects matching your current criteria. Try adjusting your filters or refreshing
                the suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRefreshSuggestions} disabled={loading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Suggestions
                </Button>
                <Button variant="outline" onClick={() => setFilters({})} className="bg-transparent">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Help Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">How Project Matching Works</h3>
            <ul className="text-purple-800 text-sm space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                AI analyzes your skills, experience, and research interests
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Projects matched based on required skills and expertise level
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Scholar profile influences academic project suggestions
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Continuous learning improves future recommendations
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Better Matches</h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Keep your resume and Scholar profile up to date
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Use specific keywords in your skills and experience
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Bookmark interesting projects for future reference
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Refresh suggestions regularly for new opportunities
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
