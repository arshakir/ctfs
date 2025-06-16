"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "./theme-switcher"
import { Shield, Home, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/writeups", label: "Write-ups", icon: BookOpen },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-light-border dark:border-dark-border bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/80 backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-light-text-primary dark:text-dark-text-primary hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors"
            >
              <Shield className="h-6 w-6" />
              <span className="font-bold text-lg">CTF Write-ups</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "text-light-accent-primary dark:text-dark-accent-primary bg-light-bg-tertiary dark:bg-dark-bg-tertiary"
                        : "text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  )
}
