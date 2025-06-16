import { getAllWriteups } from "@/lib/writeups"
import { WriteupCard } from "@/components/writeup-card"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function WriteupsPage() {
  const writeups = getAllWriteups()
  const categories = [...new Set(writeups.map((w) => w.category))]
  const difficulties = [...new Set(writeups.map((w) => w.difficulty))]

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4 animate-fade-in">
            All Write-ups
          </h1>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary animate-fade-in">
            Browse all available CTF write-ups across different competitions and categories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6 border border-light-border dark:border-dark-border animate-slide-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-text-muted dark:text-dark-text-muted" />
              <Input
                placeholder="Search write-ups..."
                className="pl-10 bg-light-bg-primary dark:bg-dark-bg-primary border-light-border dark:border-dark-border"
              />
            </div>
            <Button variant="outline" className="border-light-border dark:border-dark-border">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-light-text-muted dark:text-dark-text-muted">Quick filters:</span>
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm" className="text-xs">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Write-ups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {writeups.map((writeup, index) => (
            <div
              key={`${writeup.ctfSlug}-${writeup.slug}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
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
      </div>
    </div>
  )
}
