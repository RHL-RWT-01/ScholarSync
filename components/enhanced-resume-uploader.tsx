"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Upload, FileText, CheckCircle, X, Eye, Download } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { LoadingSpinner } from "./loading-spinner"
import { ProgressBar } from "./ui/progress-bar"
import { AnimatedCounter } from "./ui/animated-counter"
import { useToast } from "./ui/toast"
import { ResumeService } from "@/lib/services/resume-service"
import { useApi } from "@/lib/hooks/use-api"
import { Button } from "@/components/ui/button"

interface FileWithPreview extends File {
  preview?: string
}

export function EnhancedResumeUploader() {
  const { state, dispatch } = useAppContext()
  const { addToast } = useToast()
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { loading, execute: uploadResume } = useApi(ResumeService.uploadResume)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a PDF or DOCX file"
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      return "File size must be less than 10MB"
    }

    return null
  }

  const handleFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      addToast({
        type: "error",
        title: "Invalid File",
        description: validationError,
      })
      return
    }

    setSelectedFile(file)

    // Simulate upload progress
    setUploadProgress(0)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)

    try {
      const response = await uploadResume(file)

      if (response?.success) {
        setUploadProgress(100)
        dispatch({ type: "SET_RESUME_DATA", payload: response.data })

        addToast({
          type: "success",
          title: "Resume Uploaded Successfully!",
          description: `Processed in ${response.processingTime}s. ${response.data.skills.length} skills extracted.`,
        })
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadProgress(0)
      addToast({
        type: "error",
        title: "Upload Failed",
        description: "Failed to process resume. Please try again.",
      })
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      {/* Enhanced File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? "border-blue-400 bg-blue-50 scale-105"
            : state.resumeData
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <LoadingSpinner size="lg" />
              <div>
                <p className="text-lg font-medium text-blue-700">Processing your resume...</p>
                <p className="text-sm text-blue-600">Extracting skills, experience, and education</p>
              </div>
              <div className="max-w-xs mx-auto">
                <ProgressBar progress={uploadProgress} showPercentage color="blue" />
              </div>
            </div>
          ) : state.resumeData ? (
            <div className="space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 animate-in zoom-in-50" />
              <div>
                <p className="text-xl font-semibold text-green-700">Resume processed successfully!</p>
                <p className="text-sm text-green-600">
                  <AnimatedCounter end={state.resumeData.skills.length} suffix=" skills" /> and{" "}
                  <AnimatedCounter end={state.resumeData.experience.length} suffix=" experiences" /> extracted
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={triggerFileInput} className="bg-transparent">
                Upload Different Resume
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-16 w-16 text-gray-400 transition-transform group-hover:scale-110" />
              <div>
                <p className="text-xl font-semibold text-gray-700">
                  Drop your resume here, or{" "}
                  <button onClick={triggerFileInput} className="text-blue-600 hover:text-blue-700 underline">
                    browse files
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-2">Supports PDF and DOCX files up to 10MB</p>
              </div>

              {/* File format indicators */}
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </span>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  DOCX
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Selected file preview */}
        {selectedFile && !state.resumeData && (
          <div className="absolute top-4 right-4">
            <div className="bg-white rounded-lg shadow-md p-3 flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium truncate max-w-32">{selectedFile.name}</span>
              <button onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Extracted Data Display */}
      {state.resumeData && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                Extracted Resume Data
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "Hide" : "Preview"}
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ${showPreview ? "max-h-none" : "max-h-96 overflow-hidden"}`}>
            <div className="p-6 space-y-8">
              {/* Personal Information Card */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="text-gray-900 mt-1">{state.resumeData.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900 mt-1">{state.resumeData.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-900 mt-1">{state.resumeData.phone}</p>
                  </div>
                  {state.resumeData.summary && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-600">Summary:</span>
                      <p className="text-gray-900 mt-1">{state.resumeData.summary}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills with animated tags */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Skills ({state.resumeData.skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {state.resumeData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors animate-in fade-in-50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                  Education
                </h4>
                <div className="space-y-4">
                  {state.resumeData.education.map((edu, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                        <p className="text-purple-700 text-sm">{edu.institution}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                          <span>{edu.year}</span>
                          {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Cards */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                  Work Experience
                </h4>
                <div className="space-y-4">
                  {state.resumeData.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">{exp.title}</h5>
                          <p className="text-orange-700 text-sm">{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.duration}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{exp.description}</p>
                      {exp.skills && (
                        <div className="flex flex-wrap gap-1">
                          {exp.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional sections if available */}
              {state.resumeData.certifications && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                    Certifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {state.resumeData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center p-2 bg-indigo-50 rounded">
                        <CheckCircle className="h-4 w-4 text-indigo-600 mr-2" />
                        <span className="text-sm text-indigo-900">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!showPreview && (
            <div className="px-6 pb-4">
              <button
                onClick={() => setShowPreview(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Show more details...
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
