export interface GitHubUser {
  login: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  avatar_url: string
  company: string | null
  location: string | null
  blog: string | null
}

export interface GitHubRepo {
  name: string
  description: string | null
  url: string
  stars: number
  language: string | null
  forks: number
  open_issues: number
  created_at: string
  updated_at: string
  size: number
  topics: string[]
}

export interface AnalysisResult {
  username: string
  avatar_url: string
  name: string
  bio: string
  scores: {
    codeQuality: number
    documentation: number
    consistency: number
    activity: number
    presentation: number
    overall: number
  }
  strengths: string[]
  redFlags: string[]
  recommendations: Array<{
    category: string
    priority: 'high' | 'medium' | 'low'
    suggestion: string
    impact: string
  }>
  stats: {
    totalRepos: number
    topLanguages: Array<{ language: string; count: number }>
    avgStars: number
    avgForks: number
    activityDays: number
  }
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`)
  
  if (!response.ok) {
    throw new Error(`User not found: ${username}`)
  }
  
  return response.json()
}

export async function fetchGitHubRepos(
  username: string,
  perPage: number = 100
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    )

    if (!response.ok) break

    const data = await response.json()
    if (data.length === 0) {
      hasMore = false
      break
    }

    repos.push(...data)
    page++
  }

  return repos
}

export function analyzeGitHubProfile(
  user: GitHubUser,
  repos: GitHubRepo[]
): AnalysisResult {
  // Calculate scores
  const codeQualityScore = calculateCodeQuality(repos)
  const documentationScore = calculateDocumentation(repos)
  const consistencyScore = calculateConsistency(repos)
  const activityScore = calculateActivity(repos)
  const presentationScore = calculatePresentation(user, repos)
  const overallScore = Math.round(
    (codeQualityScore +
      documentationScore +
      consistencyScore +
      activityScore +
      presentationScore) /
      5
  )

  // Get insights
  const strengths = getStrengths(user, repos, {
    codeQualityScore,
    documentationScore,
    consistencyScore,
    activityScore,
    presentationScore,
  })

  const redFlags = getRedFlags(user, repos, {
    codeQualityScore,
    documentationScore,
    consistencyScore,
    activityScore,
    presentationScore,
  })

  const recommendations = getRecommendations(user, repos, {
    codeQualityScore,
    documentationScore,
    consistencyScore,
    activityScore,
    presentationScore,
  })

  const stats = {
    totalRepos: repos.length,
    topLanguages: getTopLanguages(repos),
    avgStars: repos.length > 0 ? Math.round(repos.reduce((sum, r) => sum + r.stars, 0) / repos.length) : 0,
    avgForks: repos.length > 0 ? Math.round(repos.reduce((sum, r) => sum + r.forks, 0) / repos.length) : 0,
    activityDays: calculateActivityDays(repos),
  }

  return {
    username: user.login,
    avatar_url: user.avatar_url,
    name: user.name || user.login,
    bio: user.bio || '',
    scores: {
      codeQuality: codeQualityScore,
      documentation: documentationScore,
      consistency: consistencyScore,
      activity: activityScore,
      presentation: presentationScore,
      overall: overallScore,
    },
    strengths,
    redFlags,
    recommendations,
    stats,
  }
}

function calculateCodeQuality(repos: GitHubRepo[]): number {
  if (repos.length === 0) return 0

  let score = 50
  const reposWithLanguage = repos.filter((r) => r.language)
  const languageVariety = new Set(reposWithLanguage.map((r) => r.language)).size

  // Bonus for language diversity
  score += Math.min(languageVariety * 5, 20)

  // Bonus for avg stars
  const avgStars = repos.reduce((sum, r) => sum + r.stars, 0) / repos.length
  score += Math.min(avgStars * 2, 15)

  // Penalty for high issue count
  const avgIssues = repos.reduce((sum, r) => sum + r.open_issues, 0) / repos.length
  score -= Math.min(avgIssues, 10)

  return Math.max(0, Math.min(100, score))
}

function calculateDocumentation(repos: GitHubRepo[]): number {
  if (repos.length === 0) return 0

  let score = 40
  const reposWithDesc = repos.filter((r) => r.description).length
  score += (reposWithDesc / repos.length) * 30

  const reposWithTopics = repos.filter((r) => r.topics && r.topics.length > 0).length
  score += (reposWithTopics / repos.length) * 20

  const reposWithREADME = repos.filter((r) => r.description && r.description.length > 20).length
  score += (reposWithREADME / repos.length) * 10

  return Math.min(100, score)
}

function calculateConsistency(repos: GitHubRepo[]): number {
  if (repos.length === 0) return 0

  const languages = repos.map((r) => r.language).filter(Boolean)
  if (languages.length === 0) return 30

  const languageCounts = languages.reduce(
    (acc, lang) => {
      acc[lang as string] = (acc[lang as string] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const counts = Object.values(languageCounts)
  const mostCommon = Math.max(...counts)
  const consistency = (mostCommon / languages.length) * 100

  return Math.min(100, consistency * 0.8 + 20)
}

function calculateActivity(repos: GitHubRepo[]): number {
  if (repos.length === 0) return 0

  const now = new Date()
  let score = 0

  const recentActivity = repos.filter((r) => {
    const days = (now.getTime() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    return days < 30
  }).length

  score += (recentActivity / repos.length) * 40

  const averageSize = repos.reduce((sum, r) => sum + r.size, 0) / repos.length
  score += Math.min((averageSize / 1000) * 20, 30)

  const forkedRepos = repos.filter((r) => r.forks > 0).length
  score += (forkedRepos / repos.length) * 30

  return Math.min(100, score)
}

function calculatePresentation(user: GitHubUser, repos: GitHubRepo[]): number {
  let score = 40

  if (user.name) score += 10
  if (user.bio && user.bio.length > 10) score += 15
  if (user.blog) score += 10
  if (user.location) score += 5

  const reposWithDesc = repos.filter((r) => r.description).length
  score += (reposWithDesc / Math.max(repos.length, 1)) * 20

  return Math.min(100, score)
}

function getStrengths(
  user: GitHubUser,
  repos: GitHubRepo[],
  scores: Record<string, number>
): string[] {
  const strengths: string[] = []

  if (scores.activityScore > 70) strengths.push('Active contributor with recent updates')
  if (scores.codeQualityScore > 70) strengths.push('Well-starred projects showing code quality')
  if (scores.documentationScore > 70) strengths.push('Great repository documentation and descriptions')
  if (scores.consistencyScore > 70) strengths.push('Consistent technology stack focus')
  if (scores.presentationScore > 70) strengths.push('Professional profile with complete information')
  if (user.followers > 50) strengths.push('Strong community following')
  if (repos.length > 20) strengths.push('Prolific developer with many projects')
  if (repos.some((r) => r.stars > 100)) strengths.push('Repository with significant community recognition')

  return strengths.slice(0, 4)
}

function getRedFlags(
  user: GitHubUser,
  repos: GitHubRepo[],
  scores: Record<string, number>
): string[] {
  const flags: string[] = []

  if (repos.length === 0) flags.push('No public repositories found')
  if (scores.activityScore < 30) flags.push('Limited recent activity')
  if (scores.documentationScore < 30) flags.push('Most repositories lack descriptions')
  if (scores.codeQualityScore < 30) flags.push('Low engagement on repositories')
  if (repos.filter((r) => r.description).length < repos.length * 0.3)
    flags.push('Missing documentation on repositories')
  if (!user.name) flags.push('No name set on profile')
  if (!user.bio) flags.push('No bio or professional description')
  if (repos.length < 3) flags.push('Very few public repositories to evaluate')

  return flags.slice(0, 4)
}

function getRecommendations(
  user: GitHubUser,
  repos: GitHubRepo[],
  scores: Record<string, number>
): Array<{ category: string; priority: 'high' | 'medium' | 'low'; suggestion: string; impact: string }> {
  const recommendations: Array<{ category: string; priority: 'high' | 'medium' | 'low'; suggestion: string; impact: string }> = []

  if (scores.documentationScore < 50) {
    recommendations.push({
      category: 'Documentation',
      priority: 'high',
      suggestion: 'Add comprehensive descriptions to all repositories',
      impact: 'Recruiters can quickly understand your projects',
    })
  }

  if (scores.presentationScore < 50) {
    recommendations.push({
      category: 'Profile',
      priority: 'high',
      suggestion: 'Add a professional bio and update your profile picture',
      impact: 'Creates a strong first impression',
    })
  }

  if (scores.activityScore < 50) {
    recommendations.push({
      category: 'Activity',
      priority: 'high',
      suggestion: 'Contribute more frequently to repositories',
      impact: 'Shows ongoing engagement and expertise',
    })
  }

  if (scores.codeQualityScore < 50) {
    recommendations.push({
      category: 'Code Quality',
      priority: 'medium',
      suggestion: 'Focus on quality over quantity - star less is more',
      impact: 'Better demonstrates your best work',
    })
  }

  if (scores.consistencyScore < 50) {
    recommendations.push({
      category: 'Consistency',
      priority: 'medium',
      suggestion: 'Develop deeper expertise in 2-3 programming languages',
      impact: 'Shows specialized knowledge to recruiters',
    })
  }

  const reposWithoutLanguage = repos.filter((r) => !r.language).length
  if (reposWithoutLanguage > repos.length * 0.3) {
    recommendations.push({
      category: 'Best Practices',
      priority: 'medium',
      suggestion: 'Ensure projects have proper language tags',
      impact: 'Helps recruiters identify your technical skills',
    })
  }

  return recommendations.slice(0, 5)
}

function getTopLanguages(repos: GitHubRepo[]): Array<{ language: string; count: number }> {
  const languages = repos
    .filter((r) => r.language)
    .reduce(
      (acc, repo) => {
        acc[repo.language as string] = (acc[repo.language as string] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

  return Object.entries(languages)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function calculateActivityDays(repos: GitHubRepo[]): number {
  if (repos.length === 0) return 0

  const now = new Date()
  const oldest = new Date(repos[repos.length - 1]?.created_at || now)
  const days = Math.floor((now.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24))

  return Math.max(days, 0)
}
