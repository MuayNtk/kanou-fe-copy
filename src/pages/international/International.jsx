// src/pages/international/International.jsx
import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

function KpiCard({ icon, label, value, delta, up, unit, className = "" }) {
  return (
    <div className={`rounded-2xl border p-3 sm:p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="text-xl sm:text-2xl">{icon}</span>
          <span className="text-xs sm:text-sm">{label}</span>
        </div>
        <div
          className={`text-[10px] sm:text-xs font-semibold ${
            up ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {up ? "↑" : "↓"} {delta}%
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
    blue: "bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
    red: "bg-rose-100 text-rose-800 border border-rose-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
    gray: "bg-gray-100 text-gray-800 border border-gray-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
  };
  return <span className={tones[tone] || tones.gray}>{text}</span>;
}

export default function International() {
  const { t } = useTranslation();

  // ===== mock data (ยกจาก Purchasing) =====
  const kpis = {
    totalPOs: { value: 248, delta: 12, up: true },
    pending: { value: 12, delta: 8, up: true },
    totalValue: { value: "2.3 M", unit: "¥", delta: 12, up: true },
    late: { value: 5, delta: 2, up: false },
  };

  const rows = [
    {
      po: "PO-2024-001",
      vendor: "ABC Supply Co.",
      date: "2024-10-08",
      items: 15,
      amount: "฿124,500",
      priority: { key: "high", tone: "yellow" },
      status: { key: "approved", tone: "green" },
    },
    {
      po: "PO-2024-002",
      vendor: "XYZ Trading",
      date: "2024-10-07",
      items: 8,
      amount: "฿89,200",
      priority: { key: "medium", tone: "blue" },
      status: { key: "processing", tone: "yellow" },
    },
    {
      po: "PO-2024-003",
      vendor: "Global Parts Ltd.",
      date: "2024-10-07",
      items: 22,
      amount: "฿256,000",
      priority: { key: "high", tone: "yellow" },
      status: { key: "approved", tone: "green" },
    },
    {
      po: "PO-2024-004",
      vendor: "Tech Solutions",
      date: "2024-10-06",
      items: 5,
      amount: "฿45,800",
      priority: { key: "urgent", tone: "red" },
      status: { key: "late", tone: "red" },
    },
    {
      po: "PO-2024-005",
      vendor: "Office Supplies Pro",
      date: "2024-10-06",
      items: 12,
      amount: "฿32,100",
      priority: { key: "low", tone: "gray" },
      status: { key: "approved", tone: "green" },
    },
  ];

  // ===== label ด้วย key ของหน้า International (flat key) =====
  const priorityLabel = (k) =>
    ({
      urgent: t("International_priority_urgent"),
      high: t("International_priority_high"),
      medium: t("International_priority_medium"),
      low: t("International_priority_low"),
    }[k] || "-");

  const statusLabel = (k) =>
    ({
      approved: t("International_status_approved"),
      processing: t("International_status_processing"),
      sent: t("International_status_sent"),
      rejected: t("International_status_rejected"),
      late: t("International_status_late"),
    }[k] || "-");

  return (
    <div>
      <PageHeader title={t("International_pageTitle")} />

      {/* ปุ่มทางลัดของหน้า International (คงของเดิมไว้) */}
      {/* <div className="mt-6 sm:mt-8 px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Link to="/international/manage-purchase" className="block">
            <div className="h-14 sm:h-16 rounded-2xl bg-[#7083c2] text-white flex items-center justify-center text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200">
              {t("International_cardManagePurchase")}
            </div>
          </Link>
          <Link to="/international/sales" className="block">
            <div className="h-14 sm:h-16 rounded-2xl bg-[#7083c2] text-white flex items-center justify-center text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200">
              {t("International_cardSales")}
            </div>
          </Link>
          <Link to="/international/production-registration" className="block">
            <div className="h-14 sm:h-16 rounded-2xl bg-[#7083c2] text-white flex items-center justify-center text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200">
              {t("International_cardProductionRegistration")}
            </div>
          </Link>
        </div>
      </div> */}

      {/* ===== Dashboard นำมาจากหน้า Purchasing ===== */}
      <div className="px-4 sm:px-6 mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard
            icon="🛒"
            label={t("International_kpi_totalPOs")}
            value={kpis.totalPOs.value}
            delta={kpis.totalPOs.delta}
            up={kpis.totalPOs.up}
            className=" border-black bg-green-50"
          />
          <KpiCard
            icon="🕒"
            label={t("International_kpi_pending")}
            value={kpis.pending.value}
            delta={kpis.pending.delta}
            up={kpis.pending.up}
            className=" border-black bg-blue-50"
          />
          <KpiCard
            icon="💲"
            label={t("International_kpi_totalValue")}
            value={kpis.totalValue.value}
            unit={kpis.totalValue.unit}
            delta={kpis.totalValue.delta}
            up={kpis.totalValue.up}
            className=" border-black bg-red-50"
          />
          <KpiCard
            icon="📅"
            label={t("International_kpi_late")}
            value={kpis.late.value}
            delta={kpis.late.delta}
            up={kpis.late.up}
            className=" border-black bg-yellow-50"
          />
        </div>

        {/* Latest Orders */}
        <div className="mt-1 sm:mt-2">
          {/* หัวข้อแบบมีเส้นน้ำเงิน */}
          <div className="flex items-center mb-3">
            <span className="text-sm sm:text-base font-semibold pr-3 bg-white text-slate-900">
              {t("International_latest_title")}
            </span>
            <div className="flex-1 border-b-4 border-indigo-500"></div>
          </div>

          {/* Mobile: card list */}
          <div className="space-y-2 sm:hidden">
            {rows.map((r) => (
              <div key={r.po} className="rounded-2xl border bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">
                    {r.po}
                  </span>
                  <Pill text={statusLabel(r.status.key)} tone={r.status.tone} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>
                    <div className="text-slate-500">
                      {t("International_table_vendor")}
                    </div>
                    <div className="font-medium">{r.vendor}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">
                      {t("International_table_date")}
                    </div>
                    <div className="font-medium">{r.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">
                      {t("International_table_items")}
                    </div>
                    <div className="font-medium">
                      {t("International_table_itemsCount", { n: r.items })}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">
                      {t("International_table_amount")}
                    </div>
                    <div className="font-semibold">{r.amount}</div>
                  </div>
                  <div className="col-span-2 flex gap-2 items-center">
                    <span className="text-slate-500">
                      {t("International_table_priority")}:
                    </span>
                    <Pill
                      text={priorityLabel(r.priority.key)}
                      tone={r.priority.tone}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">
                    {t("International_table_poNo")}
                  </th>
                  <th className="p-2 border">
                    {t("International_table_vendor")}
                  </th>
                  <th className="p-2 border">
                    {t("International_table_date")}
                  </th>
                  <th className="p-2 border">
                    {t("International_table_items")}
                  </th>
                  <th className="p-2 border">
                    {t("International_table_amount")}
                  </th>
                  <th className="p-2 border">
                    {t("International_table_priority")}
                  </th>
                  <th className="p-2 border">
                    {t("International_table_status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.po} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2 border font-semibold text-slate-900">
                      {r.po}
                    </td>
                    <td className="p-2 border">{r.vendor}</td>
                    <td className="p-2 border">{r.date}</td>
                    <td className="p-2 border">
                      {t("International_table_itemsCount", { n: r.items })}
                    </td>
                    <td className="p-2 border font-semibold">{r.amount}</td>
                    <td className="p-2 border">
                      <Pill
                        text={priorityLabel(r.priority.key)}
                        tone={r.priority.tone}
                      />
                    </td>
                    <td className="p-2 border">
                      <Pill
                        text={statusLabel(r.status.key)}
                        tone={r.status.tone}
                      />
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
