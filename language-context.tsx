"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type TranslationKey } from "./translations"

type Language = {
  code: string
  name: string
  nativeName: string
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
]

type LanguageContextType = {
  selectedLanguage: Language
  setSelectedLanguage: (language: Language) => void
  hasSelectedLanguage: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] = useState<Language>(languages[0])
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false)

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("rafiki-language")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage)
      if (language) {
        setSelectedLanguageState(language)
        setHasSelectedLanguage(true)
      }
    }
  }, [])

  const setSelectedLanguage = (language: Language) => {
    console.log("[v0] Setting language to:", language.code)
    setSelectedLanguageState(language)
    setHasSelectedLanguage(true)
    localStorage.setItem("rafiki-language", language.code)
  }

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, hasSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function useTranslation() {
  const { selectedLanguage } = useLanguage()

  return (key: TranslationKey) => {
    const langCode = selectedLanguage.code as keyof typeof translations
    const langTranslations = translations[langCode]

    if (!langTranslations || !langTranslations[key]) {
      return translations.en[key] || key
    }

    return langTranslations[key]
  }
}
