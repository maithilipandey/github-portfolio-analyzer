'use client'

import { FC } from 'react'

interface InsightsProps {
  strengths: string[]
  redFlags: string[]
}

const Insights: FC<InsightsProps> = ({ strengths, redFlags }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-lg">
            ✨
          </div>
          <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
        </div>
        <div className="space-y-3">
          {strengths.length > 0 ? (
            strengths.map((strength, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="text-accent mt-1">→</div>
                <p className="text-sm text-foreground/80">{strength}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Keep building to showcase strengths!</p>
          )}
        </div>
      </div>

      {/* Red Flags */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-destructive/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-lg">
            ⚠️
          </div>
          <h3 className="text-lg font-semibold text-foreground">Areas to Improve</h3>
        </div>
        <div className="space-y-3">
          {redFlags.length > 0 ? (
            redFlags.map((flag, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="text-destructive mt-1">•</div>
                <p className="text-sm text-foreground/80">{flag}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Excellent profile! Keep it up!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Insights
