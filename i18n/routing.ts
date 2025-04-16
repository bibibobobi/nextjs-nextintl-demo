import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["zh-Hant", "en", "jp", "fr"],

  // Used when no locale matches
  defaultLocale: "zh-Hant",

  // localePrefix: 'always'
  localePrefix: "as-needed",
});
