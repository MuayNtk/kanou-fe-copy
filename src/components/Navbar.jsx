// src/components/Navbar.jsx
import React from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navbar({ onOpenSidebar }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || "ja").slice(0, 2);

  const toggleLang = () => {
    const next = lang === "ja" ? "en" : "ja";
    i18n.changeLanguage(next);
    try {
      localStorage.setItem("i18nextLng", next);
    } catch {}
  };

  return (
    <header className="sticky top-0 z-40 bg-white w-full overflow-x-hidden">
      <div className="h-12 px-3 sm:px-6 flex items-center justify-between max-w-full">
        {/* Sidebar toggle (mobile) */}
        <button
          className="lg:hidden inline-flex items-center gap-2 text-gray-700 shrink-0"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Middle spacer */}
        <div className="flex-1 min-w-0" />

        {/* Right group */}
        <div className="flex items-center gap-6 shrink-0">
          {/* NEW: ปุ่มดูภาระงาน (อยู่ซ้ายของปุ่ม user) */}
          <Link
            to="/workload"
            className="text-base font-semibold hover:underline"
            style={{ color: "#0ea5a5" }}
          >
            {t("workload")}
          </Link>

          {/* User */}
          <a
            href="#"
            className="text-lg font-semibold"
            style={{ color: "#6b4cff" }}
          >
            {t("user")}
          </a>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="text-lg font-bold rounded px-2 focus:outline-none"
            style={{ color: "#0ea5a5" }}
            aria-label="Toggle language"
            title="Toggle language"
          >
            {i18n.language === "en" ? "English" : "日本語"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
