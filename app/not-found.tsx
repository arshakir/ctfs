import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="mb-8">
          <AlertTriangle className="h-24 w-24 mx-auto text-light-text-muted dark:text-dark-text-muted mb-4" />
          <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
            What you can do:
          </h2>
          <ul className="text-left text-sm text-light-text-muted dark:text-dark-text-muted space-y-2">
            <li>• Check the URL for typos</li>
            <li>• Go back to the homepage</li>
            <li>• Browse available CTF write-ups</li>
            <li>• Use the search functionality</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/writeups">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Browse Write-ups
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
