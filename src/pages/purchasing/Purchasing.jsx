// src/pages/purchasing/Purchasing.jsx
import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";
import {
  Package,        // จำนวนสินค้า/วัสดุ
  Globe2,         // จากจีน
  DollarSign,     // STOCK รวม (มูลค่า)
  CalendarDays,   // จำนวนที่ซื้อรายเดือน
} from "lucide-react";

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
    blue:
      "bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
    red:
      "bg-rose-100 text-rose-800 border border-rose-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
    gray:
      "bg-gray-100 text-gray-800 border border-gray-200 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
  };
  return <span className={tones[tone] || tones.gray}>{text}</span>;
}

export default function Purchasing() {
  const { t } = useTranslation();

  // ===== mock data ให้ตรงภาพ =====
  const kpis = {
    // 1) จำนวนสินค้าและวัสดุ (รายเดือน)
    monthlyItemsMaterials: { value: 248, delta: 12, up: true },

    // 2) สินค้า/วัสดุจากจีน
    chinaSku: { value: 12, delta: 8, up: true },

    // 3) STOCK รวม (มูลค่ารวม)
    totalStockValue: { value: "2000",  delta: 12, up: true },

    // 4) จำนวนที่ซื้อรายเดือน
    monthlyPOs: { value: 5, delta: 2, up: false },
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

  const priorityLabel = (k) =>
    ({
      urgent: t("Purchasing_priority_urgent"),
      high: t("Purchasing_priority_high"),
      medium: t("Purchasing_priority_medium"),
      low: t("Purchasing_priority_low"),
    }[k] || "-");

  const statusLabel = (k) =>
    ({
      approved: t("Purchasing_status_approved"),
      processing: t("Purchasing_status_processing"),
      sent: t("Purchasing_status_sent"),
      rejected: t("Purchasing_status_rejected"),
      late: t("Purchasing_status_late"),
    }[k] || "-");

  return (
    <div>
      <PageHeader title={t("Purchasing_pageTitle")} />

      {/* Dashboard */}
      <div className="px-4 sm:px-6 mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        {/* KPI row (4 ใบเรียงตามภาพ) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard
            icon={<Package className="w-5 h-5" />}
            label={t("Purchasing_kpi_monthlyItemsMaterials")}
            value={kpis.monthlyItemsMaterials.value}
            delta={kpis.monthlyItemsMaterials.delta}
            up={kpis.monthlyItemsMaterials.up}
            className="border-black bg-green-50"
          />
          <KpiCard
            icon={<Package className="w-5 h-5" />}
            label={t("Purchasing_kpi_chinaSku")}
            value={kpis.chinaSku.value}
            delta={kpis.chinaSku.delta}
            up={kpis.chinaSku.up}
            className="border-black bg-blue-50"
          />
          <KpiCard
            icon={<Package className="w-5 h-5" />}
            label={t("Purchasing_kpi_totalStock")}
            value={kpis.totalStockValue.value}
            unit={kpis.totalStockValue.unit}
            delta={kpis.totalStockValue.delta}
            up={kpis.totalStockValue.up}
            className="border-black bg-red-50"
          />
          <KpiCard
            icon={<CalendarDays className="w-5 h-5" />}
            label={t("Purchasing_kpi_monthlyPOs")}
            value={kpis.monthlyPOs.value}
            delta={kpis.monthlyPOs.delta}
            up={kpis.monthlyPOs.up}
            className="border-black bg-yellow-50"
          />
        </div>

        {/* Latest orders */}
        <div className="mt-1 sm:mt-2">
          {/* หัวข้อแบบมีเส้นน้ำเงิน */}
          <div className="flex items-center mb-3">
            <span className="text-sm sm:text-base font-semibold pr-3 bg-white text-slate-900">
              {t("Purchasing_latest_title")}
            </span>
            <div className="flex-1 border-b-4 border-indigo-500"></div>
          </div>

          {/* Mobile: card list */}
          <div className="space-y-2 sm:hidden">
            {rows.map((r) => (
              <div key={r.po} className="rounded-2xl border bg-white p-3">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/purchasing/order/${r.po}`}
                    className="font-semibold text-indigo-700 text-sm hover:underline"
                  >
                    {r.po}
                  </Link>
                  <Pill text={statusLabel(r.status.key)} tone={r.status.tone} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>
                    <div className="text-slate-500">
                      {t("Purchasing_table_vendor")}
                    </div>
                    <div className="font-medium">{r.vendor}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">
                      {t("Purchasing_table_date")}
                    </div>
                    <div className="font-medium">{r.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">
                      {t("Purchasing_table_items")}
                    </div>
                    <div className="font-medium">
                      {t("Purchasing_table_itemsCount", { n: r.items })}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">
                      {t("Purchasing_table_amount")}
                    </div>
                    <div className="font-semibold">{r.amount}</div>
                  </div>
                  <div className="col-span-2 flex gap-2 items-center">
                    <span className="text-slate-500">
                      {t("Purchasing_table_priority")}:
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
                  <th className="p-2 border">{t("Purchasing_table_poNo")}</th>
                  <th className="p-2 border">{t("Purchasing_table_vendor")}</th>
                  <th className="p-2 border">{t("Purchasing_table_date")}</th>
                  <th className="p-2 border">{t("Purchasing_table_items")}</th>
                  <th className="p-2 border">{t("Purchasing_table_amount")}</th>
                  <th className="p-2 border">
                    {t("Purchasing_table_priority")}
                  </th>
                  <th className="p-2 border">{t("Purchasing_table_status")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.po} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2 border font-semibold text-slate-900">
                      <Link
                        to={`/purchasing/order/${r.po}`}
                        className="hover:underline"
                      >
                        {r.po}
                      </Link>
                    </td>
                    <td className="p-2 border">{r.vendor}</td>
                    <td className="p-2 border">{r.date}</td>
                    <td className="p-2 border">
                      {t("Purchasing_table_itemsCount", { n: r.items })}
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
