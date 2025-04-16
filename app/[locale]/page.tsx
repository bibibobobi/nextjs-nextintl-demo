import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import FeatureCard from "@/components/FeatureCard";
import { setRequestLocale } from "next-intl/server";

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  // 啟用語言設定
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          {t("introduction")}
        </p>
        <Link
          href="/about"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {t("cta")}
        </Link>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-semibold text-center mb-10">
          {t("features.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title={t("features.feature1.title")}
            description={t("features.feature1.description")}
            icon="🌐"
          />
          <FeatureCard
            title={t("features.feature2.title")}
            description={t("features.feature2.description")}
            icon="🔄"
          />
          <FeatureCard
            title={t("features.feature3.title")}
            description={t("features.feature3.description")}
            icon="🔍"
          />
          <FeatureCard
            title={t("features.feature4.title")}
            description={t("features.feature4.description")}
            icon="📈"
          />
        </div>
      </section>
    </div>
  );
}
