import { AnalysisResult } from './github-api'

const DB_KEY = 'github_portfolio_analyzer_db'

export interface StoredAnalysis extends AnalysisResult {
  id: string
  timestamp: number
}

function getDatabase(): StoredAnalysis[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(DB_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveDatabase(analyses: StoredAnalysis[]): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(DB_KEY, JSON.stringify(analyses))
}

export function saveAnalysis(analysis: AnalysisResult): StoredAnalysis {
  const analyses = getDatabase()
  
  // Remove old analysis for same user if exists
  const filtered = analyses.filter(a => a.username !== analysis.username)
  
  const stored: StoredAnalysis = {
    ...analysis,
    id: `${analysis.username}_${Date.now()}`,
    timestamp: Date.now(),
  }
  
  filtered.push(stored)
  
  // Keep only last 50 analyses
  const limited = filtered.slice(-50)
  saveDatabase(limited)
  
  return stored
}

export function getAnalysis(username: string): StoredAnalysis | undefined {
  const analyses = getDatabase()
  return analyses.find(a => a.username.toLowerCase() === username.toLowerCase())
}

export function getAllAnalyses(): StoredAnalysis[] {
  return getDatabase().sort((a, b) => b.timestamp - a.timestamp)
}

export function deleteAnalysis(id: string): void {
  const analyses = getDatabase()
  const filtered = analyses.filter(a => a.id !== id)
  saveDatabase(filtered)
}

export function compareAnalyses(
  username: string,
  previousAnalysis?: StoredAnalysis
): {
  scoreChanges: Record<string, number>
  improvements: string[]
  declines: string[]
} {
  const current = getAnalysis(username)
  
  if (!current || !previousAnalysis) {
    return { scoreChanges: {}, improvements: [], declines: [] }
  }

  const scoreChanges = {
    codeQuality: current.scores.codeQuality - previousAnalysis.scores.codeQuality,
    documentation: current.scores.documentation - previousAnalysis.scores.documentation,
    consistency: current.scores.consistency - previousAnalysis.scores.consistency,
    activity: current.scores.activity - previousAnalysis.scores.activity,
    presentation: current.scores.presentation - previousAnalysis.scores.presentation,
    overall: current.scores.overall - previousAnalysis.scores.overall,
  }

  const improvements = Object.entries(scoreChanges)
    .filter(([_, change]) => change > 0)
    .map(([key, change]) => `${key} +${change}`)

  const declines = Object.entries(scoreChanges)
    .filter(([_, change]) => change < 0)
    .map(([key, change]) => `${key} ${change}`)

  return { scoreChanges, improvements, declines }
}
