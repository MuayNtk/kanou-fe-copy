// src/pages/sales/Sales.jsx
import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sales() {
  const { t } = useTranslation();

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="">
      {/* หัวข้อหน้าเป็นของ Sales เอง */}
      <PageHeader title={t("Sales_pageTitle")} />

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
          defaultValue={t("Sales_weekly")}
        >
          <option>{t("Sales_weekly")}</option>
          <option>{t("Sales_monthly")}</option>
          <option>{t("Sales_yearly")}</option>
        </select>
      </div>

      {/* Summary Cards (เหมือน Dashboard แต่ใช้คีย์ของ Sales เอง) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link to="/sales/shippinginstruction">
          <div className="rounded-lg shadow-sm p-4 bg-green-100 cursor-pointer hover:bg-green-200 h-28">
            <div className="text-sm font-semibold">{t("Sales_totalSales")}</div>
            <div className="text-xs text-gray-700">
              {t("Sales_comparedToLastMonth")}
            </div>
            <div className="text-xs mt-1 text-green-700 font-semibold">+12.5%</div>
          </div>
        </Link>

        <Link to="/sales/quotation">
          <div className="rounded-lg shadow-sm p-4 bg-blue-100 h-28 hover:bg-blue-200">
            <div className="text-sm font-semibold">{t("Sales_quotation")}</div>
            <div className="text-xs mt-1">
              {t("Sales_total")} 60 {t("Sales_items")}
            </div>
            <div className="text-xs text-gray-700">
              {t("Sales_pendingApproval")} 15 {t("Sales_items")}
            </div>
          </div>
        </Link>

        <Link to="/factory/order">
          <div className="rounded-lg shadow-sm p-4 bg-red-100 h-28 hover:bg-red-200">
            <div className="text-sm font-semibold">{t("Sales_orders")}</div>
            <div className="text-xs mt-1">
              {t("Sales_total")} 324 {t("Sales_items")}
            </div>
            <div className="text-xs text-transparent">.</div>
          </div>
        </Link>

        <Link to="/sales/manage-po">
          <div className="rounded-lg shadow-sm p-4 bg-purple-100 h-28 hover:bg-purple-200">
            <div className="text-sm font-semibold">{t("Sales_invoice")}</div>
            <div className="text-xs mt-1">
              {t("Sales_total")} 89 {t("Sales_items")}
            </div>
            <div className="text-xs text-gray-700">
              {t("Sales_overdue")} 5 {t("Sales_items")}
            </div>
          </div>
        </Link>
      </div>

      {/* Service Department - Daily Summary (คง UI เดิม แต่ใช้คีย์ Sales_) */}
      <div className="mt-8">
        <div className="text-sm font-semibold mb-3">
          {t("Sales_serviceDeptDaily")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center bg-blue-50">
            <div className="text-2xl font-bold text-indigo-700">24</div>
            <div className="text-sm text-gray-700">{t("Sales_newCasesToday")}</div>
          </div>
          <div className="border rounded-lg p-4 text-center bg-green-50">
            <div className="text-2xl font-bold text-green-700">18</div>
            <div className="text-sm text-gray-700">{t("Sales_completedCases")}</div>
          </div>
          <div className="border rounded-lg p-4 text-center bg-yellow-50">
            <div className="text-2xl font-bold text-yellow-700">12</div>
            <div className="text-sm text-gray-700">{t("Sales_inProgress")}</div>
          </div>
        </div>
      </div>

      {/* Latest Quotations */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold pr-3 bg-white">
            {t("Sales_latestQuotations")}
          </span>
          <div className="flex-1 border-b-4 border-indigo-500"></div>
        </div>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">{t("Sales_quotationNo")}</th>
              <th className="p-2 border">{t("Sales_companyName")}</th>
              <th className="p-2 border">{t("Sales_status")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">QT-20250427-001</td>
              <td className="p-2 border">Company A</td>
              <td className="p-2 border text-indigo-700">{t("Sales_sent")}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">QT-20250427-005</td>
              <td className="p-2 border">Company C</td>
              <td className="p-2 border text-red-600">{t("Sales_rejected")}</td>
            </tr>
            <tr>
              <td className="p-2 border">QT-20250427-007</td>
              <td className="p-2 border">Company B</td>
              <td className="p-2 border text-green-600">{t("Sales_approved")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Latest Invoices */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold pr-3 bg-white">
            {t("Sales_latestInvoices")}
          </span>
          <div className="flex-1 border-b-4 border-indigo-500"></div>
        </div>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">{t("Sales_invoiceNo")}</th>
              <th className="p-2 border">{t("Sales_companyName")}</th>
              <th className="p-2 border">{t("Sales_status")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">INV-2024-001</td>
              <td className="p-2 border">Company A</td>
              <td className="p-2 border text-green-600">{t("Sales_paid")}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">INV-2024-002</td>
              <td className="p-2 border">Company C</td>
              <td className="p-2 border text-yellow-600">
                {t("Sales_pendingPayment")}
              </td>
            </tr>
            <tr>
              <td className="p-2 border">INV-2024-003</td>
              <td className="p-2 border">Company B</td>
              <td className="p-2 border text-red-600">{t("Sales_overdue")}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">INV-2024-004</td>
              <td className="p-2 border">Company F</td>
              <td className="p-2 border text-green-600">{t("Sales_paid")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
