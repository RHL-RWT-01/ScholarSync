import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Users, ExternalLink } from "lucide-react"

interface ProjectSuggestionCardProps {
  project: {
    id: string
    title: string
    description: string
    skillsRequired: string[]
    matchingReason: string
    collaborationType: "Research" | "Industry" | "Academic"
    difficulty: "Beginner" | "Intermediate" | "Advanced"
  }
}

export function ProjectSuggestionCard({ project }: ProjectSuggestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{project.title}</CardTitle>
          <div className="flex items-center space-x-2 ml-2">
            {getCollaborationIcon(project.collaborationType)}
            <span className="text-xs text-gray-500">{project.collaborationType}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getDifficultyColor(project.difficulty)}>{project.difficulty}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-1">
            {project.skillsRequired.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skillsRequired.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.skillsRequired.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Why this matches you:</h4>
          <p className="text-blue-800 text-xs">{project.matchingReason}</p>
        </div>
      </CardContent>

      <CardFooter className="flex space-x-2">
        <Button className="flex-1" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Collaborate
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <ExternalLink className="h-4 w-4 mr-2" />
          Explore
        </Button>
      </CardFooter>
    </Card>
  )
}
