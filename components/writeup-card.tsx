import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag } from "lucide-react"

interface WriteupCardProps {
  title: string
  description: string
  category: string
  difficulty: string
  date: string
  tags: string[]
  slug: string
  ctfSlug: string
}

export function WriteupCard({
  title,
  description,
  category,
  difficulty,
  date,
  tags,
  slug,
  ctfSlug,
}: WriteupCardProps) {
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

  return (
    <Link href={`/ctf/${ctfSlug}/${slug}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-medium dark:hover:shadow-glow hover:-translate-y-1 bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border group-hover:border-light-accent-primary dark:group-hover:border-dark-accent-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
            <Badge
              variant="outline"
              className="border-light-border dark:border-dark-border text-light-text-muted dark:text-dark-text-muted"
            >
              {category}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-light-accent-primary dark:group-hover:text-dark-accent-primary transition-colors line-clamp-2">
            {title}
          </CardTitle>
          <CardDescription className="text-light-text-muted dark:text-dark-text-muted line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between text-sm text-light-text-muted dark:text-dark-text-muted">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-light-text-muted dark:text-dark-text-muted" />
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
