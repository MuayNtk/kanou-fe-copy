// src/pages/Workload.jsx
import React from "react";
import PageHeader from "../components/PageHeader";
import { useTranslation } from "react-i18next";

function Workload() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("workload.title")} />

      {/* Sending Table */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold pr-3 bg-white">
            {t("workload.sendingTitle")}
          </span>
          <div className="flex-1 border-b-4 border-indigo-500"></div>
        </div>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">{t("workload.quotationNo")}</th>
              <th className="p-2 border">{t("workload.companyName")}</th>
              <th className="p-2 border">{t("workload.status")}</th>
              <th className="p-2 border">{t("workload.note")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">QT-20250427-001</td>
              <td className="p-2 border">Company A</td>
              <td className="p-2 border text-indigo-700">
                {t("workload.sent")}
              </td>
              <td className="p-2 border">Urgent delivery</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">QT-20250427-005</td>
              <td className="p-2 border">Company C</td>
              <td className="p-2 border text-red-600">
                {t("workload.rejected")}
              </td>
              <td className="p-2 border">Price too high</td>
            </tr>
            <tr>
              <td className="p-2 border">QT-20250427-007</td>
              <td className="p-2 border">Company B</td>
              <td className="p-2 border text-green-600">
                {t("workload.approved")}
              </td>
              <td className="p-2 border">Confirmed</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Receiving Table */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold pr-3 bg-white">
            {t("workload.receivingTitle")}
          </span>
          <div className="flex-1 border-b-4 border-indigo-500"></div>
        </div>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">{t("workload.invoiceNo")}</th>
              <th className="p-2 border">{t("workload.companyName")}</th>
              <th className="p-2 border">{t("workload.status")}</th>
              <th className="p-2 border">{t("workload.note")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">INV-2024-001</td>
              <td className="p-2 border">Company A</td>
              <td className="p-2 border text-green-600">
                {t("workload.paid")}
              </td>
              <td className="p-2 border">On schedule</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">INV-2024-002</td>
              <td className="p-2 border">Company C</td>
              <td className="p-2 border text-yellow-600">
                {t("workload.pendingPayment")}
              </td>
              <td className="p-2 border">Awaiting confirmation</td>
            </tr>
            <tr>
              <td className="p-2 border">INV-2024-003</td>
              <td className="p-2 border">Company B</td>
              <td className="p-2 border text-red-600">
                {t("workload.overdue")}
              </td>
              <td className="p-2 border">Contacted for follow-up</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Workload;
