import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText } from "lucide-react"

interface CTFCardProps {
  name: string
  description: string
  writeupCount: number
  lastUpdated: string
  difficulty?: string
  slug: string
}

export function CTFCard({ name, description, writeupCount, lastUpdated, difficulty, slug }: CTFCardProps) {
  return (
    <Link href={`/ctf/${slug}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-medium dark:hover:shadow-glow hover:-translate-y-1 bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border group-hover:border-light-accent-primary dark:group-hover:border-dark-accent-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-light-accent-primary dark:group-hover:text-dark-accent-primary transition-colors">
              {name}
            </CardTitle>
            {difficulty && (
              <Badge
                variant="secondary"
                className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary"
              >
                {difficulty}
              </Badge>
            )}
          </div>
          <CardDescription className="text-light-text-muted dark:text-dark-text-muted">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-light-text-muted dark:text-dark-text-muted">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>
                {writeupCount} write-up{writeupCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{lastUpdated}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
