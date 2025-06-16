"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism"
import remarkGfm from "remark-gfm"
import { useTheme } from "next-themes"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface MarkdownRendererProps {
  content: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'
            const codeString = String(children).replace(/\n$/, '')
            
            // Check if it's inline code by looking at the parent node
            const isInline = !className?.startsWith('language-')

            if (isInline) {
              return (
                <code className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-accent-primary dark:text-dark-accent-primary px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              )
            }

            return (
              <div className="relative group my-4">
                <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-t-lg">
                  <span className="text-sm text-gray-300 font-medium">
                    {language}
                  </span>
                  <CopyButton text={codeString} />
                </div>
                <SyntaxHighlighter
                  style={isDark ? oneDark : oneLight}
                  language={language}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            )
          },

          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4 mt-6 pb-2 border-b border-light-border dark:border-dark-border">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3 mt-6">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary mb-3 mt-5">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4 leading-relaxed">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 text-light-text-secondary dark:text-dark-text-secondary space-y-1">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 text-light-text-secondary dark:text-dark-text-secondary space-y-1">
              {children}
            </ol>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-light-accent-primary dark:border-dark-accent-primary pl-4 py-2 my-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-r">
              <div className="text-light-text-muted dark:text-dark-text-muted italic">
                {children}
              </div>
            </blockquote>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              className="text-light-accent-primary dark:text-dark-accent-primary hover:text-light-accent-secondary dark:hover:text-dark-accent-secondary underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic text-light-text-muted dark:text-dark-text-muted">
              {children}
            </em>
          ),

          hr: () => (
            <hr className="my-6 border-0 h-px bg-light-border dark:bg-dark-border" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
