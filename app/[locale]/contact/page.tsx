import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import { setRequestLocale } from "next-intl/server";

export default async function Contact({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  // 啟用語言設定
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">{t("title")}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          {t("introduction")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ContactForm />

          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {t("contact_info.title")}
            </h3>
            <p className="mb-2">{t("contact_info.address")}</p>
            <p className="mb-2">{t("contact_info.phone")}</p>
            <p>{t("contact_info.email")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
