"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileX, Home } from "lucide-react"

export default function WriteupNotFound() {
  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <FileX className="h-24 w-24 mx-auto text-light-text-muted dark:text-dark-text-muted mb-4" />
          <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            Write-up Not Found
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            The write-up you're looking for doesn't exist or may have been moved. This could happen if:
          </p>
          <ul className="text-left text-sm text-light-text-muted dark:text-dark-text-muted mb-6 space-y-1">
            <li>• The write-up slug is incorrect</li>
            <li>• The CTF slug is invalid</li>
            <li>• The write-up has been removed</li>
            <li>• There's a typo in the URL</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
