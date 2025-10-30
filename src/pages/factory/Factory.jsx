// src/pages/factory/Factory.jsx
import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";
import { FiClock } from "react-icons/fi";

const LS_KEY = "pp_rows"; // ต้องตรงกับที่ PlanProduct จะบันทึก

// map สถานะ -> utilization/สีคร่าวๆ
function statusToLine(status) {
  switch (status) {
    case "in_progress":
      return { lineStatus: "running", util: 55 };
    case "done":
    case "qa_completed":
      return { lineStatus: "running", util: 100 };
    case "planned":
      return { lineStatus: "pause", util: 0 };
    case "pending":
    default:
      return { lineStatus: "down", util: 0 };
  }
}

const repairCards = [
  { key: "RS-001", po: "RE-2025-001", productName: "PCB Board (Type A)", status: "running", utilization: 65 },
  { key: "RS-002", po: "RE-2025-002", productName: "Power Module",       status: "pause",   utilization: 0  },
  { key: "RS-003", po: "RE-2025-003", productName: "Nozzle Assy",         status: "running", utilization: 78 },
  { key: "RS-004", po: "RE-2025-004", productName: "LCD Panel",           status: "down",    utilization: 0  },
  { key: "RS-005", po: "RE-2025-005", productName: "Motor Driver",        status: "running", utilization: 52 },
  { key: "RS-006", po: "RE-2025-006", productName: "Sensor Kit",          status: "pause",   utilization: 0  },
];

// ---------- การ์ด KPI reusable ----------
const StatCard = ({
  tone = "slate",
  icon,
  title,
  value,
  children,
  footer,
  className = "",
}) => {
  const tones = {
    green: "bg-emerald-50 ring-emerald-200",
    red: "bg-rose-50 ring-rose-200",
    yellow: "bg-amber-50 ring-amber-200",
    sky: "bg-sky-50 ring-sky-200",
    indigo: "bg-indigo-50 ring-indigo-200",
    cream: "bg-yellow-50 ring-yellow-200",
    slate: "bg-slate-50 ring-slate-200",
  };
  return (
    <div
      className={[
        // เพิ่มขอบดำให้การ์ดทุกใบของ StatCard
        "rounded-2xl ring-1 border border-black p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-200",
        "relative overflow-hidden",
        tones[tone] || tones.slate,
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-slate-700 text-xs md:text-sm leading-tight">
            {title}
          </div>
          <div className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900 truncate">
            {value}
          </div>
        </div>
        <div className="shrink-0 text-2xl md:text-3xl opacity-80">{icon}</div>
      </div>

      {children ? <div className="mt-3">{children}</div> : null}

      {footer ? (
        <div className="mt-3 pt-3 border-t border-black/10 text-sm">
          {footer}
        </div>
      ) : null}
    </div>
  );
};

function Factory() {
  const { t } = useTranslation();

  // ===== ดึง rows ตรงจาก localStorage =====
  const [rows, setRows] = useState([]);

  // โหลดครั้งแรก
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setRows(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load rows from localStorage", e);
    }
  }, []);

  // ฟังอีเวนต์ storage เผื่ออีกแท็บเซฟ
  useEffect(() => {
    const onStorage = (ev) => {
      if (ev.key === LS_KEY) {
        try {
          setRows(JSON.parse(ev.newValue || "[]"));
        } catch {
          setRows([]);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ===== KPIs (mock) =====
  const kpis = {
    outputToday: 4345,
    outputChange: { sign: "up", value: 12 },

    // ค่าที่จะไปอยู่การ์ดใหม่แถวถัดไป
    totalStock: 12340,
    stockNG: 21,

    // กล่องย่อยการ์ดแรก
    newCount: 7,
    repairCount: 19,

    // การ์ดแทรก
    shipInstructionCount: 5, // 出荷指示書発行
    repairAcceptanceCount: 3, // 修理受付受理票作成

    // การ์ด defect
    defectRate: 1.8,
    defectChange: { sign: "down", value: 0.3 },
    defects: { scrap: 78, hold: 33 },

    // การ์ด Delivery รวม
    deliveryTotal: 124,
  };

  const alerts = [
    { line: "CNC-3", textKey: "Factory_alert_sensor", minsAgo: 2, tone: "red" },
    { line: "INJ-10", textKey: "Factory_alert_highTemp", minsAgo: 15, tone: "amber" },
    { line: "ASM-01", textKey: "Factory_alert_maint", minsAgo: 60, tone: "blue" },
  ];

  // ===== Line status: เปลี่ยนเป็น mockdata (ไม่ดึงจาก localStorage) =====
  const lineCards = useMemo(
    () => [
      { key: "PO-2025-001", po: "PO-2025-001", productName: "Widget A",         status: "running", utilization: 55 },
      { key: "PO-2025-002", po: "PO-2025-002", productName: "Spare Set B",      status: "running", utilization: 100 },
      { key: "PO-2025-003", po: "PO-2025-003", productName: "Precision Unit C", status: "pause",   utilization: 0 },
      { key: "PO-2025-004", po: "PO-2025-004", productName: "Gear Housing D",   status: "running", utilization: 78 },
      { key: "PO-2025-005", po: "PO-2025-005", productName: "Connector E",      status: "running", utilization: 100 },
      { key: "PO-2025-006", po: "PO-2025-006", productName: "Valve Set F",      status: "down",    utilization: 0 },
    ],
    []
  );

  const badgeDot = (status) => {
    if (status === "running") return "bg-emerald-500";
    if (status === "pause") return "bg-orange-400";
    if (status === "down") return "bg-red-500";
    return "bg-slate-300";
  };

  const utilBar = (pct, color) => (
    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );

  return (
    <div>
      <PageHeader title={t("Factory_title")} />

      {/* โซนแดชบอร์ด */}
      <div className="px-6 mt-6 space-y-6 md:space-y-7 lg:space-y-8">
        {/* ===== KPI แถวบน (5 ใบ) ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 md:gap-4">
          {/* 1) Today’s output + New/Repair (ตัด footer Total STOCK ออก) */}
          <div className="relative rounded-2xl border border-black p-3 md:p-4 bg-green-50 pr-28">
            <div className="text-slate-700 text-xs md:text-sm">
              {t("Factory_kpi_outputToday")}
            </div>
            <div className="mt-0.5 text-2xl md:text-3xl font-semibold text-green-800">
              {kpis.outputToday.toLocaleString()}
            </div>

            <div className="mt-1 text-xs md:text-sm">
              <span
                className={`font-medium ${
                  kpis.outputChange.sign === "up" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {kpis.outputChange.sign === "up" ? "↑" : "↓"} {kpis.outputChange.value}%
              </span>{" "}
            </div>

            {/* NEW/REPAIR มุมขวาบน */}
            <div className="absolute top-2 right-3 text-right space-y-1">
              <div>
                <div className="text-[11px] md:text-xs text-slate-700">{t("Factory_new")}</div>
                <div className="text-lg md:text-xl font-bold text-indigo-700 leading-none">
                  {kpis.newCount}
                </div>
              </div>
              <div>
                <div className="text-[11px] md:text-xs text-slate-700">{t("Factory_repair")}</div>
                <div className="text-lg md:text-xl font-bold text-indigo-700 leading-none">
                  {kpis.repairCount}
                </div>
              </div>
            </div>
          </div>

          {/* 2) Shipping Instruction Issued */}
          <StatCard tone="sky" title={t("Factory_kpi_shipInstruction")} value={kpis.shipInstructionCount} />

          {/* 3) Repair Acceptance Slip Created */}
          <StatCard tone="indigo" title={t("Factory_kpi_repairAcceptance")} value={kpis.repairAcceptanceCount} />

          {/* 4) Defect rate + Scrap/Hold (ตัด Stock NG มุมล่างซ้ายออก) */}
          <div className="rounded-2xl border border-black p-3 md:p-4 relative bg-rose-50 ring-1 ring-rose-200 shadow-sm hover:shadow-md transition-all duration-200">
            {/* มุมขวาบน: Scrap / Hold */}
            <div className="absolute top-2 right-3 text-right text-[11px] md:text-xs leading-tight">
              <div className="text-orange-700 font-medium">
                {t("Factory_defect_scrap")}: <span className="font-semibold">{kpis.defects.scrap}</span>
              </div>
              <div className="text-rose-700 font-medium">
                {t("Factory_defect_hold")}: <span className="font-semibold">{kpis.defects.hold}</span>
              </div>
            </div>

            {/* เนื้อหาหลัก */}
            <div className="text-slate-700 text-xs md:text-sm">{t("Factory_kpi_defectRate")}</div>
            <div className="mt-0.5 text-2xl md:text-3xl font-semibold text-rose-700">{kpis.defectRate}%</div>
            <div className="mt-1 text-xs md:text-sm">
              <span
                className={`font-medium ${
                  kpis.defectChange.sign === "down" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {kpis.defectChange.sign === "down" ? "↓" : "↑"} {kpis.defectChange.value} {t("Factory_points")}
              </span>{" "}
            </div>
          </div>

          {/* 5) Delivery Total */}
          <StatCard tone="cream" title={t("Factory_kpi_deliveryTotal")} value={kpis.deliveryTotal} />
        </div>

        {/* ===== แถวใหม่ใต้แถวแรก: Total STOCK + Stock NG ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 md:gap-4">
          {/* ทำให้ดูบาลานซ์: วาง 2 ใบ กินความกว้างเท่า 3/6 (ครึ่งแถว) บน xl */}
          <StatCard
            tone="slate"
            className="xl:col-span-3"
            title={t("Factory_kpi_totalStock")}
            value={kpis.totalStock.toLocaleString()}
          />
          <StatCard
            tone="red"
            className="xl:col-span-3"
            title={t("Factory_kpi_stockNG")}
            value={kpis.stockNG}
          />
        </div>

        {/* ===== สถานะจาก PO ===== */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
            <div className="text-slate-900 font-semibold text-sm md:text-base">
              {t("Factory_lineStatus_title")}
            </div>
            <div className="text-[11px] md:text-xs text-slate-500">({t("Factory_updated")})</div>
          </div>

          {/* legend */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-slate-600 mb-2.5 md:mb-3">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500" />
              {t("Factory_status_running")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-orange-400" />
              {t("Factory_status_pause")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500" />
              {t("Factory_status_down")}
            </span>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3">
            {lineCards.map((ln) => (
              <div key={ln.key} className="rounded-xl border border-black p-3 md:p-4 bg-white">
                <div className="flex items-start justify-between">
                  <div className="font-medium text-sm md:text-base leading-tight">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${badgeDot(ln.status)}`} />
                      <span>{ln.po}</span>
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-slate-600">{ln.productName}</div>
                  </div>
                  <div className="text-slate-500 text-xs md:text-sm whitespace-nowrap">
                    {t("Factory_utilization", { pct: ln.utilization })}
                  </div>
                </div>
                {utilBar(
                  ln.utilization,
                  ln.status === "running"
                    ? "bg-emerald-500"
                    : ln.status === "pause"
                    ? "bg-orange-400"
                    : "bg-red-500"
                )}
              </div>
            ))}

            {!lineCards.length &&
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={`ph-${i}`} className="rounded-xl border border-black p-3 md:p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm md:text-base leading-tight">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-300" />
                        <span className="text-slate-400">PO —</span>
                      </div>
                      <div className="mt-1 text-xs md:text-sm text-slate-400">–</div>
                    </div>
                    <div className="text-slate-400 text-xs md:text-sm">Utilization 0%</div>
                  </div>
                  {utilBar(0, "bg-slate-300")}
                </div>
              ))}
          </div>
        </div>

        {/* ===== Repair service ===== */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
            <div className="text-slate-900 font-semibold text-sm md:text-base">
              {t("Factory_repair_service")}
            </div>
          </div>

          {/* legend */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-slate-600 mb-2.5 md:mb-3">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500" />
              {t("Factory_status_running")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-orange-400" />
              {t("Factory_status_pause")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500" />
              {t("Factory_status_down")}
            </span>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3">
            {repairCards.map((ln) => (
              <div key={ln.key} className="rounded-xl border border-black p-3 md:p-4 bg-white">
                <div className="flex items-start justify-between">
                  <div className="font-medium text-sm md:text-base leading-tight">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${badgeDot(ln.status)}`} />
                      <span>{ln.po}</span>
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-slate-600">{ln.productName}</div>
                  </div>
                  <div className="text-slate-500 text-xs md:text-sm whitespace-nowrap">
                    {t("Factory_utilization", { pct: ln.utilization })}
                  </div>
                </div>
                {utilBar(
                  ln.utilization,
                  ln.status === "running"
                    ? "bg-emerald-500"
                    : ln.status === "pause"
                    ? "bg-orange-400"
                    : "bg-red-500"
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== การแจ้งเตือน ===== */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
            <div className="text-slate-900 font-semibold text-sm md:text-base">
              {t("Factory_alerts_title")}
            </div>
            <div className="text-[11px] md:text-xs text-slate-500">({t("Factory_updated")})</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {alerts.map((a, i) => {
              const tone =
                a.tone === "red"
                  ? "bg-red-50 text-red-800"
                  : a.tone === "amber"
                  ? "bg-amber-50 text-amber-800"
                  : "bg-sky-50 text-sky-800";
              return (
                // บังคับขอบดำที่การ์ดแจ้งเตือน
                <div key={i} className={`rounded-2xl border border-black p-3 md:p-4 ${tone}`}>
                  <div className="font-semibold mb-0.5 md:mb-1 text-sm md:text-base">
                    {a.line} - {t(a.textKey)}
                  </div>
                  <div className="text-xs md:text-sm opacity-80 flex items-center gap-1.5 md:gap-2">
                    <FiClock className="shrink-0" />
                    {t("Factory_minutesAgo", { m: a.minsAgo })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Factory;
