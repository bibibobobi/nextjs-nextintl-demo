# Next.js Internationalization with next-intl Implementation Guide

## Basic Concepts of Internationalization

Internationalization (i18n) refers to the process of enabling a website or application to support multiple languages. In Next.js, this includes two main aspects:

- **Localization**: Translating website text content
- **Internationalized Routes**: Providing unique URL paths for different language versions

### Terminology

- **Locale**: An identifier for a set of language and formatting preferences, typically including the user's preferred language and possibly their geographic region
  - Examples: `en-US` (American English), `zh-Hant` (Traditional Chinese), `fr` (French)

### Page Router vs App Router

It's important to note the difference between internationalization approaches in Next.js:

- **Page Router**: Has a [built-in internationalization system](https://nextjs.org/docs/pages/building-your-application/routing/internationalization) with official support through the `i18n` configuration in `next.config.js`.

- **App Router**: No built-in internationalization system yet. The App Router documentation suggests several community solutions like next-intl, next-international, next-i18n-router, and others.

This implementation uses the App Router approach with next-intl, which provides the most comprehensive solution for the newer architecture.

## Why next-intl Was Chosen

Next.js offers several ways to implement internationalization, and the official documentation mentions multiple approaches. The **next-intl** library was selected for this implementation for several compelling reasons:

1. **App Router Compatibility**: While Next.js Page Router has built-in internationalization support, the newer App Router doesn't provide an official solution yet. next-intl offers a robust solution specifically designed for the App Router architecture.

2. **Complete Solution**: next-intl provides a comprehensive package that handles both routing and translations in one library, simplifying the implementation.

3. **Type Safety**: Excellent TypeScript integration with type checking for translation keys and routes.

4. **Performance**: Optimized for both client and server components, with support for static generation.

5. **Active Maintenance**: The library is actively maintained and quickly adapts to Next.js changes.

6. **Rich Features**: Offers message formatting, plural rules, date/time formatting, and number formatting beyond simple text translations.

7. **Middleware-Based Routing**: Provides a clean middleware-based approach to route internationalization.

## Implementing Multilingual Website with next-intl

In this demo site, next-intl is used to implement internationalization. This is an internationalization solution designed specifically for Next.js and is particularly suitable for the App Router architecture.

### Project Structure

```
├── messages/
│   ├── zh-Hant.json
│   ├── en.json
│   ├── jp.json
│   └── fr.json
├── src/
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── navigation.ts
│   │   └── request.ts
│   ├── middleware.ts
│   └── app/
│       └── [locale]/
│           ├── layout.tsx
│           ├── page.tsx
│           └── ...
└── next.config.mjs
```

### Key Components Setup

#### 1. Translation Files

In the `messages` directory, JSON files are created for each supported language:

```json
// messages/zh-Hant.json (Traditional Chinese - Default language)
{
  "metadata": {
    "title": "多語言示範網站",
    "description": "使用 Next.js 和 next-intl 的多語言網站示範"
  },
  "nav": {
    "home": "首頁",
    "about": "關於我們"
  }
}
```

```json
// messages/en.json (English)
{
  "metadata": {
    "title": "Multilingual Demo Website",
    "description": "A multilingual website demo using Next.js and next-intl"
  },
  "nav": {
    "home": "Home",
    "about": "About"
  }
}
```

#### 2. Routing Configuration

The dynamic segment `[locale]` is used to support multilingual routing:

```typescript
// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // List of supported languages
  locales: ["zh-Hant", "en", "jp", "fr"],

  // Default language
  defaultLocale: "zh-Hant",

  // Set to 'as-needed' so the default language doesn't need a prefix
  localePrefix: "as-needed",
});
```

#### 3. Middleware Setup

The middleware handles route conversion and language detection:

```typescript
// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};
```

#### 4. Request Configuration

Connecting translations to the request:

```typescript
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

#### 5. Navigation Tools

Creating internationalization-aware navigation components:

```typescript
// src/i18n/navigation.ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

#### 6. Application Layout

Setting up the root layout to support internationalization:

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import ClientLanguageDetector from "@/components/ClientLanguageDetector";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static generation
  setRequestLocale(locale);

  // Get translation messages
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientLanguageDetector />
          {/* Website content */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Using Translations in Pages

#### Server Components

```tsx
// src/app/[locale]/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("introduction")}</p>
      <Link href="/about">{t("learn_more")}</Link>
    </div>
  );
}
```

#### Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function ClientComponent() {
  const t = useTranslations("common");

  return <button>{t("submit")}</button>;
}
```

### Language Detection and Switching

The demo implements a client-side language detector that uses `Intl.NumberFormat().resolvedOptions().locale` to get the browser's preferred language:

```tsx
// components/ClientLanguageDetector.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function ClientLanguageDetector() {
  const router = useRouter();

  useEffect(() => {
    // Get NEXT_LOCALE cookie
    const localeCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("NEXT_LOCALE="));

    const cookieValue = localeCookie ? localeCookie.split("=")[1] : null;
    console.log("NEXT_LOCALE cookie:", cookieValue || "not set");

    // If no cookie, perform detection
    if (!cookieValue) {
      try {
        const browserLocale = Intl.NumberFormat().resolvedOptions().locale;
        console.log("Detected browser locale:", browserLocale);

        // Map to supported languages
        let detectedLocale = routing.defaultLocale;
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

        // Set cookie
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `NEXT_LOCALE=${detectedLocale};expires=${date.toUTCString()};path=/`;

        // Redirect if necessary
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

  return null;
}
```

### Language Switcher

Allowing users to manually switch languages:

```tsx
// components/LanguageSwitcher.tsx
"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e) => {
    const newLocale = e.target.value;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <select value={locale} onChange={handleChange}>
      <option value="zh-Hant">繁體中文</option>
      <option value="en">English</option>
      <option value="jp">日本語</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

## Static Generation and Performance Optimization

To ensure Static Generation works with internationalization, the `generateStaticParams` function is used in each page and layout to pre-generate all supported language paths.

At the same time, `setRequestLocale` ensures the correct language environment is available during static generation.

## Advantages and Benefits

1. **Clear URL Structure**: Using structures like `/en/about`, `/zh-Hant/about` makes URLs intuitive and SEO-friendly
2. **No Prefix for Default Language**: Through the `localePrefix: 'as-needed'` setting, the default language (Traditional Chinese) can use `/about` instead of `/zh-Hant/about`
3. **Automatic Language Detection**: Combining server middleware and client detection provides the best user experience
4. **Static Generation Support**: Allows pre-rendering of all language versions of pages, improving performance and SEO
5. **Type Safety**: Good integration with TypeScript, providing type checking and autocompletion
6. **Flexible API**: Works well in both Server and Client Components
7. **Developer Experience**: Offers a cleaner API compared to manual internationalization approaches

## Alternative Approaches

Next.js documentation mentions several other approaches to internationalization:

1. **Manual Implementation**: Using dynamic route parameters and managing translations yourself. This approach gives full control but requires more setup and maintenance.

2. **Other Libraries**:

   - **next-international**: Lightweight with good App Router support
   - **next-i18n-router**: Focused on routing rather than complete i18n
   - **paraglide-next**: Optimized for static site generation
   - **lingui**: A comprehensive i18n framework that works with Next.js

3. **Built-in i18n (Page Router only)**: Using Next.js built-in support in the older Pages Router:
   ```javascript
   // next.config.js in Pages Router
   module.exports = {
     i18n: {
       locales: ["en", "fr", "de"],
       defaultLocale: "en",
     },
   };
   ```

The next-intl implementation in this demo provides a good balance of features, performance, and developer experience for App Router projects.

## Conclusion

Through Next.js App Router and the next-intl library, this demo implements a fully functional internationalized website that supports multiple languages and provides a good user experience. This approach works for both small websites and can scale to large multilingual applications.

The lack of official internationalization support in the App Router actually provides the flexibility to choose the best solution for specific needs, and next-intl has proven to be an excellent choice for this multilingual demo site.

## References

- https://next-intl.dev/docs/getting-started
- https://www.youtube.com/watch?v=J8tnD2BWY28
- https://www.youtube.com/watch?v=I9kiZvBBIs4
- https://i18nexus.com/
