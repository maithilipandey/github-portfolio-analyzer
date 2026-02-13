'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StoredAnalysis, getAllAnalyses, deleteAnalysis } from '@/lib/db'

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    setAnalyses(getAllAnalyses())
  }, [])

  const handleDelete = (id: string) => {
    deleteAnalysis(id)
    setAnalyses(getAllAnalyses())
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
        <header className="px-4 py-6 md:py-8 border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
              ← Back
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
          <p className="text-foreground/60">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Header */}
      <header className="px-4 py-6 md:py-8 border-b border-border/50 sticky top-0 bg-background/50 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium mb-3">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {analyses.length === 0 ? (
            <div className="text-center space-y-6 py-12">
              <div className="text-6xl">📊</div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">No analyses yet</h2>
                <p className="text-foreground/70 mb-6">
                  Start by analyzing a GitHub profile to build your history
                </p>
                <Link
                  href="/"
                  className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  Analyze Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {analyses.length} Profile{analyses.length !== 1 ? 's' : ''} Analyzed
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="bg-gradient-to-br from-white to-secondary/5 rounded-2xl p-5 border border-border/50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={analysis.avatar_url}
                            alt={analysis.name}
                            className="w-12 h-12 rounded-full border-2 border-primary/20"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {analysis.name}
                            </h3>
                            <p className="text-xs text-foreground/60">
                              {new Date(analysis.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(analysis.id)}
                          className="text-foreground/40 hover:text-destructive transition-colors text-xl"
                          title="Delete analysis"
                        >
                          ×
                        </button>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground/60">
                            Overall Score
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {analysis.scores.overall}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-primary/10 rounded-lg p-2">
                            <p className="text-foreground/60">Code Quality</p>
                            <p className="font-semibold text-primary">
                              {analysis.scores.codeQuality}
                            </p>
                          </div>
                          <div className="bg-secondary/10 rounded-lg p-2">
                            <p className="text-foreground/60">Documentation</p>
                            <p className="font-semibold text-secondary">
                              {analysis.scores.documentation}
                            </p>
                          </div>
                          <div className="bg-accent/10 rounded-lg p-2">
                            <p className="text-foreground/60">Consistency</p>
                            <p className="font-semibold text-accent">
                              {analysis.scores.consistency}
                            </p>
                          </div>
                          <div className="bg-yellow-100/50 rounded-lg p-2">
                            <p className="text-foreground/60">Activity</p>
                            <p className="font-semibold text-yellow-700">
                              {analysis.scores.activity}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/analyze/${analysis.username}`}
                        className="block w-full text-center bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2 rounded-lg hover:shadow-md transition-all"
                      >
                        View Full Analysis
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Avg Overall Score',
                    value: Math.round(
                      analyses.reduce((sum, a) => sum + a.scores.overall, 0) / analyses.length
                    ),
                    color: 'primary',
                  },
                  {
                    label: 'Total Repos Analyzed',
                    value: analyses.reduce((sum, a) => sum + a.stats.totalRepos, 0),
                    color: 'secondary',
                  },
                  {
                    label: 'Highest Score',
                    value: Math.max(...analyses.map((a) => a.scores.overall)),
                    color: 'accent',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`bg-white rounded-2xl p-6 shadow-sm border border-border/50`}
                  >
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-foreground/60 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
