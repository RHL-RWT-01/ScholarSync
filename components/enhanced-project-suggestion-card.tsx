"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Lightbulb,
  Users,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useToast } from "./ui/toast"
import { ProjectService } from "@/lib/services/project-service"
import type { ProjectSuggestion } from "@/lib/services/project-service"

interface ProjectSuggestionCardProps {
  project: ProjectSuggestion
  onBookmark?: (projectId: string) => void
  onApply?: (projectId: string) => void
}

export function EnhancedProjectSuggestionCard({ project, onBookmark, onApply }: ProjectSuggestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(project.isBookmarked || false)
  const [isApplying, setIsApplying] = useState(false)
  const { addToast } = useToast()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCollaborationIcon = (type: string) => {
    switch (type) {
      case "Research":
        return <Lightbulb className="h-4 w-4" />
      case "Industry":
        return <Users className="h-4 w-4" />
      case "Academic":
        return <ExternalLink className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50"
    if (score >= 75) return "text-blue-600 bg-blue-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-gray-600 bg-gray-50"
  }

  const handleBookmark = async () => {
    try {
      await ProjectService.bookmarkProject(project.id)
      setIsBookmarked(!isBookmarked)
      onBookmark?.(project.id)

      addToast({
        type: "success",
        title: isBookmarked ? "Bookmark Removed" : "Project Bookmarked",
        description: isBookmarked ? "Project removed from your bookmarks" : "Project added to your bookmarks",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Action Failed",
        description: "Failed to update bookmark. Please try again.",
      })
    }
  }

  const handleApply = async () => {
    setIsApplying(true)
    try {
      // In a real app, this would open an application modal or redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onApply?.(project.id)

      addToast({
        type: "success",
        title: "Application Started",
        description: "Redirecting to application form...",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Application Failed",
        description: "Failed to start application process.",
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </CardTitle>
          <button onClick={handleBookmark} className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-blue-600" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-400 hover:text-blue-600" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              {getCollaborationIcon(project.collaborationType)}
              <span>{project.collaborationType}</span>
            </div>
            <Badge className={getDifficultyColor(project.difficulty)}>{project.difficulty}</Badge>
          </div>

          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(project.matchScore)}`}>
            {project.matchScore}% match
          </div>
        </div>

        {/* Organization info */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {project.organization.location}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {project.duration}
          </div>
          {project.compensation && (
            <div className="flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              Paid
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-3">
        <p className="text-gray-600 text-sm line-clamp-3">
          {isExpanded ? project.longDescription || project.description : project.description}
        </p>

        {project.longDescription && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="h-3 w-3 ml-1" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </button>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-1">
            {project.skillsRequired.slice(0, isExpanded ? undefined : 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs hover:bg-blue-100 transition-colors">
                {skill}
              </Badge>
            ))}
            {!isExpanded && project.skillsRequired.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.skillsRequired.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {isExpanded && project.skillsPreferred && project.skillsPreferred.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Preferred Skills</h4>
            <div className="flex flex-wrap gap-1">
              {project.skillsPreferred.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <h4 className="text-sm font-medium text-blue-900 mb-1 flex items-center">
            <Lightbulb className="h-4 w-4 mr-1" />
            Why this matches you:
          </h4>
          <p className="text-blue-800 text-xs leading-relaxed">{project.matchingReason}</p>
        </div>

        {isExpanded && (
          <div className="space-y-3 animate-in slide-in-from-top-2">
            {project.requirements && project.requirements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {project.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.benefits && project.benefits.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {project.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Contact</h4>
              <div className="text-xs text-gray-600">
                <p className="font-medium">{project.contact.name}</p>
                <p>{project.contact.role}</p>
                <p className="text-blue-600">{project.contact.email}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex space-x-2 pt-3">
        <Button
          className="flex-1 hover:bg-blue-700 transition-colors"
          size="sm"
          onClick={handleApply}
          disabled={isApplying}
        >
          {isApplying ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Applying...
            </div>
          ) : (
            <>
              <Users className="h-4 w-4 mr-2" />
              {project.applicationStatus === "applied" ? "Applied" : "Apply Now"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {isExpanded ? "Collapse" : "Details"}
        </Button>
      </CardFooter>

      {/* Application status indicator */}
      {project.applicationStatus && project.applicationStatus !== "not_applied" && (
        <div className="absolute top-2 right-2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.applicationStatus === "applied"
                ? "bg-blue-100 text-blue-800"
                : project.applicationStatus === "under_review"
                  ? "bg-yellow-100 text-yellow-800"
                  : project.applicationStatus === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
            }`}
          >
            {project.applicationStatus.replace("_", " ")}
          </div>
        </div>
      )}
    </Card>
  )
}
