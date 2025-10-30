// src/pages/Dashbord.jsx
import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ i18n

function Dashbord() {
  const { t } = useTranslation();

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="">
      <PageHeader title={t("dashboard")} />

      {/* Top Header: Calendar + Today + Range Dropdown */}
      <div className="flex items-center justify-between mb-6 mt-5">
        <div className="flex items-center gap-2">
          <FaRegCalendarAlt className="text-gray-600" />
          <span className="text-lg font-semibold text-indigo-900">
            {formattedDate}
          </span>
        </div>
        <select
          className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-md border"
          defaultValue={t("weekly")}
        >
          <option>{t("weekly")}</option>
          <option>{t("monthly")}</option>
          <option>{t("yearly")}</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link to="/sales/shippinginstruction">
          <div className="rounded-lg shadow-sm p-4 bg-green-100 cursor-pointer hover:bg-green-200 h-28">
            <div className="text-sm font-semibold">{t("totalSales")}</div>
            <div className="text-xs text-gray-700">{t("comparedToLastMonth")}</div>
            <div className="text-xs mt-1 text-green-700 font-semibold">
              +12.5%
            </div>
          </div>
        </Link>

        <Link to="/sales/quotation">
          <div className="rounded-lg shadow-sm p-4 bg-blue-100 h-28 hover:bg-blue-200">
            <div className="text-sm font-semibold">{t("quotation")}</div>
            <div className="text-xs mt-1">{t("total")} 60 {t("items")}</div>
            <div className="text-xs text-gray-700">{t("pendingApproval")} 15 {t("items")}</div>
          </div>
        </Link>

        <Link to="/factory/order">
          <div className="rounded-lg shadow-sm p-4 bg-red-100 h-28 hover:bg-red-200">
            <div className="text-sm font-semibold">{t("orders")}</div>
            <div className="text-xs mt-1">{t("total")} 324 {t("items")}</div>
            <div className="text-xs text-transparent">.</div>
          </div>
        </Link>

        <Link to="/sales/manage-po">
          <div className="rounded-lg shadow-sm p-4 bg-purple-100 h-28 hover:bg-purple-200">
            <div className="text-sm font-semibold">{t("invoice")}</div>
            <div className="text-xs mt-1">{t("total")} 89 {t("items")}</div>
            <div className="text-xs text-gray-700">{t("overdue")} 5 {t("items")}</div>
          </div>
        </Link>
      </div>

      {/* Service Department - Daily Summary */}
      <div className="mt-8">
        <div className="text-sm font-semibold mb-3">
          {t("serviceDeptDaily")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center bg-blue-50">
            <div className="text-2xl font-bold text-indigo-700">24</div>
            <div className="text-sm text-gray-700">{t("totalstock")}</div>
          </div>
          <div className="border rounded-lg p-4 text-center bg-green-50">
            <div className="text-2xl font-bold text-green-700">18</div>
            <div className="text-sm text-gray-700">{t("stockng")}</div>
          </div>
          <div className="border rounded-lg p-4 text-center bg-yellow-50">
            <div className="text-2xl font-bold text-yellow-700">12</div>
            <div className="text-sm text-gray-700">{t("shippingissued")}</div>
          </div>
        </div>
      </div>

      {/* Latest Quotations */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold pr-3 bg-white">
            {t("latestQuotations")}
          </span>
          <div className="flex-1 border-b-4 border-indigo-500"></div>
        </div>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">{t("quotationNo")}</th>
              <th className="p-2 border">{t("companyName")}</th>
              <th className="p-2 border">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">QT-20250427-001</td>
              <td className="p-2 border">Company A</td>
              <td className="p-2 border text-indigo-700">{t("sent")}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">QT-20250427-005</td>
              <td className="p-2 border">Company C</td>
              <td className="p-2 border text-red-600">{t("rejected")}</td>
            </tr>
            <tr>
              <td className="p-2 border">QT-20250427-007</td>
              <td className="p-2 border">Company B</td>
              <td className="p-2 border text-green-600">{t("approved")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Latest Invoices */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold pr-3 bg-white">
            {t("latestInvoices")}
          </span>
          <div className="flex-1 border-b-4 border-indigo-500"></div>
        </div>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">{t("invoiceNo")}</th>
              <th className="p-2 border">{t("companyName")}</th>
              <th className="p-2 border">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">INV-2024-001</td>
              <td className="p-2 border">Company A</td>
              <td className="p-2 border text-green-600">{t("paid")}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">INV-2024-002</td>
              <td className="p-2 border">Company C</td>
              <td className="p-2 border text-yellow-600">{t("pendingPayment")}</td>
            </tr>
            <tr>
              <td className="p-2 border">INV-2024-003</td>
              <td className="p-2 border">Company B</td>
              <td className="p-2 border text-red-600">{t("overdue")}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">INV-2024-004</td>
              <td className="p-2 border">Company F</td>
              <td className="p-2 border text-green-600">{t("paid")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashbord;
