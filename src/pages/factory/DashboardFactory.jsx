import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

function DashboardFactory() {
  const { t } = useTranslation();

  return (
    <div className="">
      <PageHeader title={t("DashboardFactory.title")} />

      {/* Latest Quotations */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold pr-3 bg-white">
            {t("DashboardFactory.sectionTitle")}
          </span>
          <div className="flex-1 border-b-4 border-indigo-500"></div>
        </div>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">{t("DashboardFactory.colQuotationNo")}</th>
              <th className="p-2 border">{t("DashboardFactory.colCompany")}</th>
              <th className="p-2 border">{t("DashboardFactory.colStatus")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">QT-20250427-001</td>
              <td className="p-2 border">{t("DashboardFactory.companyA")}</td>
              <td className="p-2 border text-indigo-700">{t("DashboardFactory.statusSent")}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">QT-20250427-005</td>
              <td className="p-2 border">{t("DashboardFactory.companyC")}</td>
              <td className="p-2 border text-red-600">{t("DashboardFactory.statusRejected")}</td>
            </tr>
            <tr>
              <td className="p-2 border">QT-20250427-007</td>
              <td className="p-2 border">{t("DashboardFactory.companyB")}</td>
              <td className="p-2 border text-green-600">{t("DashboardFactory.statusApproved")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardFactory;
