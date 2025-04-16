// components/ClientLanguageDetector.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function ClientLanguageDetector() {
  const router = useRouter();

  useEffect(() => {
    // Get the NEXT_LOCALE cookie if it exists
    const localeCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("NEXT_LOCALE="));

    const cookieValue = localeCookie ? localeCookie.split("=")[1] : null;
    console.log("NEXT_LOCALE cookie:", cookieValue || "not set");

    // Check if language cookie already exists
    const hasLocaleCookie = !!cookieValue;

    // Only detect language if no cookie is present
    if (!hasLocaleCookie) {
      try {
        // Use Intl.NumberFormat to detect browser locale
        const browserLocale = Intl.NumberFormat().resolvedOptions().locale;
        console.log("Detected browser locale:", browserLocale);

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

        console.log("Mapped to supported locale:", detectedLocale);

        // Set language cookie with 30-day expiration
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `NEXT_LOCALE=${detectedLocale};expires=${date.toUTCString()};path=/`;
        console.log("Cookie set to:", detectedLocale);

        // If detected language isn't default and current URL has no language prefix, redirect
        if (
          detectedLocale !== routing.defaultLocale &&
          !window.location.pathname.match(
            new RegExp(`^\\/(${routing.locales.join("|")})\\/`)
          )
        ) {
          console.log(
            "Redirecting to:",
            `/${detectedLocale}${window.location.pathname}`
          );
          router.replace(`/${detectedLocale}${window.location.pathname}`);
        } else {
          console.log("No redirect needed");
        }
      } catch (e) {
        console.error("Error detecting browser locale:", e);
      }
    }
  }, [router]);

  // This component doesn't render anything visually
  return null;
}
