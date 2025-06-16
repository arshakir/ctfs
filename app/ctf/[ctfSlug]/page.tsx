import { getCTFBySlug, getCTFs } from "@/lib/writeups"
import { WriteupCard } from "@/components/writeup-card"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, FileText, Filter, Search, SortAsc } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Metadata } from "next"

interface CTFPageProps {
  params: {
    ctfSlug: string
  }
}

// Generate static params for all CTF slugs
export async function generateStaticParams() {
  const ctfs = getCTFs()

  return ctfs.map((ctf) => ({
    slug: ctf.slug,
  }))
}

// Generate metadata for each CTF page
export async function generateMetadata({ params }: CTFPageProps): Promise<Metadata> {
  const ctf = getCTFBySlug(params.ctfSlug)

  if (!ctf) {
    return {
      title: "CTF Not Found",
      description: "The requested CTF could not be found.",
    }
  }

  return {
    title: `${ctf.name} - CTF Write-ups`,
    description: `${ctf.description}. Browse ${ctf.writeups.length} write-ups covering various cybersecurity challenges.`,
    keywords: ["CTF", "cybersecurity", "write-ups", ctf.name, ...new Set(ctf.writeups.flatMap((w) => w.tags))].join(
      ", ",
    ),
    openGraph: {
      title: `${ctf.name} - CTF Write-ups`,
      description: ctf.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${ctf.name} - CTF Write-ups`,
      description: ctf.description,
    },
  }
}

export default function CTFPage({ params }: CTFPageProps) {
  const ctf = getCTFBySlug(params.ctfSlug)

  if (!ctf) {
    notFound()
  }

  // Calculate statistics
  const categories = [...new Set(ctf.writeups.map((w) => w.category))]
  const difficulties = [...new Set(ctf.writeups.map((w) => w.difficulty))]
  const totalWriteups = ctf.writeups.length
  const lastUpdated = new Date(Math.max(...ctf.writeups.map((w) => new Date(w.date).getTime()))).toLocaleDateString()

  // Group writeups by category for better organization
  const writeupsByCategory = categories.reduce(
    (acc, category) => {
      acc[category] = ctf.writeups.filter((w) => w.category === category)
      return acc
    },
    {} as Record<string, typeof ctf.writeups>,
  )

  // Get difficulty distribution
  const difficultyStats = difficulties.map((difficulty) => ({
    difficulty,
    count: ctf.writeups.filter((w) => w.difficulty === difficulty).length,
  }))

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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Web: "🌐",
      Crypto: "🔐",
      Pwn: "💥",
      Reverse: "🔄",
      Forensics: "🔍",
      Misc: "🎯",
      OSINT: "🕵️",
      Steganography: "🖼️",
    }
    return icons[category] || "📝"
  }

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
          <span className="text-light-text-secondary dark:text-dark-text-secondary">{ctf.name}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* CTF Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4 animate-fade-in">
              {ctf.name}
            </h1>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-6 animate-fade-in max-w-3xl mx-auto">
              {ctf.description}
            </p>
          </div>

          {/* CTF Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-4 text-center animate-slide-in">
              <FileText className="h-6 w-6 mx-auto mb-2 text-light-accent-primary dark:text-dark-accent-primary" />
              <div className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {totalWriteups}
              </div>
              <div className="text-sm text-light-text-muted dark:text-dark-text-muted">
                Write-up{totalWriteups !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-4 text-center animate-slide-in">
              <div className="text-2xl mb-2">📂</div>
              <div className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {categories.length}
              </div>
              <div className="text-sm text-light-text-muted dark:text-dark-text-muted">
                Categor{categories.length !== 1 ? "ies" : "y"}
              </div>
            </div>

            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-4 text-center animate-slide-in">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-light-accent-primary dark:text-dark-accent-primary" />
              <div className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">{lastUpdated}</div>
              <div className="text-sm text-light-text-muted dark:text-dark-text-muted">Last Updated</div>
            </div>

            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-4 text-center animate-slide-in">
              <div className="flex justify-center space-x-1 mb-2">
                {difficultyStats.map((stat) => (
                  <Badge key={stat.difficulty} className={getDifficultyColor(stat.difficulty)}>
                    {stat.count}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-light-text-muted dark:text-dark-text-muted">Difficulty Spread</div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6 border border-light-border dark:border-dark-border animate-slide-in">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-text-muted dark:text-dark-text-muted" />
                  <Input
                    placeholder="Search write-ups..."
                    className="pl-10 bg-light-bg-primary dark:bg-dark-bg-primary border-light-border dark:border-dark-border"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select>
                  <SelectTrigger className="w-[140px] bg-light-bg-primary dark:bg-dark-bg-primary border-light-border dark:border-dark-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {getCategoryIcon(category)} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[130px] bg-light-bg-primary dark:bg-dark-bg-primary border-light-border dark:border-dark-border">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty.toLowerCase()}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[120px] bg-light-bg-primary dark:bg-dark-bg-primary border-light-border dark:border-dark-border">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                    <SelectItem value="difficulty-asc">Easy to Hard</SelectItem>
                    <SelectItem value="difficulty-desc">Hard to Easy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-light-text-muted dark:text-dark-text-muted self-center">
                Quick filters:
              </span>
              {categories.map((category) => (
                <Button key={category} variant="outline" size="sm" className="text-xs h-7">
                  {getCategoryIcon(category)} {category} ({writeupsByCategory[category].length})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Write-ups by Category */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <section key={category} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary flex items-center">
                  <span className="text-3xl mr-3">{getCategoryIcon(category)}</span>
                  {category}
                  <Badge
                    variant="secondary"
                    className="ml-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    {writeupsByCategory[category].length}
                  </Badge>
                </h2>

                {/* Category difficulty distribution */}
                <div className="flex space-x-1">
                  {difficulties.map((difficulty) => {
                    const count = writeupsByCategory[category].filter((w) => w.difficulty === difficulty).length
                    return count > 0 ? (
                      <Badge key={difficulty} className={getDifficultyColor(difficulty)}>
                        {difficulty}: {count}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {writeupsByCategory[category].map((writeup, index) => (
                  <div
                    key={writeup.slug}
                    className="animate-fade-in"
                    style={{ animationDelay: `${categoryIndex * 0.1 + index * 0.05}s` }}
                  >
                    <WriteupCard
                      title={writeup.title}
                      description={writeup.description}
                      category={writeup.category}
                      difficulty={writeup.difficulty}
                      date={new Date(writeup.date).toLocaleDateString()}
                      tags={writeup.tags}
                      slug={writeup.slug}
                      ctfSlug={writeup.ctfSlug}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Empty State */}
        {totalWriteups === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              No Write-ups Available
            </h3>
            <p className="text-light-text-muted dark:text-dark-text-muted mb-6">
              This CTF doesn't have any write-ups yet. Check back later for updates!
            </p>
            <Link href="/">
              <Button>Browse Other CTFs</Button>
            </Link>
          </div>
        )}

        {/* Summary Footer */}
        {totalWriteups > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                {ctf.name} Summary
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                Explore {totalWriteups} detailed write-ups across {categories.length} categories, covering various
                cybersecurity challenges and techniques.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Badge key={category} variant="outline" className="border-light-border dark:border-dark-border">
                    {getCategoryIcon(category)} {category} ({writeupsByCategory[category].length})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
