import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

function Master() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Header คงเดิม */}
      <PageHeader title={t("Master.pageTitle")} />

      {/* การ์ด 2 ใบ ตามภาพ */}
      <div className="mt-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          <Link to="/master/products" className="block">
            <div
              className="h-20 rounded-2xl bg-[#7083c2] text-white
                         flex items-center justify-center text-lg font-semibold
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("Master.card.products")}
            </div>
          </Link>

          <Link to="/master/customers" className="block">
            <div
              className="h-20 rounded-2xl bg-[#7083c2] text-white
                         flex items-center justify-center text-lg font-semibold
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("Master.card.customers")}
            </div>
          </Link>

          <Link to="/master/suppliers" className="block">
            <div
              className="h-20 rounded-2xl bg-[#7083c2] text-white
                         flex items-center justify-center text-lg font-semibold
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("Master.card.suppliers")}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Master;
