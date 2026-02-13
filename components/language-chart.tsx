'use client'

import { FC } from 'react'

interface Language {
  language: string
  count: number
}

interface LanguageChartProps {
  languages: Language[]
}

const LanguageChart: FC<LanguageChartProps> = ({ languages }) => {
  const total = languages.reduce((sum, lang) => sum + lang.count, 0)
  
  const colors = [
    'from-primary to-pink-500',
    'from-secondary to-blue-500',
    'from-accent to-green-500',
    'from-yellow-400 to-orange-500',
    'from-purple-500 to-pink-500',
  ]

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-6">Tech Stack Distribution</h3>
      
      <div className="space-y-4">
        {languages.map((lang, idx) => {
          const percentage = (lang.count / total) * 100
          
          return (
            <div key={lang.language}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{lang.language}</span>
                <span className="text-sm text-foreground/60">{lang.count} repos</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colors[idx % colors.length]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-foreground/50 mt-1">{Math.round(percentage)}%</p>
            </div>
          )
        })}
      </div>

      {languages.length === 0 && (
        <p className="text-center text-sm text-foreground/60 py-8">
          No language data available
        </p>
      )}
    </div>
  )
}

export default LanguageChart
