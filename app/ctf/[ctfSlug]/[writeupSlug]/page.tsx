import { getWriteupBySlug, getAllWriteups } from "@/lib/writeups"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Tag, User, ExternalLink } from "lucide-react"
import { MarkdownRenderer } from "@/lib/markdown"
import type { Metadata } from "next"

interface WriteupPageProps {
  params: {
    ctfSlug: string
    writeupSlug: string
  }
}

// Generate static params for all write-up combinations
export async function generateStaticParams() {
  const writeups = getAllWriteups()

  return writeups.map((writeup) => ({
    ctfSlug: writeup.ctfSlug,
    writeupSlug: writeup.slug,
  }))
}

// Generate metadata for each write-up page
export async function generateMetadata({ params }: WriteupPageProps): Promise<Metadata> {
  const writeup = getWriteupBySlug(params.ctfSlug, params.writeupSlug)

  if (!writeup) {
    return {
      title: "Write-up Not Found",
      description: "The requested write-up could not be found.",
    }
  }

  return {
    title: `${writeup.title} - ${writeup.ctf}`,
    description: writeup.description,
    keywords: [writeup.category, ...writeup.tags, "CTF", "cybersecurity", "write-up"].join(", "),
    openGraph: {
      title: `${writeup.title} - ${writeup.ctf}`,
      description: writeup.description,
      type: "article",
      publishedTime: writeup.date,
      tags: writeup.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${writeup.title} - ${writeup.ctf}`,
      description: writeup.description,
    },
  }
}

export default function WriteupPage({ params }: WriteupPageProps) {
  const writeup = getWriteupBySlug(params.ctfSlug, params.writeupSlug)

  if (!writeup) {
    notFound()
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary"
    }
  }

  // Get related write-ups (same category or tags)
  const allWriteups = getAllWriteups()
  const relatedWriteups = allWriteups
    .filter(
      (w) =>
        w.slug !== writeup.slug &&
        (w.category === writeup.category || w.tags.some((tag) => writeup.tags.includes(tag))),
    )
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm text-light-text-muted dark:text-dark-text-muted">
          <Link
            href="/"
            className="hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/ctf/${params.ctfSlug}`}
            className="hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors"
          >
            {writeup.ctf}
          </Link>
          <span>/</span>
          <span className="text-light-text-secondary dark:text-dark-text-secondary">{writeup.title}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/ctf/${params.ctfSlug}`}>
            <Button
              variant="ghost"
              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {writeup.ctf}
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={getDifficultyColor(writeup.difficulty)}>{writeup.difficulty}</Badge>
              <Badge
                variant="outline"
                className="border-light-border dark:border-dark-border text-light-text-muted dark:text-dark-text-muted"
              >
                {writeup.category}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              {writeup.title}
            </h1>

            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-6">
              {writeup.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-light-text-muted dark:text-dark-text-muted border-b border-light-border dark:border-dark-border pb-6">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{writeup.ctf}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(writeup.date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Tags */}
            {writeup.tags.length > 0 && (
              <div className="flex items-center space-x-2 mt-4">
                <Tag className="h-4 w-4 text-light-text-muted dark:text-dark-text-muted" />
                <div className="flex flex-wrap gap-2">
                  {writeup.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Content */}
          <div className="animate-slide-in">
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-8 border border-light-border dark:border-dark-border">
              {writeup.content ? (
                <MarkdownRenderer content={writeup.content} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg mb-4">
                    Content not available for this write-up.
                  </p>
                  <p className="text-light-text-muted dark:text-dark-text-muted">
                    This write-up may be in progress or the content file is missing.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Write-ups */}
          {relatedWriteups.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
                Related Write-ups
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedWriteups.map((related) => (
                  <Link
                    key={`${related.ctfSlug}-${related.slug}`}
                    href={`/ctf/${related.ctfSlug}/${related.slug}`}
                    className="block p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg hover:border-light-accent-primary dark:hover:border-dark-accent-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getDifficultyColor(related.difficulty)}>
                        {related.difficulty}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-light-text-muted dark:text-dark-text-muted" />
                    </div>
                    <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-1 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-light-text-muted dark:text-dark-text-muted line-clamp-2">
                      {related.description}
                    </p>
                    <div className="mt-2 text-xs text-light-text-muted dark:text-dark-text-muted">
                      {related.ctf} • {related.category}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
