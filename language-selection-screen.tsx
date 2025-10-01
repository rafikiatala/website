"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Globe, Check } from "lucide-react"
import { languages, useLanguage } from "@/lib/language-context"
import { useState } from "react"
import { translations } from "@/lib/translations"

export function LanguageSelectionScreen() {
  const { setSelectedLanguage } = useLanguage()
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)

  const handleLanguageSelect = (language: (typeof languages)[0]) => {
    setSelectedCode(language.code)
    // Small delay for visual feedback before transitioning
    setTimeout(() => {
      setSelectedLanguage(language)
    }, 300)
  }

  const getWelcomeText = (langCode: string) => {
    const langTranslations = translations[langCode as keyof typeof translations]
    return langTranslations?.welcomeTitle || translations.en.welcomeTitle
  }

  const getSubtitleText = (langCode: string) => {
    const langTranslations = translations[langCode as keyof typeof translations]
    return langTranslations?.welcomeSubtitle || translations.en.welcomeSubtitle
  }

  const getSelectText = (langCode: string) => {
    const langTranslations = translations[langCode as keyof typeof translations]
    return langTranslations?.selectLanguage || translations.en.selectLanguage
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(74,222,128,0.1),transparent_50%)]" />

      <Card className="relative w-full max-w-2xl p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Globe className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">RAFIKI</h1>

          <div className="space-y-2 mb-4">
            {languages.map((lang) => (
              <p key={lang.code} className="text-lg text-muted-foreground">
                {getWelcomeText(lang.code)}
              </p>
            ))}
          </div>

          <p className="text-lg text-muted-foreground font-semibold mt-6">
            {getSelectText("en")} / {getSelectText("fr")} / {getSelectText("sw")}
          </p>
        </div>

        <div className="space-y-3">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={selectedCode === language.code ? "default" : "outline"}
              size="lg"
              className="w-full justify-between text-lg h-auto py-4 transition-all"
              onClick={() => handleLanguageSelect(language)}
              onMouseEnter={() => setHoveredLanguage(language.code)}
              onMouseLeave={() => setHoveredLanguage(null)}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">{language.nativeName}</span>
                <span className="text-sm text-muted-foreground">({language.name})</span>
              </span>
              {(selectedCode === language.code || hoveredLanguage === language.code) && <Check className="h-5 w-5" />}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
