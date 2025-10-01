"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { VoicePlaybackButton } from "@/components/voice-playback-button"
import { Languages, Search, BookOpen, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type TranslationEntry = {
  translations: Record<string, string>
  category: string
  note?: string
  examples?: string[]
}

export default function TranslatePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("fr")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [translationDictionary, setTranslationDictionary] = useState<Record<string, TranslationEntry>>({})
  const { toast } = useToast()

  const languages = [
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
    { code: "am", name: "Amharic", nativeName: "አማርኛ" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
  ]

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoading(true)
        console.log("[v0] Fetching translations from Google Sheets...")

        // Convert Google Sheets URL to CSV export URL
        const spreadsheetId = "1SiHU-B9WsiXvkpMJMnma_pSiNSFBrBz5k_kJF2HbvKQ"
        const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`

        const response = await fetch(csvUrl)

        if (!response.ok) {
          throw new Error("Failed to fetch spreadsheet data")
        }

        const csvText = await response.text()
        console.log("[v0] CSV data fetched successfully")

        // Parse CSV
        const lines = csvText.split("\n")
        const dictionary: Record<string, TranslationEntry> = {}

        // Skip first line (header) and process data
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          // Parse CSV line (handling quoted values)
          const columns = parseCSVLine(line)

          if (columns.length >= 7) {
            const englishTerm = columns[0].trim().toLowerCase()
            const note = columns[1].trim()
            const french = columns[2].trim()
            const arabic = columns[3].trim()
            const swahili = columns[4].trim()
            const amharic = columns[5].trim()
            const portuguese = columns[6].trim()

            if (englishTerm) {
              dictionary[englishTerm] = {
                translations: {
                  fr: french,
                  ar: arabic,
                  sw: swahili,
                  am: amharic,
                  pt: portuguese,
                },
                category: "General", // Default category
                note: note || undefined,
              }
            }
          }
        }

        console.log("[v0] Parsed translations:", Object.keys(dictionary).length, "words")
        setTranslationDictionary(dictionary)

        toast({
          title: "Translations loaded",
          description: `Successfully loaded ${Object.keys(dictionary).length} words from the spreadsheet.`,
        })
      } catch (error) {
        console.error("[v0] Error fetching translations:", error)
        toast({
          title: "Error loading translations",
          description: "Failed to load translations from the spreadsheet. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranslations()
  }, [toast])

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }

    result.push(current)
    return result
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const query = searchQuery.toLowerCase()
    const results = Object.keys(translationDictionary).filter((word) => word.includes(query))
    setSearchResults(results)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Loading translations...</p>
          <p className="text-sm text-muted-foreground">Fetching data from spreadsheet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Languages className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Translation Tool</h1>
              <p className="text-sm text-muted-foreground">Search and listen to word translations</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-4 flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang.code)}
              >
                {lang.nativeName}
              </Button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for any word in English..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 pr-4 text-base"
            />
          </form>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Search Results</h2>
            {searchResults.map((word) => {
              const entry = translationDictionary[word]
              return (
                <Card key={word} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <div>
                          <h3 className="text-xl font-semibold capitalize text-foreground">{word}</h3>
                          {entry.note && <p className="text-xs text-muted-foreground mt-1">{entry.note}</p>}
                        </div>
                        <Badge variant="secondary">{entry.category}</Badge>
                        <VoicePlaybackButton text={word} language="en" />
                      </div>

                      <div className="mb-4 rounded-lg bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {languages.find((l) => l.code === selectedLanguage)?.nativeName}
                            </p>
                            <p className="text-2xl font-semibold text-foreground">
                              {entry.translations[selectedLanguage]}
                            </p>
                          </div>
                          <VoicePlaybackButton
                            text={entry.translations[selectedLanguage]}
                            language={selectedLanguage}
                            size="default"
                          />
                        </div>
                      </div>

                      {entry.examples && (
                        <div>
                          <p className="mb-2 text-sm font-medium text-muted-foreground">Examples:</p>
                          <ul className="space-y-1">
                            {entry.examples.map((example, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                                <span>•</span>
                                <span>{example}</span>
                                <VoicePlaybackButton text={example} language="en" size="sm" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          /* Popular Words */
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Popular Words</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(translationDictionary)
                .slice(0, 6)
                .map(([word, entry]) => (
                  <Card key={word} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <div>
                            <h3 className="font-semibold capitalize text-foreground">{word}</h3>
                            {entry.note && <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>}
                          </div>
                          <VoicePlaybackButton text={word} language="en" size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{entry.translations[selectedLanguage]}</p>
                          <VoicePlaybackButton
                            text={entry.translations[selectedLanguage]}
                            language={selectedLanguage}
                            size="sm"
                          />
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.category}
                      </Badge>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Quick Tip */}
        <Card className="mt-8 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Pro Tip</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Click the speaker icon next to any word to hear how it's pronounced. This helps you learn the correct
                pronunciation in different languages!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
