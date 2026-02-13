'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    setLoading(true)
    setError('')

    try {
      router.push(`/analyze/${encodeURIComponent(username.trim())}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 md:py-8 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              ✦
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Portfolio<span className="text-primary">AI</span>
            </h1>
          </div>
          <Link
            href="/history"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10"
          >
            📊 History
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-2xl w-full text-center space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
              Analyze Your GitHub Like a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Recruiter Would
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 text-balance leading-relaxed">
              Get actionable insights on your code quality, documentation, consistency, activity patterns, and profile presentation. See what stands out to hiring managers.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your GitHub username..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError('')
                }}
                className="w-full px-6 py-4 rounded-2xl border-2 border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground bg-white transition-colors text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  '✨ Analyze'
                )}
              </button>
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium text-center">{error}</p>
            )}
          </form>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-8 md:pt-12">
            {[
              { icon: '📈', label: 'Code Quality' },
              { icon: '📚', label: 'Documentation' },
              { icon: '✅', label: 'Consistency' },
              { icon: '⚡', label: 'Activity' },
              { icon: '🎨', label: 'Presentation' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <p className="text-xs font-semibold text-foreground/70">{feature.label}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 md:pt-12 space-y-4 text-sm text-foreground/60">
            <p>✓ Real-time GitHub API analysis • Recruiter-focused insights • Actionable recommendations</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 border-t border-border/50 text-center text-sm text-foreground/60">
        <p>Analyze GitHub profiles through a recruiter's lens</p>
      </footer>
    </main>
  )
}
