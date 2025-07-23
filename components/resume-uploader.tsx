"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { LoadingSpinner } from "./loading-spinner"

export function ResumeUploader() {
  const { state, dispatch } = useAppContext()
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  // Mock resume data for demonstration
  const mockResumeData = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    skills: ["Machine Learning", "Python", "Data Analysis", "Research", "Statistics", "Deep Learning"],
    education: [
      {
        degree: "Ph.D. in Computer Science",
        institution: "Stanford University",
        year: "2020",
      },
      {
        degree: "M.S. in Data Science",
        institution: "MIT",
        year: "2016",
      },
    ],
    experience: [
      {
        title: "Senior Data Scientist",
        company: "Tech Corp",
        duration: "2020 - Present",
        description: "Led machine learning initiatives and research projects",
      },
      {
        title: "Research Assistant",
        company: "Stanford AI Lab",
        duration: "2018 - 2020",
        description: "Conducted research in natural language processing",
      },
    ],
  }

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

  const handleFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowedTypes.includes(file.type)) {
      dispatch({ type: "SET_ERROR", payload: "Please upload a PDF or DOCX file" })
      return
    }

    setUploadStatus("uploading")
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Simulate API call to extract resume data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, this would be the extracted data from the API
      dispatch({ type: "SET_RESUME_DATA", payload: mockResumeData })
      setUploadStatus("success")
    } catch (error) {
      setUploadStatus("error")
      dispatch({ type: "SET_ERROR", payload: "Failed to process resume. Please try again." })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : uploadStatus === "success"
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadStatus === "uploading"}
        />

        <div className="space-y-4">
          {uploadStatus === "uploading" ? (
            <LoadingSpinner size="lg" text="Processing your resume..." />
          ) : uploadStatus === "success" ? (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <p className="text-lg font-medium text-green-700">Resume uploaded successfully!</p>
                <p className="text-sm text-green-600">Your resume has been processed and data extracted.</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drop your resume here, or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-sm text-gray-500">Supports PDF and DOCX files up to 10MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Extracted Data Display */}
      {state.resumeData && (
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Extracted Resume Data
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {state.resumeData.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {state.resumeData.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {state.resumeData.phone}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {state.resumeData.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Education</h4>
              <div className="space-y-2">
                {state.resumeData.education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-gray-600">
                      {edu.institution} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Work Experience</h4>
              <div className="space-y-3">
                {state.resumeData.experience.map((exp, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-gray-600">
                      {exp.company} • {exp.duration}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
