import { Shield } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-t border-light-border dark:border-dark-border py-8 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-light-accent-primary dark:text-dark-accent-primary" />
            <span className="font-bold text-lg text-light-text-primary dark:text-dark-text-primary">CTF Write-ups</span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <nav className="flex space-x-6">
              <Link
                href="/"
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/writeups"
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors"
              >
                Write-ups
              </Link>
            </nav>

            <div className="text-sm text-light-text-muted dark:text-dark-text-muted">
              © {new Date().getFullYear()} CTF Write-ups. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
