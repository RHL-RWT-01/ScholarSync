"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

// Types
interface ResumeData {
  name: string
  email: string
  phone: string
  skills: string[]
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
}

export interface ScholarData {
  name: string
  affiliation: string
  publications: Array<{
    title: string
    authors: string
    year: string
    citations: number
  }>
  totalCitations: number
  hIndex: number
  topics: string[]
}

interface ProjectSuggestion {
  id: string
  title: string
  description: string
  skillsRequired: string[]
  matchingReason: string
  collaborationType: "Research" | "Industry" | "Academic"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

interface AppState {
  resumeData: ResumeData | null
  scholarData: ScholarData | null
  projectSuggestions: ProjectSuggestion[]
  isLoading: boolean
  error: string | null
}

type AppAction =
  | { type: "SET_RESUME_DATA"; payload: ResumeData }
  | { type: "SET_SCHOLAR_DATA"; payload: ScholarData }
  | { type: "SET_PROJECT_SUGGESTIONS"; payload: ProjectSuggestion[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }

const initialState: AppState = {
  resumeData: null,
  scholarData: null,
  projectSuggestions: [],
  isLoading: false,
  error: null,
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_RESUME_DATA":
      return { ...state, resumeData: action.payload }
    case "SET_SCHOLAR_DATA":
      return { ...state, scholarData: action.payload }
    case "SET_PROJECT_SUGGESTIONS":
      return { ...state, projectSuggestions: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
