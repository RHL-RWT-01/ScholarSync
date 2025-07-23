import { apiCall } from "../api"

export interface ProjectSuggestion {
  id: string
  title: string
  description: string
  longDescription?: string
  skillsRequired: string[]
  skillsPreferred?: string[]
  matchingReason: string
  matchScore: number
  collaborationType: "Research" | "Industry" | "Academic"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  commitment: string
  organization: {
    name: string
    type: string
    location: string
    website?: string
  }
  contact: {
    name: string
    email: string
    role: string
  }
  deadline?: string
  compensation?: string
  tags: string[]
  requirements: string[]
  benefits: string[]
  isBookmarked?: boolean
  applicationStatus?: "not_applied" | "applied" | "under_review" | "accepted" | "rejected"
}

export interface ProjectFilters {
  collaborationType?: string[]
  difficulty?: string[]
  skills?: string[]
  duration?: string
  location?: string
  compensation?: boolean
  sortBy?: "relevance" | "date" | "match_score"
}

export interface ProjectSuggestionsResponse {
  success: boolean
  data: ProjectSuggestion[]
  total: number
  page: number
  hasMore: boolean
  filters: {
    availableSkills: string[]
    availableOrganizations: string[]
    availableLocations: string[]
  }
}

export class ProjectService {
  static async getSuggestions(
    resumeId?: string,
    scholarId?: string,
    filters?: ProjectFilters,
    page = 1,
    limit = 12,
  ): Promise<ProjectSuggestionsResponse> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))

    const mockProjects: ProjectSuggestion[] = [
      {
        id: "proj_1",
        title: "AI-Powered Healthcare Diagnostics Platform",
        description:
          "Develop machine learning models for early disease detection using medical imaging data. This project involves creating deep learning algorithms that can analyze X-rays, MRIs, and CT scans to assist healthcare professionals in diagnosis.",
        longDescription:
          "This groundbreaking project aims to revolutionize healthcare diagnostics by leveraging cutting-edge AI technologies. You'll work with a multidisciplinary team of doctors, engineers, and researchers to develop robust machine learning models that can accurately detect diseases from medical images. The project has significant potential for real-world impact and offers opportunities for publication in top-tier journals.",
        skillsRequired: ["Machine Learning", "Python", "Deep Learning", "Medical Imaging", "TensorFlow"],
        skillsPreferred: ["Computer Vision", "PyTorch", "Medical Knowledge", "Research Experience"],
        matchingReason:
          "Your background in machine learning and healthcare AI research aligns perfectly with this project's requirements. Your publications in medical AI make you an ideal candidate.",
        matchScore: 95,
        collaborationType: "Research",
        difficulty: "Advanced",
        duration: "12-18 months",
        commitment: "20-30 hours/week",
        organization: {
          name: "Stanford Medical AI Lab",
          type: "Academic Institution",
          location: "Stanford, CA",
          website: "https://med.stanford.edu/ai",
        },
        contact: {
          name: "Dr. Jennifer Martinez",
          email: "j.martinez@stanford.edu",
          role: "Principal Investigator",
        },
        deadline: "2024-02-15",
        compensation: "Competitive stipend + publication opportunities",
        tags: ["Healthcare", "AI", "Research", "High Impact"],
        requirements: [
          "PhD in Computer Science or related field",
          "3+ years experience in machine learning",
          "Experience with medical imaging preferred",
        ],
        benefits: [
          "Work with world-class researchers",
          "Access to cutting-edge computing resources",
          "Publication opportunities in top venues",
          "Potential for patent applications",
        ],
        isBookmarked: false,
        applicationStatus: "not_applied",
      },
      {
        id: "proj_2",
        title: "Natural Language Processing for Legal Document Analysis",
        description:
          "Build NLP models to automatically analyze and categorize legal documents, extract key information, and identify potential compliance issues. The project aims to streamline legal workflows and improve efficiency.",
        longDescription:
          "Join a fast-growing legal tech startup to develop state-of-the-art NLP solutions that will transform how legal professionals work with documents. This role offers the opportunity to work on challenging technical problems while making a direct impact on the legal industry.",
        skillsRequired: ["Natural Language Processing", "Python", "Machine Learning", "Text Mining", "Legal Tech"],
        skillsPreferred: ["Transformers", "BERT", "Legal Knowledge", "API Development"],
        matchingReason:
          "Your expertise in NLP and text analysis, combined with your research background, makes you an ideal candidate for this legal technology project.",
        matchScore: 88,
        collaborationType: "Industry",
        difficulty: "Intermediate",
        duration: "6-12 months",
        commitment: "Full-time",
        organization: {
          name: "LegalAI Solutions",
          type: "Technology Startup",
          location: "San Francisco, CA (Remote OK)",
          website: "https://legalai.com",
        },
        contact: {
          name: "Sarah Chen",
          email: "sarah@legalai.com",
          role: "CTO",
        },
        deadline: "2024-01-30",
        compensation: "$120,000 - $150,000 + equity",
        tags: ["NLP", "Legal Tech", "Startup", "Remote"],
        requirements: [
          "MS/PhD in Computer Science or related field",
          "Strong background in NLP and machine learning",
          "Experience with production ML systems",
        ],
        benefits: [
          "Competitive salary and equity package",
          "Remote work flexibility",
          "Health and dental insurance",
          "Professional development budget",
        ],
        isBookmarked: true,
        applicationStatus: "not_applied",
      },
      // Add more mock projects...
    ]

    // Apply filters (simplified for demo)
    let filteredProjects = mockProjects
    if (filters?.difficulty?.length) {
      filteredProjects = filteredProjects.filter((p) => filters.difficulty!.includes(p.difficulty))
    }

    const startIndex = (page - 1) * limit
    const paginatedProjects = filteredProjects.slice(startIndex, startIndex + limit)

    return {
      success: true,
      data: paginatedProjects,
      total: filteredProjects.length,
      page,
      hasMore: startIndex + limit < filteredProjects.length,
      filters: {
        availableSkills: ["Machine Learning", "Python", "NLP", "Deep Learning"],
        availableOrganizations: ["Stanford", "MIT", "Google", "Microsoft"],
        availableLocations: ["San Francisco", "New York", "Boston", "Remote"],
      },
    }

    // Real implementation:
    // return apiCall('/projects/suggestions', {
    //   method: 'POST',
    //   body: JSON.stringify({ resumeId, scholarId, filters, page, limit })
    // })
  }

  static async getProjectById(id: string): Promise<ProjectSuggestion> {
    return apiCall(`/projects/${id}`)
  }

  static async bookmarkProject(projectId: string): Promise<void> {
    return apiCall(`/projects/${projectId}/bookmark`, { method: "POST" })
  }

  static async applyToProject(projectId: string, applicationData: any): Promise<void> {
    return apiCall(`/projects/${projectId}/apply`, {
      method: "POST",
      body: JSON.stringify(applicationData),
    })
  }
}
