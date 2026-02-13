'use client'

import { FC, useState } from 'react'

interface ScoreBreakdownProps {
  scores: {
    codeQuality: number
    documentation: number
    consistency: number
    activity: number
    presentation: number
  }
}

const ScoreBreakdown: FC<ScoreBreakdownProps> = ({ scores }) => {
  const [expanded, setExpanded] = useState<string | null>(null)

  const breakdowns = [
    {
      key: 'codeQuality',
      name: 'Code Quality',
      icon: '📈',
      color: 'from-pink-400 to-pink-500',
      details: [
        'Repository stars and engagement',
        'Language diversity across projects',
        'Average forks per repository',
      ],
    },
    {
      key: 'documentation',
      name: 'Documentation',
      icon: '📚',
      color: 'from-blue-400 to-blue-500',
      details: [
        'README quality and completeness',
        'Repository descriptions present',
        'Topic tags and categorization',
      ],
    },
    {
      key: 'consistency',
      name: 'Consistency',
      icon: '✅',
      color: 'from-green-400 to-green-500',
      details: [
        'Focus on specific languages',
        'Project naming conventions',
        'Framework and tooling choices',
      ],
    },
    {
      key: 'activity',
      name: 'Activity',
      icon: '⚡',
      color: 'from-yellow-400 to-yellow-500',
      details: [
        'Recent commits and updates',
        'Repository size and scope',
        'Community contributions',
      ],
    },
    {
      key: 'presentation',
      name: 'Presentation',
      icon: '🎨',
      color: 'from-purple-400 to-purple-500',
      details: [
        'Profile bio and description',
        'Professional image and links',
        'Contact information available',
      ],
    },
  ]

  return (
    <div className="space-y-3">
      {breakdowns.map((item) => {
        const score = scores[item.key as keyof typeof scores]
        const isExpanded = expanded === item.key

        return (
          <div
            key={item.key}
            className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => setExpanded(isExpanded ? null : item.key)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/5 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-foreground/60">Click to see what we measure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {score}
                  </p>
                </div>
                <span
                  className={`text-foreground/40 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="px-6 py-4 bg-secondary/5 border-t border-border/30 space-y-2">
                {item.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <p className="text-sm text-foreground/70">{detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ScoreBreakdown
