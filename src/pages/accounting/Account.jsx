// src/pages/accounting/Accounting.jsx
import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next"; // ✅ i18n

function Accounting() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("accounting")} />

      <div className="mt-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          <Link to="/accounting/issue-invoice" className="block">
            <div
              className="h-20 rounded-2xl bg-[#7083c2] text-white
                         flex items-center justify-center text-lg font-semibold
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("issueInvoice")}
            </div>
          </Link>

          <Link to="/accounting/link-accounting" className="block">
            <div
              className="h-20 rounded-2xl bg-[#7083c2] text-white
                         flex items-center justify-center text-lg font-semibold
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("linkAccounting")}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Accounting;
