import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ✅ ใช้เส้นทางสัมพัทธ์ใน src และใช้รหัส "ja"
import enTranslation from "./translations/en/translation.json";
import jaTranslation from "./translations/ja/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ja: { translation: jaTranslation }, 
    },
    fallbackLng: "ja", // หรือ "ja" ถ้าอยากเริ่มที่ญี่ปุ่น
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
