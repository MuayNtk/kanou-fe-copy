// src/pages/Homepage.jsx
import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useTranslation } from "react-i18next"; // ✅ เพิ่ม i18n

function Homepage() {
  const { t } = useTranslation(); // ✅ ใช้งานแปล

  const cards = [
    { label: t("menu.sales"), to: "/sales" },
    { label: t("menu.factory"), to: "/factory" },
    { label: t("menu.purchasing"), to: "/purchasing" },
    { label: t("menu.international"), to: "/international" },
    { label: t("menu.service"), to: "/service" },
    { label: t("menu.accounting"), to: "/accounting" },
    { label: t("menu.settings"), to: "/settings" },
  ];

  return (
    <div>
      <PageHeader title={t("menu.home")} /> {/* ✅ เปลี่ยนจาก "ホーム" */}

      {/* Cards grid เต็มหน้าจอ */}
      <div className="mt-10 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {cards.map((c) => (
            <Link key={c.to} to={c.to} className="block">
              <div
                className="h-24 rounded-2xl bg-[#7083c2] text-white
                           flex items-center justify-center text-lg font-semibold
                           shadow-md hover:shadow-xl transition-all duration-200
                           hover:-translate-y-0.5"
              >
                {c.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
