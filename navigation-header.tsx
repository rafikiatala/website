"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check, Home, ArrowLeft } from "lucide-react"
import { languages, useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavigationHeader() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage()
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const handleLanguageChange = (language: (typeof languages)[0]) => {
    console.log("[v0] Language change triggered:", language.code)
    setSelectedLanguage(language)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Back/Home button */}
        <div className="flex items-center gap-4">
          {!isHomePage ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Link>
            </Button>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-foreground">RAFIKI</span>
            </Link>
          )}
        </div>

        {/* Right side - Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{selectedLanguage.nativeName}</span>
              <span className="sm:hidden">{selectedLanguage.code.toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onSelect={() => handleLanguageChange(language)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{language.nativeName}</span>
                {selectedLanguage.code === language.code && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
