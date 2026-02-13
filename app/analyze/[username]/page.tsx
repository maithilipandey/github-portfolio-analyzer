'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ScoreCard from '@/components/score-card'
import Insights from '@/components/insights'
import Recommendations from '@/components/recommendations'
import LanguageChart from '@/components/language-chart'
import ScoreBreakdown from '@/components/score-breakdown'
import { fetchGitHubUser, fetchGitHubRepos, analyzeGitHubProfile, AnalysisResult } from '@/lib/github-api'
import { saveAnalysis, getAnalysis } from '@/lib/db'

const colors = {
  codeQuality: 'hsl(var(--primary))',
  documentation: 'hsl(var(--secondary))',
  consistency: 'hsl(var(--accent))',
  activity: 'hsl(30 70% 65%)',
  presentation: 'hsl(280 70% 68%)',
}

export default function AnalyzePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        setError(null)

        const user = await fetchGitHubUser(decodeURIComponent(username))
        const repos = await fetchGitHubRepos(user.login)
        const result = analyzeGitHubProfile(user, repos)

        setAnalysis(result)
        saveAnalysis(result)
      } catch (err) {
        console.error('[v0] Analysis error:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to analyze GitHub profile. Please check the username and try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [username])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
        <header className="px-4 py-6 md:py-8 border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium mb-4">
              ← Back
            </Link>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-3xl animate-bounce">✨</span>
            </div>
            <p className="text-lg font-medium text-foreground">Analyzing {decodeURIComponent(username)}'s GitHub...</p>
            <p className="text-sm text-foreground/60">Getting repositories, calculating scores...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
        <header className="px-4 py-6 md:py-8 border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium mb-4">
              ← Back
            </Link>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="text-6xl">😅</div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Oops!</h2>
              <p className="text-foreground/70">{error}</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Try Another Profile
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!analysis) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Header */}
      <header className="px-4 py-6 md:py-8 border-b border-border/50 sticky top-0 bg-background/50 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
            ← Back
          </Link>
          <Link
            href="/history"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10"
          >
            📊 History
          </Link>
        </div>
      </header>

      {/* Profile Section */}
      <div className="px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
            <img
              src={analysis.avatar_url}
              alt={analysis.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-primary/20 shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {analysis.name}
              </h1>
              {analysis.bio && (
                <p className="text-foreground/70 mb-4">{analysis.bio}</p>
              )}
              <div className="flex flex-wrap gap-3">
                {analysis.stats.topLanguages.slice(0, 3).map((lang) => (
                  <span
                    key={lang.language}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                  >
                    {lang.language}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Score Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white mb-12 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium opacity-90 mb-2">GitHub Portfolio Score</p>
                <h2 className="text-5xl md:text-6xl font-bold">{analysis.scores.overall}/100</h2>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90 mb-3">Recruiter's Perspective</p>
                {analysis.scores.overall >= 80 && (
                  <p className="text-2xl font-semibold">🌟 Outstanding</p>
                )}
                {analysis.scores.overall >= 60 && analysis.scores.overall < 80 && (
                  <p className="text-2xl font-semibold">✨ Strong</p>
                )}
                {analysis.scores.overall >= 40 && analysis.scores.overall < 60 && (
                  <p className="text-2xl font-semibold">💪 Growing</p>
                )}
                {analysis.scores.overall < 40 && (
                  <p className="text-2xl font-semibold">🌱 Starting Out</p>
                )}
              </div>
            </div>
          </div>

          {/* Score Cards */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Detailed Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <ScoreCard
                label="Code Quality"
                score={analysis.scores.codeQuality}
                color={colors.codeQuality}
              />
              <ScoreCard
                label="Documentation"
                score={analysis.scores.documentation}
                color={colors.documentation}
              />
              <ScoreCard
                label="Consistency"
                score={analysis.scores.consistency}
                color={colors.consistency}
              />
              <ScoreCard
                label="Activity"
                score={analysis.scores.activity}
                color={colors.activity}
              />
              <ScoreCard
                label="Presentation"
                score={analysis.scores.presentation}
                color={colors.presentation}
              />
            </div>
            
            <ScoreBreakdown scores={analysis.scores} />
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Public Repos', value: analysis.stats.totalRepos },
              { label: 'Avg Stars', value: analysis.stats.avgStars },
              { label: 'Avg Forks', value: analysis.stats.avgForks },
              { label: 'Active Days', value: analysis.stats.activityDays },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-foreground/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Language Chart */}
          {analysis.stats.topLanguages.length > 0 && (
            <div className="mb-12">
              <LanguageChart languages={analysis.stats.topLanguages} />
            </div>
          )}

          {/* Insights */}
          <div className="mb-12">
            <Insights strengths={analysis.strengths} redFlags={analysis.redFlags} />
          </div>

          {/* Recommendations */}
          <div className="mb-12">
            <Recommendations recommendations={analysis.recommendations} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition-colors"
            >
              Analyze Another Profile
            </button>
            <Link
              href="/history"
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all text-center"
            >
              View Analysis History
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
