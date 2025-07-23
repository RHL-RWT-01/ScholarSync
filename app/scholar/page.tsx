"use client"

import { EnhancedScholarProfileInput } from "@/components/enhanced-scholar-profile-input"
import { ErrorBanner } from "@/components/error-banner"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"

export default function ScholarProfilePage() {
  const { state, dispatch } = useAppContext()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <BookOpen className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Connect Your Google Scholar Profile</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Link your Google Scholar profile to import your publications, citations, and research interests. This helps
            us understand your academic background and suggest the most relevant projects.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  state.resumeData ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
                }`}
              >
                {state.resumeData ? <CheckCircle className="h-4 w-4" /> : "1"}
              </div>
              <span className={`ml-2 text-sm font-medium ${state.resumeData ? "text-green-600" : "text-gray-500"}`}>
                Resume Upload
              </span>
            </div>
            <div className={`w-12 h-0.5 ${state.resumeData ? "bg-green-300" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Scholar Profile</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  state.resumeData && state.scholarData ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
                }`}
              >
                3
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  state.resumeData && state.scholarData ? "text-green-600" : "text-gray-500"
                }`}
              >
                Project Suggestions
              </span>
            </div>
          </div>
        </div>

        {/* Resume Check */}
        {!state.resumeData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 mr-4 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Resume Required for Best Results</h3>
                <p className="text-yellow-700 mb-4">
                  While you can connect your Scholar profile independently, uploading your resume first will help us
                  provide more accurate and personalized project suggestions.
                </p>
                <Link href="/resume">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  >
                    Upload Resume First
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {state.error && <ErrorBanner message={state.error} onClose={() => dispatch({ type: "CLEAR_ERROR" })} />}

        {/* Enhanced Scholar Profile Input Component */}
        <EnhancedScholarProfileInput />

        {/* Enhanced Navigation */}
        {state.scholarData && (
          <div className="mt-12">
            <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Perfect! Your Scholar profile has been imported.
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {state.resumeData
                  ? "Your profile is now complete! Let's find research projects that match your expertise and interests."
                  : "Great start! For the most accurate suggestions, consider uploading your resume as well."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/suggestions">
                  <Button size="lg" className="min-w-[200px]">
                    View Project Suggestions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {!state.resumeData && (
                  <Link href="/resume">
                    <Button variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                      Upload Resume Too
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Help Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-green-900 mb-3">How to Find Your Google Scholar URL</h3>
            <ol className="text-green-800 text-sm space-y-3 list-none">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                  1
                </span>
                <div>
                  Go to{" "}
                  <a
                    href="https://scholar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline inline-flex items-center"
                  >
                    scholar.google.com
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                  2
                </span>
                Search for your name in the search bar
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                  3
                </span>
                Click on your profile from the search results
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                  4
                </span>
                Copy the URL from your browser's address bar
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What We Import</h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Publications and citation metrics
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Research interests and topics
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Collaboration history
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Academic impact indicators
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
