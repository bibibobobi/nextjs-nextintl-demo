import { getRequestConfig } from "next-intl/server";

export const locales = ["zh-Hant", "en", "jp", "fr"];
export const defaultLocale = "zh-Hant";

export default getRequestConfig(async ({ locale }) => {
  // 確保 locale 永遠有值，如果未定義則使用默認值
  const resolvedLocale = locale || defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
