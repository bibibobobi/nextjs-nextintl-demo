import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // 支援的所有語言列表
  locales: ["zh-Hant", "en", "jp", "fr"],

  // 當沒有匹配的語言時使用
  defaultLocale: "zh-Hant",
});
