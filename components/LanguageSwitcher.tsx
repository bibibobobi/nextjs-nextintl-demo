"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // 語言選項
  const languages = [
    { code: "zh-Hant", name: "繁體中文" },
    { code: "en", name: "English" },
    { code: "jp", name: "日本語" },
    { code: "fr", name: "Français" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-select" className="text-sm hidden md:inline">
        {t("language")}:
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={handleChange}
        className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
