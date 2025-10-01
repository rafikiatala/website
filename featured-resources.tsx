"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from "lucide-react"
import { useTranslation } from "@/lib/language-context"

export function FeaturedResources() {
  const t = useTranslation()

  const resources = [
    {
      titleKey: "studentHandbook",
      descriptionKey: "studentHandbookDesc",
      category: t("handbook"),
      href: "/handbook",
    },
    {
      titleKey: "academicTerms",
      descriptionKey: "academicTermsDesc",
      category: t("academic"),
      href: "/translate",
    },
    {
      titleKey: "campusMap",
      descriptionKey: "campusMapDesc",
      category: t("map"),
      href: "/map",
    },
    {
      titleKey: "upcomingEvents",
      descriptionKey: "upcomingEventsDesc",
      category: t("events"),
      href: "/events",
    },
  ]

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-foreground">{t("featuredResources")}</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource, index) => (
          <Card key={index} className="flex flex-col p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {resource.category}
              </p>
              <h3 className="mb-2 font-semibold text-card-foreground">{t(resource.titleKey)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t(resource.descriptionKey)}</p>
            </div>

            <Button variant="ghost" className="mt-4 w-full justify-between" asChild>
              <a href={resource.href}>
                View Resource
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
