import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware({
  ...routing,
  // Enable browser language detection
  localeDetection: {
    // Custom language detection logic
    resolve: (request) => {
      // Get Accept-Language header from the request
      const acceptLanguage = request.headers.get("accept-language") || "";

      // First check if there's a language cookie already set
      const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
      if (cookieLocale && routing.locales.includes(cookieLocale)) {
        return cookieLocale;
      }

      // Parse Accept-Language header to get language preferences
      const locales = acceptLanguage
        .split(",")
        .map((item) => item.split(";")[0].trim())
        .filter(Boolean);

      // Map browser language codes to our supported languages
      for (const locale of locales) {
        if (locale.startsWith("zh-TW") || locale.startsWith("zh-HK")) {
          return "zh-Hant";
        } else if (locale.startsWith("en")) {
          return "en";
        } else if (locale.startsWith("ja") || locale.startsWith("jp")) {
          return "jp";
        } else if (locale.startsWith("fr")) {
          return "fr";
        }
      }

      // If no match found, use default language
      return routing.defaultLocale;
    },
  },
});

// Configure which routes the middleware will run on
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};
