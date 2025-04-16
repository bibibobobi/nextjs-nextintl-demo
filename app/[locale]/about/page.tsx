import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function About({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // 啟用語言設定
  setRequestLocale(locale);

  const t = useTranslations("about");

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">{t("title")}</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">{t("introduction")}</p>
          <p className="text-lg text-gray-600 mb-8">{t("mission")}</p>

          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("team.title")}</h2>
            <p className="text-gray-600">{t("team.description")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
