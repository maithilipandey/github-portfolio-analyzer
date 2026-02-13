import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl">🤔</div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-foreground/70 mb-6">
            We couldn't find what you're looking for. Let's get you back on track.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
