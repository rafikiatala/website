"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { VoicePlaybackButton } from "@/components/voice-playback-button"
import { useTranslation } from "@/lib/language-context"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const t = useTranslation()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 pr-4 text-lg"
          />
        </div>
      </form>

      {searchResults.length > 0 && (
        <Card className="mt-4 p-4">
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <SearchResult key={index} result={result} />
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function SearchResult({ result }: { result: any }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="flex-1">
        <h4 className="font-semibold text-lg">{result.word}</h4>
        <p className="mt-1 text-muted-foreground">{result.translation}</p>
      </div>
      <VoicePlaybackButton text={result.translation} />
    </div>
  )
}
