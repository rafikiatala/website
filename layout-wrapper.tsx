"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { NavigationHeader } from "@/components/navigation-header"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { hasSelectedLanguage } = useLanguage()

  // Show navigation header only when user is authenticated and has selected language
  const showNavigation = isAuthenticated && hasSelectedLanguage

  return (
    <>
      {showNavigation && <NavigationHeader />}
      <div className="relative min-h-screen">
        {showNavigation && (
          <div
            className="fixed inset-0 top-16 -z-10 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: "url('/images/ala-students-background.jpg')" }}
          />
        )}
        {children}
      </div>
    </>
  )
}
