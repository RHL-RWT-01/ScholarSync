import { apiCall } from "../api"

export interface ResumeData {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  education: Array<{
    degree: string
    institution: string
    year: string
    gpa?: string
  }>
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
    skills: string[]
  }>
  summary?: string
  certifications?: string[]
  languages?: string[]
}

export interface ResumeUploadResponse {
  success: boolean
  data: ResumeData
  processingTime: number
}

export class ResumeService {
  static async uploadResume(file: File): Promise<ResumeUploadResponse> {
    // Simulate API call with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Mock response - replace with actual API call
    const mockResponse: ResumeUploadResponse = {
      success: true,
      data: {
        id: `resume_${Date.now()}`,
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        summary: "Experienced data scientist with expertise in machine learning and AI research",
        skills: [
          "Machine Learning",
          "Python",
          "Data Analysis",
          "Research",
          "Statistics",
          "Deep Learning",
          "TensorFlow",
          "PyTorch",
        ],
        education: [
          {
            degree: "Ph.D. in Computer Science",
            institution: "Stanford University",
            year: "2020",
            gpa: "3.9",
          },
          {
            degree: "M.S. in Data Science",
            institution: "MIT",
            year: "2016",
            gpa: "3.8",
          },
        ],
        experience: [
          {
            title: "Senior Data Scientist",
            company: "Tech Corp",
            duration: "2020 - Present",
            description:
              "Led machine learning initiatives and research projects, developed predictive models for business intelligence",
            skills: ["Python", "Machine Learning", "Team Leadership", "Data Analysis"],
          },
          {
            title: "Research Assistant",
            company: "Stanford AI Lab",
            duration: "2018 - 2020",
            description: "Conducted research in natural language processing and published 5 peer-reviewed papers",
            skills: ["NLP", "Research", "Python", "Academic Writing"],
          },
        ],
        certifications: ["AWS Machine Learning Specialty", "Google Cloud Professional ML Engineer"],
        languages: ["English (Native)", "Spanish (Conversational)", "Python (Expert)"],
      },
      processingTime: 2.3,
    }

    return mockResponse

    // Real implementation would be:
    // return uploadFile(file, '/resume/upload')
  }

  static async getResumeById(id: string): Promise<ResumeData> {
    return apiCall(`/resume/${id}`)
  }

  static async updateResume(id: string, data: Partial<ResumeData>): Promise<ResumeData> {
    return apiCall(`/resume/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }
}
