"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoicePlaybackButtonProps {
  text: string
  language?: string
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export function VoicePlaybackButton({
  text,
  language = "en-US",
  variant = "ghost",
  size = "icon",
}: VoicePlaybackButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const { toast } = useToast()

  const languageMap: Record<string, string> = {
    en: "en-US",
    fr: "fr-FR",
    sw: "sw-KE",
    ar: "ar-SA",
    pt: "pt-PT",
    am: "am-ET",
  }

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      console.log("[v0] Available voices:", voices.length)
      if (voices.length > 0) {
        setVoicesLoaded(true)
      }
    }

    // Load voices immediately
    loadVoices()

    // Also listen for voiceschanged event (some browsers need this)
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }
  }, [])

  const handlePlayback = () => {
    if (isPlaying) {
      console.log("[v0] Stopping audio playback")
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    setIsLoading(true)
    console.log("[v0] Starting audio playback for:", text, "in language:", language)

    const voices = window.speechSynthesis.getVoices()
    const targetLang = languageMap[language] || language
    console.log("[v0] Looking for voice with language:", targetLang)
    console.log("[v0] Total available voices:", voices.length)

    // Try to find a voice that matches the language
    let selectedVoice = voices.find((voice) => voice.lang === targetLang)

    // If exact match not found, try to find a voice that starts with the language code
    if (!selectedVoice) {
      const langCode = targetLang.split("-")[0]
      selectedVoice = voices.find((voice) => voice.lang.startsWith(langCode))
      console.log("[v0] Exact match not found, using fallback voice:", selectedVoice?.name)
    }

    if (!selectedVoice && voices.length > 0) {
      // Use default voice as last resort
      selectedVoice = voices[0]
      console.log("[v0] No matching voice found, using default:", selectedVoice.name)
    }

    if (!selectedVoice) {
      console.error("[v0] No voices available")
      toast({
        title: "Audio not available",
        description: "No text-to-speech voices are available on your device.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    console.log("[v0] Selected voice:", selectedVoice.name, selectedVoice.lang)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = selectedVoice
    utterance.lang = targetLang
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      console.log("[v0] Audio playback started")
      setIsLoading(false)
      setIsPlaying(true)
    }

    utterance.onend = () => {
      console.log("[v0] Audio playback ended")
      setIsPlaying(false)
    }

    utterance.onerror = (event) => {
      console.error("[v0] Audio playback error:", event.error)
      setIsLoading(false)
      setIsPlaying(false)
      toast({
        title: "Playback error",
        description: `Could not play audio: ${event.error}`,
        variant: "destructive",
      })
    }

    window.speechSynthesis.cancel()

    // Small delay to ensure cancellation is complete
    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
      console.log("[v0] Speech synthesis speak() called")
    }, 100)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePlayback}
      disabled={isLoading}
      title={isPlaying ? "Stop audio" : "Play audio"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  )
}
