// src/pages/service/Service.jsx
import React from "react";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

function KpiCard({ icon, label, value, unit, className = "" }) {
  return (
    <div className={`rounded-2xl border p-3 sm:p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="text-xl sm:text-2xl">{icon}</span>
          <span className="text-xs sm:text-sm">{label}</span>
        </div>
      </div>
      <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">
        {unit ? `${unit} ${value}` : value}
      </div>
    </div>
  );
}

function Pill({ text, tone = "gray" }) {
  const tones = {
    green:
      "bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
    yellow:
      "bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
    blue:
      "bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
    red:
      "bg-rose-100 text-rose-800 border border-rose-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
    gray:
      "bg-gray-100 text-gray-800 border border-gray-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
  };
  return <span className={tones[tone] || tones.gray}>{text}</span>;
}

export default function Service() {
  const { t } = useTranslation();

  // KPI แถวบน (เหมือนเดิม)
  const kpisTop = {
    totalAll: { value: 248 },      // 修理総計 · งานซ่อมทั้งหมดทั้งปี/เดือนนี้
    repairInstruction: { value: 1 },// 修理指示書 · รายงานการซ่อม
    repairReport: { value: 4 },     // 修理報告書 · รายการแจ้งซ่อม
    todayDeliveryKanou: { value: 12 } // 本日納品 · Delivery Kanou
  };

  // KPI แถวล่าง (เหลือ 2 ใบ)
  const kpisBottom = {
    outsourceStock: { value: 6 },   // 外注在庫
    deliveryCustomer: { value: 9 }  // 納品顧客
  };

  // ตารางข้อมูลจำลอง
  const rows = [
    {
      repairNo: "SR-2025-0582",
      date: "30/04/2025",
      customer: "Somchai Meesuk",
      productId: "001",
      technician: "Thanakorn Srisuk",
      status: { key: "pending", tone: "yellow" },
    },
    {
      repairNo: "SR-2025-0581",
      date: "30/04/2025",
      customer: "Anong Rakdee",
      productId: "002",
      technician: "Paweena Chanee",
      status: { key: "repairing", tone: "blue" },
    },
    {
      repairNo: "SR-2025-0580",
      date: "30/04/2025",
      customer: "Peter Johnson",
      productId: "003",
      technician: "Kittiphong Saelee",
      status: { key: "repairing", tone: "blue" },
    },
    {
      repairNo: "SR-2025-0579",
      date: "30/04/2025",
      customer: "Somchai Meesuk",
      productId: "004",
      technician: "Nattida Wilailporn",
      status: { key: "finish", tone: "green" },
    },
  ];

  const statusLabel = (k) =>
    ({
      pending: t("Service_status_pending"),
      repairing: t("Service_status_repairing"),
      finish: t("Service_status_finish"),
    }[k] || "-");

  return (
    <div>
      <PageHeader title={t("Service_pageTitle")} />

      <div className="px-4 sm:px-6 mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        {/* 🔹 แถวบน (4 การ์ดเดิม) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard
            icon="📊"
            label={t("Service_kpi_totalAllYearMonth")}
            value={kpisTop.totalAll.value}
            className="border-black bg-green-50"
          />
          <KpiCard
            icon="🛠️"
            label={t("Service_kpi_repairInstruction")}
            value={kpisTop.repairInstruction.value}
            className="border-black bg-blue-50"
          />
          <KpiCard
            icon="🧾"
            label={t("Service_kpi_repairReport")}
            value={kpisTop.repairReport.value}
            className="border-black bg-rose-50"
          />
          <KpiCard
            icon="🚚"
            label={t("Service_kpi_todayDeliveryKanou")}
            value={kpisTop.todayDeliveryKanou.value}
            className="border-black bg-yellow-50"
          />
        </div>

        {/* 🔹 แถวล่าง (2 การ์ดเท่านั้น) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <KpiCard
            icon="🏭"
            label={t("Service_kpi_outsourceStock")}
            value={kpisBottom.outsourceStock.value}
            className="border-black bg-purple-50"
          />
          <KpiCard
            icon="📦"
            label={t("Service_kpi_deliveryCustomer")}
            value={kpisBottom.deliveryCustomer.value}
            className="border-black bg-amber-50"
          />
        </div>

        {/* 🔹 ตารางรายการซ่อม */}
        <div className="mt-8">
          <div className="flex items-center mb-3">
            <span className="text-sm sm:text-base font-semibold pr-3 bg-white text-slate-900">
              {t("Service_Repair")}
            </span>
            <div className="flex-1 border-b-4 border-indigo-500"></div>
          </div>

          {/* mobile card list */}
          <div className="space-y-2 sm:hidden">
            {rows.map((r) => (
              <div key={r.repairNo} className="rounded-2xl border bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">
                    {r.repairNo}
                  </span>
                  <Pill text={statusLabel(r.status.key)} tone={r.status.tone} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>
                    <div className="text-slate-500">{t("Service_table_date")}</div>
                    <div className="font-medium">{r.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">{t("Service_table_productId")}</div>
                    <div className="font-medium">{r.productId}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-slate-500">{t("Service_table_customer")}</div>
                    <div className="font-medium">{r.customer}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-slate-500">{t("Service_table_technician")}</div>
                    <div className="font-medium">{r.technician}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">{t("Service_table_repairNo")}</th>
                  <th className="p-2 border">{t("Service_table_date")}</th>
                  <th className="p-2 border">{t("Service_table_customer")}</th>
                  <th className="p-2 border">{t("Service_table_productId")}</th>
                  <th className="p-2 border">{t("Service_table_technician")}</th>
                  <th className="p-2 border">{t("Service_table_status")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.repairNo} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2 border font-semibold text-slate-900">
                      {r.repairNo}
                    </td>
                    <td className="p-2 border">{r.date}</td>
                    <td className="p-2 border">{r.customer}</td>
                    <td className="p-2 border">{r.productId}</td>
                    <td className="p-2 border">{r.technician}</td>
                    <td className="p-2 border">
                      <Pill text={statusLabel(r.status.key)} tone={r.status.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
