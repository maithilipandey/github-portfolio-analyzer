'use client'

import { FC } from 'react'

interface Recommendation {
  category: string
  priority: 'high' | 'medium' | 'low'
  suggestion: string
  impact: string
}

interface RecommendationsProps {
  recommendations: Recommendation[]
}

const priorityColors = {
  high: 'bg-red-100 border-red-300 text-red-900',
  medium: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  low: 'bg-blue-100 border-blue-300 text-blue-900',
}

const priorityBadgeColors = {
  high: 'bg-destructive/20 text-destructive',
  medium: 'bg-yellow-200/40 text-yellow-700',
  low: 'bg-secondary/20 text-secondary',
}

const RecommendationCard: FC<Recommendation> = ({
  category,
  priority,
  suggestion,
  impact,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-semibold text-foreground text-sm">{category}</h4>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            priorityBadgeColors[priority]
          }`}
        >
          {priority === 'high' ? '🔥' : priority === 'medium' ? '⚡' : '💡'} {priority}
        </span>
      </div>
      <p className="text-sm text-foreground/80 mb-2">{suggestion}</p>
      <div className="text-xs text-primary font-medium flex items-center gap-1">
        <span>✓</span> Impact: {impact}
      </div>
    </div>
  )
}

const Recommendations: FC<RecommendationsProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-accent/20 shadow-sm">
        <p className="text-lg font-semibold text-foreground mb-2">Perfect Profile! 🎉</p>
        <p className="text-sm text-foreground/70">Your GitHub portfolio is looking great. Keep shipping!</p>
      </div>
    )
  }

  const highPriority = recommendations.filter((r) => r.priority === 'high')
  const mediumPriority = recommendations.filter((r) => r.priority === 'medium')
  const lowPriority = recommendations.filter((r) => r.priority === 'low')

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-foreground mb-4">Actionable Recommendations</h3>

      {highPriority.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-destructive mb-3">🔥 High Priority</h4>
          <div className="grid gap-3">
            {highPriority.map((rec, idx) => (
              <RecommendationCard key={idx} {...rec} />
            ))}
          </div>
        </div>
      )}

      {mediumPriority.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-yellow-700 mb-3">⚡ Medium Priority</h4>
          <div className="grid gap-3">
            {mediumPriority.map((rec, idx) => (
              <RecommendationCard key={idx} {...rec} />
            ))}
          </div>
        </div>
      )}

      {lowPriority.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-secondary mb-3">💡 Nice to Have</h4>
          <div className="grid gap-3">
            {lowPriority.map((rec, idx) => (
              <RecommendationCard key={idx} {...rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Recommendations
