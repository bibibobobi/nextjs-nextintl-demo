"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function ClientLanguageDetector() {
  const router = useRouter();

  useEffect(() => {
    // Check if language cookie already exists
    const hasLocaleCookie = document.cookie
      .split("; ")
      .some((c) => c.startsWith("NEXT_LOCALE="));

    // Only detect language if no cookie is present
    if (!hasLocaleCookie) {
      try {
        // Use Intl.NumberFormat to detect browser language - more accurate than navigator.language
        const browserLocale = Intl.NumberFormat().resolvedOptions().locale;
        let detectedLocale = routing.defaultLocale;

        // Map the detected language code to our supported languages
        if (
          browserLocale.startsWith("zh-TW") ||
          browserLocale.startsWith("zh-HK")
        ) {
          detectedLocale = "zh-Hant";
        } else if (browserLocale.startsWith("en")) {
          detectedLocale = "en";
        } else if (
          browserLocale.startsWith("ja") ||
          browserLocale.startsWith("jp")
        ) {
          detectedLocale = "jp";
        } else if (browserLocale.startsWith("fr")) {
          detectedLocale = "fr";
        }

        // Set language cookie with 30-day expiration
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `NEXT_LOCALE=${detectedLocale};expires=${date.toUTCString()};path=/`;

        // If detected language isn't default and current URL has no language prefix, redirect
        if (
          detectedLocale !== routing.defaultLocale &&
          !window.location.pathname.match(
            new RegExp(`^\\/(${routing.locales.join("|")})\\/`)
          )
        ) {
          router.replace(`/${detectedLocale}${window.location.pathname}`);
        }
      } catch (e) {
        console.error("Error detecting browser locale:", e);
      }
    }
  }, [router]);

  // This component doesn't render anything visually
  return null;
}
