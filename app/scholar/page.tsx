"use client"

import Link from "next/link"
import { useAppContext } from "@/context/app-context"
import { EnhancedScholarProfileInput } from "@/components/enhanced-scholar-profile-input"
import { ErrorBanner } from "@/components/error-banner"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react"

export default function ScholarProfilePage() {
  const { state, dispatch } = useAppContext()

  const renderProgressStep = (stepNumber: number, label: string, isActive: boolean) => (
    <div className="flex items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          isActive ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
        }`}
      >
        {isActive ? <CheckCircle className="h-4 w-4" /> : stepNumber}
      </div>
      <span className={`ml-2 text-sm font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <BookOpen className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Connect Your Google Scholar Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Link your Google Scholar profile to import your publications, citations, and research interests. This helps
            us understand your academic background and suggest the most relevant projects.
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          {renderProgressStep(1, "Resume Upload", !!state.resumeData)}
          <div className={`w-12 h-0.5 ${state.resumeData ? "bg-green-300" : "bg-gray-300"}`}></div>
          {renderProgressStep(2, "Scholar Profile", true)}
          <div className="w-12 h-0.5 bg-gray-300"></div>
          {renderProgressStep(3, "Project Suggestions", !!state.resumeData && !!state.scholarData)}
        </div>

        {/* Resume Reminder */}
        {!state.resumeData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 mr-4 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Resume Required for Best Results</h3>
                <p className="text-yellow-700 mb-4">
                  Uploading your resume helps us provide better project recommendations by understanding your full academic and professional background.
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

        {/* Scholar Input */}
        <EnhancedScholarProfileInput />

        {/* Scholar Data Loaded */}
        {state.scholarData && (
          <div className="mt-12">
            <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Scholar Profile Imported
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {state.resumeData
                  ? "Your academic profile is now complete! Let's find the best project matches for you."
                  : "Nice! For even better suggestions, consider uploading your resume."}
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

        {/* Scholar Help Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-green-900 mb-3">How to Find Your Google Scholar URL</h3>
            <ol className="text-green-800 text-sm space-y-3 list-none">
              {[
                "Go to scholar.google.com",
                "Search for your name",
                "Click on your profile from results",
                "Copy the URL from your browser",
              ].map((step, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    {step.includes("scholar.google.com") ? (
                      <a
                        href="https://scholar.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline inline-flex items-center"
                      >
                        scholar.google.com
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      step
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What We Import</h3>
            <ul className="text-blue-800 text-sm space-y-2">
              {[
                "Publications and citation metrics",
                "Research interests and topics",
                "Collaboration history",
                "Academic impact indicators",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
