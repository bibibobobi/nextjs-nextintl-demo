import { createNavigation } from "next-intl/navigation";
import { locales } from "./i18n";

// 創建一個簡單的路由配置
const routing = {
  locales,
  defaultLocale: "zh-Hant",
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
