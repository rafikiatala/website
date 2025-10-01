"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "@/lib/language-context"

const commonPhrases = [
  { english: "Hello", translations: { fr: "Bonjour", sw: "Habari", ar: "مرحبا", pt: "Olá" } },
  { english: "Thank you", translations: { fr: "Merci", sw: "Asante", ar: "شكرا", pt: "Obrigado" } },
  { english: "Where is...?", translations: { fr: "Où est...?", sw: "Wapi...?", ar: "أين...؟", pt: "Onde está...?" } },
  { english: "Help", translations: { fr: "Aide", sw: "Msaada", ar: "مساعدة", pt: "Ajuda" } },
]

export function QuickLinks() {
  const t = useTranslation()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{t("commonPhrases")}</h2>
        <Button variant="ghost" className="gap-2">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {commonPhrases.map((phrase, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{phrase.english}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">FR:</span> {phrase.translations.fr}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">SW:</span> {phrase.translations.sw}
                  </p>
                </div>
              </div>
              <Button size="icon" variant="ghost">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
