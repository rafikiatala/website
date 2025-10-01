"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { languages, useLanguage } from "@/lib/language-context"

export function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage()

  const handleLanguageChange = (language: (typeof languages)[0]) => {
    console.log("[v0] Language change triggered:", language.code)
    setSelectedLanguage(language)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-muted-foreground">Choose your language / Choisissez votre langue</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="min-w-[240px] justify-between text-lg bg-card hover:bg-accent">
            <span className="flex items-center gap-3">
              <Globe className="h-5 w-5" />
              {selectedLanguage.nativeName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[240px] z-50" sideOffset={5}>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onSelect={() => handleLanguageChange(language)}
              className="flex items-center justify-between py-3 text-base cursor-pointer"
            >
              <span>{language.nativeName}</span>
              {selectedLanguage.code === language.code && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
