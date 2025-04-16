import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: { locale: string };
};

export default async function Services({ params }: PageProps) {
  const { locale } = params;
  // 啟用語言設定
  setRequestLocale(locale);

  const t = await getTranslations("services");

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">{t("title")}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          {t("introduction")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">
              {t("service1.title")}
            </h3>
            <p className="text-gray-600">{t("service1.description")}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">
              {t("service2.title")}
            </h3>
            <p className="text-gray-600">{t("service2.description")}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">
              {t("service3.title")}
            </h3>
            <p className="text-gray-600">{t("service3.description")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
