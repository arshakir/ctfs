import { CTFCard } from "@/components/ctf-card"
import { getCTFs } from "@/lib/writeups"
import { Shield, TrendingUp, Users, Award } from "lucide-react"

export default function HomePage() {
  const ctfs = getCTFs()
  const totalWriteups = ctfs.reduce((acc, ctf) => acc + ctf.writeups.length, 0)

  const stats = [
    { icon: Shield, label: "CTF Events", value: ctfs.length },
    { icon: TrendingUp, label: "Write-ups", value: totalWriteups },
    {
      icon: Users,
      label: "Categories",
      value: new Set(ctfs.flatMap((ctf) => ctf.writeups.map((w) => w.category))).size,
    },
    { icon: Award, label: "Challenges Solved", value: totalWriteups },
  ]

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
              CTF Write-ups
              <span className="block text-light-accent-primary dark:text-dark-accent-primary">Collection</span>
            </h1>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto mb-8">
              Explore detailed write-ups from various Capture The Flag competitions. Learn techniques, understand
              vulnerabilities, and improve your cybersecurity skills.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-light-bg-secondary dark:bg-dark-bg-secondary">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-lg bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="h-8 w-8 mx-auto mb-3 text-light-accent-primary dark:text-dark-accent-primary" />
                  <div className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-light-text-muted dark:text-dark-text-muted">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTF Events Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              Featured CTF Events
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              Browse write-ups organized by CTF events. Each collection contains detailed solutions and explanations for
              various challenge categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ctfs.map((ctf, index) => (
              <div key={ctf.slug} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CTFCard
                  name={ctf.name}
                  description={ctf.description}
                  writeupCount={ctf.writeups.length}
                  lastUpdated={new Date(
                    Math.max(...ctf.writeups.map((w) => new Date(w.date).getTime())),
                  ).toLocaleDateString()}
                  difficulty={ctf.difficulty}
                  slug={ctf.slug}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
