# PortfolioAI - GitHub Portfolio Analyzer

A fun and interactive tool that analyzes GitHub profiles like a recruiter would. Get actionable insights on your code quality, documentation, consistency, activity patterns, and profile presentation.

## Features

### Multi-Dimensional Scoring System
- **Code Quality**: Repository stars, language diversity, and engagement metrics
- **Documentation**: README quality, descriptions, and topic tags
- **Consistency**: Technology focus and project coherence
- **Activity**: Recent updates, project scope, and community contributions
- **Presentation**: Profile completeness and professional appearance

### Recruiter's Perspective
- Identifies strengths that stand out to hiring managers
- Highlights red flags that might concern recruiters
- Provides actionable recommendations prioritized by impact

### Interactive Analytics
- Real-time GitHub API analysis of public repositories
- Tech stack distribution visualization
- Detailed score breakdowns with explanations
- Profile statistics and insights

### History & Tracking
- Store analysis history in browser (localStorage)
- Compare multiple profiles
- Track improvements over time
- Quick access to past analyses

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: React with Tailwind CSS
- **Styling**: Soft & playful pastel color scheme
- **Data**: Real GitHub API integration
- **Storage**: Browser localStorage for analysis history
- **Animations**: Smooth fade-in and transition effects

## Getting Started

1. **Enter a GitHub username** on the home page
2. **Wait for analysis** - The app fetches your public repositories and analyzes them
3. **Review your scores** - See how you measure up across 5 key dimensions
4. **Read recommendations** - Get specific, actionable ways to improve
5. **Track history** - Compare analyses over time as you improve

## Scoring Explained

Each dimension is scored from 0-100:

### Code Quality (📈)
Based on repository popularity, language diversity, and community engagement. Higher stars and more varied languages indicate stronger quality.

### Documentation (📚)
Measures README descriptions, repository documentation, and topic tags. Well-documented projects score higher.

### Consistency (✅)
Evaluates technology stack focus. Specializing in fewer languages/frameworks shows stronger consistency.

### Activity (⚡)
Tracks recent commits, repository size, and ongoing contributions. Active developers with substantial projects score higher.

### Presentation (🎨)
Assesses profile completeness: bio, profile picture, links, and repository descriptions. Complete profiles score higher.

## How It Works

1. **GitHub API**: Fetches your public profile and repository data
2. **Analysis Engine**: Calculates scores using weighted algorithms
3. **Insights**: Identifies strengths and red flags
4. **Recommendations**: Generates prioritized improvement suggestions
5. **Storage**: Saves results for future comparison

## Color Palette

- **Primary (Pink)**: #E85A9F
- **Secondary (Blue)**: #64B5F6
- **Accent (Green)**: #81C784
- **Background**: Soft lavender (#F3E8FF)
- **Neutrals**: Carefully chosen grays

## Interactive Elements

- Expandable score breakdown cards
- Real-time form validation
- Smooth animations and transitions
- Responsive design for all devices
- Loading states with feedback

## Privacy

All analysis is done in real-time using the public GitHub API. No data is sent to external servers except GitHub's official API. Analysis history is stored only in your browser's localStorage.

## Future Enhancements

- Compare multiple profiles side-by-side
- Export analysis as PDF
- GitHub API advanced filtering
- Personalized improvement roadmap
- Integration with LinkedIn
