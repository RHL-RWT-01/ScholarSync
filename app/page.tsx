import Link from "next/link"
import { ArrowRight, Upload, Search, Lightbulb, Users, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect Your Career with
              <span className="text-blue-600 block">Research Opportunities</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              ScholarSync intelligently matches your professional experience and academic background with relevant
              research projects, fostering meaningful collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resume">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How ScholarSync Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to discover your next research collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Upload Your Resume</h3>
              <p className="text-gray-600">
                Upload your resume and let our AI extract your skills, experience, and expertise areas.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Connect Scholar Profile</h3>
              <p className="text-gray-600">
                Link your Google Scholar profile to showcase your research interests and publications.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Discover Projects</h3>
              <p className="text-gray-600">
                Get personalized project suggestions that match your expertise and research interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ScholarSync?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to accelerate your research career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">
                AI-powered algorithm matches your skills with relevant research opportunities.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <BookOpen className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Integration</h3>
              <p className="text-gray-600 text-sm">
                Seamlessly integrate with Google Scholar to showcase your academic profile.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Award className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Projects</h3>
              <p className="text-gray-600 text-sm">
                Access curated research projects from top institutions and organizations.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Lightbulb className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Growth</h3>
              <p className="text-gray-600 text-sm">
                Accelerate your research career through meaningful collaborations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Next Research Project?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of researchers who have discovered meaningful collaborations through ScholarSync.
          </p>
          <Link href="/resume">
            <Button size="lg" variant="secondary">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
