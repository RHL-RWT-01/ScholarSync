"use client"

import { EnhancedResumeUploader } from "@/components/enhanced-resume-uploader"
import { ErrorBanner } from "@/components/error-banner"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, FileText, CheckCircle } from "lucide-react"

export default function ResumeUploadPage() {
  const { state, dispatch } = useAppContext()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Upload Your Resume</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your resume to extract your professional experience, skills, and qualifications. Our AI will analyze
            your background to match you with the most relevant research projects.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Resume Upload</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  state.resumeData ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"
                }`}
              >
                2
              </div>
              <span className={`ml-2 text-sm font-medium ${state.resumeData ? "text-blue-600" : "text-gray-500"}`}>
                Scholar Profile
              </span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  state.resumeData && state.scholarData ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"
                }`}
              >
                3
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  state.resumeData && state.scholarData ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Project Suggestions
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {state.error && <ErrorBanner message={state.error} onClose={() => dispatch({ type: "CLEAR_ERROR" })} />}

        {/* Enhanced Resume Uploader Component */}
        <EnhancedResumeUploader />

        {/* Enhanced Navigation */}
        {state.resumeData && (
          <div className="mt-12">
            <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Excellent! Your resume has been processed.</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We've successfully extracted your professional information. Next, connect your Google Scholar profile to
                complete your academic profile and get the most accurate project suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/scholar">
                  <Button size="lg" className="min-w-[200px]">
                    Connect Scholar Profile
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/suggestions">
                  <Button variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                    Skip to Suggestions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Help Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Best Results</h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Ensure your resume is up-to-date with latest experience
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Include relevant technical skills and research interests
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Use clear section headers (Education, Experience, Skills)
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Keep file size under 10MB for faster processing
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">What We Extract</h3>
            <ul className="text-purple-800 text-sm space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Personal information and contact details
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Technical skills and competencies
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Educational background and degrees
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Work experience and achievements
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
