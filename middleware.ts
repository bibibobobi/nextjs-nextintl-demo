import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware({
  ...routing,
  // Enable browser language detection
  localeDetection: true,
});

// Configure which routes the middleware will run on
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};
