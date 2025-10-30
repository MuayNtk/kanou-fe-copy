// src/pages/Hr.jsx
import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useTranslation } from "react-i18next"; // ✅ i18n

// helpers
const todayStr = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
const pad2 = (n) => String(n).padStart(2, "0");
const ymdToStr = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;

// mock leave data
const leaveMock = [
  { date: todayStr(), firstName: "Somchai", lastName: "Sukjai", type: "sick_leave" },
  { date: todayStr(), firstName: "Suda", lastName: "Thongdee", type: "personal_leave" },
  { date: todayStr(), firstName: "Arthit", lastName: "Kraiwong", type: "vacation_leave" },
  { date: todayStr(), firstName: "Mint", lastName: "T.", type: "personal_leave" },
  { date: "2025-09-04", firstName: "Mantasnan", lastName: "K.", type: "vacation_leave" },
  { date: "2025-09-04", firstName: "Dachmon", lastName: "W.", type: "personal_leave" },
  { date: "2025-09-05", firstName: "Mantasnan", lastName: "K.", type: "vacation_leave" },
  { date: "2025-09-05", firstName: "Jira", lastName: "", type: "personal_leave" },
  { date: "2025-09-08", firstName: "Watcharawit", lastName: "", type: "personal_leave" },
  { date: "2025-09-09", firstName: "Watcharawit", lastName: "", type: "personal_leave" },
  { date: "2025-09-10", firstName: "Dachmon", lastName: "", type: "personal_leave" },
  { date: "2025-09-11", firstName: "Dachmon", lastName: "", type: "personal_leave" },
  { date: "2025-09-12", firstName: "Jira", lastName: "", type: "personal_leave" },
];

const groupByDate = (rows) =>
  rows.reduce((acc, r) => {
    (acc[r.date] ||= []).push(r);
    return acc;
  }, {});

function buildMonthMatrix(year, monthIndex0) {
  const first = new Date(year, monthIndex0, 1);
  const last = new Date(year, monthIndex0 + 1, 0);
  const daysInMonth = last.getDate();
  const startDow = first.getDay(); // 0=Sun
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return { rows, daysInMonth };
}

function leaveTag(type, t) {
  switch (type) {
    case "sick_leave":
      return { text: t("sickLeave"), cls: "bg-rose-50 text-rose-700 ring-rose-200" };
    case "personal_leave":
      return { text: t("personalLeave"), cls: "bg-sky-50 text-sky-700 ring-sky-200" };
    case "vacation_leave":
      return { text: t("vacationLeave"), cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
    default:
      return { text: type || t("leave"), cls: "bg-slate-50 text-slate-700 ring-slate-200" };
  }
}

function Hr() {
  const { t } = useTranslation();
  const today = todayStr();

  // month navigation
  const [monthOffset, setMonthOffset] = useState(0);
  const base = new Date();
  const current = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  const y = current.getFullYear();
  const m = current.getMonth();

  const monthMatrix = useMemo(() => buildMonthMatrix(y, m), [y, m]);
  const grouped = useMemo(() => groupByDate(leaveMock), []);
  const monthLabel = new Date(y, m, 1).toLocaleString("en-US", { month: "long", year: "numeric" });

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(today);
  const openModal = (dateStr) => {
    setModalDate(dateStr);
    setModalOpen(true);
  };

  const weekday = [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")];
  const todaysLeaves = grouped[today] || [];
  const overToday = todaysLeaves.length > 2;

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="text-center mt-3">
        <PageHeader title={t("hrTitle")} />
        <div className="mt-1 text-sm text-slate-500">{monthLabel}</div>
      </div>

      {/* Legend + Controls */}
      <div className="mt-2 px-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> {t("today")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-rose-200" /> {t("sick")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-sky-200" /> {t("personal")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-emerald-200" /> {t("vacation")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonthOffset((o) => o - 1)}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-50"
          >
            ‹ {t("prev")}
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-50"
            title={t("backToThisMonth")}
          >
            {t("today")}
          </button>
          <button
            onClick={() => setMonthOffset((o) => o + 1)}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-50"
          >
            {t("next")} ›
          </button>

          {overToday && (
            <button
              onClick={() => openModal(today)}
              className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-2.5 py-1 text-xs text-white hover:bg-indigo-700"
            >
              {t("showAllTodayLeaves", { count: todaysLeaves.length })}
            </button>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div className="px-2 mt-2">
        <div className="bg-white/80 rounded-xl shadow-sm ring-1 ring-black/5 p-2">
          <div className="grid grid-cols-7 gap-1.5 text-[11px] font-medium text-slate-500 px-1">
            {weekday.map((w) => (
              <div key={w} className="text-center py-1">{w}</div>
            ))}
          </div>

          <div className="mt-1 h-[calc(100vh-240px)] sm:h-[calc(100vh-260px)] grid grid-cols-7 grid-rows-6 auto-rows-fr gap-1.5 overflow-hidden">
            {monthMatrix.rows.map((row, ri) =>
              row.map((d, ci) => {
                const dateStr = d ? ymdToStr(y, m, d) : "";
                const isToday = dateStr === today;
                const leaves = d ? grouped[dateStr] || [] : [];

                const visible = leaves.slice(0, 2);
                const extra = Math.max(0, leaves.length - visible.length);

                const clickable = d && leaves.length > 0;

                return (
                  <div
                    key={`${ri}-${ci}`}
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    onClick={clickable ? () => openModal(dateStr) : undefined}
                    className={[
                      "min-h-0 rounded-lg border bg-white p-1.5 text-[11px] flex flex-col overflow-hidden select-none",
                      d ? "border-slate-200" : "border-transparent opacity-40",
                      isToday ? "ring-2 ring-indigo-500" : "",
                      clickable ? "cursor-pointer hover:bg-slate-50" : ""
                    ].join(" ")}
                    title={clickable ? t("showLeavesThisDay") : undefined}
                  >
                    <div className="flex items-center justify-between gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-600">{d || ""}</span>
                        {extra > 0 && (
                          <span className="rounded-full bg-indigo-600/10 text-indigo-700 px-1.5 py-0.5 text-[10px] leading-none ring-1 ring-indigo-200">
                            +{extra}
                          </span>
                        )}
                      </div>
                      {isToday && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                    </div>

                    <div className="mt-1 space-y-1 overflow-hidden">
                      {visible.map((p, idx) => {
                        const tag = leaveTag(p.type, t);
                        return (
                          <div
                            key={idx}
                            className={`inline-flex w-full items-center rounded px-1.5 py-0.5 ring-1 ${tag.cls}`}
                            title={`${p.firstName} ${p.lastName} — ${tag.text}`}
                          >
                            <span className="truncate">{p.firstName} {p.lastName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-[92vw] max-w-md max-h-[80vh] rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{t("leaveList")} — {modalDate}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                aria-label={t("close")}
              >
                ✕
              </button>
            </div>
            <div className="mt-3 divide-y overflow-auto max-h-[56vh]">
              {(grouped[modalDate] || []).map((p, i) => {
                const tag = leaveTag(p.type, t);
                return (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{p.firstName} {p.lastName}</div>
                    </div>
                    <span className={`rounded px-2 py-1 text-xs ring-1 ${tag.cls}`}>{tag.text}</span>
                  </div>
                );
              })}
              {!(grouped[modalDate] || []).length && (
                <div className="py-6 text-center text-slate-500 text-sm">{t("noData")}</div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-white text-sm hover:bg-indigo-700"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hr;
