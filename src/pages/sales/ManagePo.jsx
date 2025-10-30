// src/pages/sales/ManagePo.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  FiSearch,
  FiX,
  FiEye,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

/* helpers */
const toEnGB = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const money = (n) =>
  (Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/* JP status values for logic; color stays by JP */
const statusBadge = (s) => {
  switch (s) {
    case "保留":
      return "bg-amber-400 text-white";
    case "成功":
      return "bg-emerald-500 text-white";
    case "失敗":
      return "bg-red-500 text-white";
    default:
      return "bg-slate-300 text-white";
  }
};

/* translate status for display only */
const displayStatus = (s, t) => {
  switch (s) {
    case "保留":
      return t("ManagePo.status.pending");
    case "成功":
      return t("ManagePo.status.success");
    case "失敗":
      return t("ManagePo.status.failed");
    default:
      return s;
  }
};

/* mock rows */
const MOCK = [
  {
    poNo: "C-PO-20250428-003",
    qtNo: "QT-20250427-003",
    customer: "John Smith",
    date: "2025-04-28",
    amount: 43578,
    status: "保留",
  },
  {
    poNo: "C-PO-20250501-005",
    qtNo: "QT-20250428-005",
    customer: "John Smith",
    date: "2025-05-01",
    amount: 54250,
    status: "成功",
  },
  {
    poNo: "C-PO-20250503-006",
    qtNo: "QT-20250428-006",
    customer: "Suda Tanakul",
    date: "2025-05-03",
    amount: 73500,
    status: "保留",
  },
  {
    poNo: "C-PO-20250505-008",
    qtNo: "QT-20250429-009",
    customer: "Peter Johnson",
    date: "2025-05-05",
    amount: 21900,
    status: "失敗",
  },
];

export default function ManagePo() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* applied filters */
  const [qNo, setQNo] = useState("");
  const [qStatus, setQStatus] = useState("");
  const [qStart, setQStart] = useState("");
  const [qEnd, setQEnd] = useState("");

  /* form filters (type first, search later) */
  const [fNo, setFNo] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fStart, setFStart] = useState("");
  const [fEnd, setFEnd] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;

  const filtered = useMemo(() => {
    let rows = [...MOCK];
    if (qNo.trim()) {
      const key = qNo.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.poNo.toLowerCase().includes(key) ||
          r.qtNo.toLowerCase().includes(key)
      );
    }
    if (qStatus) rows = rows.filter((r) => r.status === qStatus);
    if (qStart) rows = rows.filter((r) => new Date(r.date) >= new Date(qStart));
    if (qEnd) rows = rows.filter((r) => new Date(r.date) <= new Date(qEnd));
    return rows;
  }, [qNo, qStatus, qStart, qEnd]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSearch = () => {
    setQNo(fNo);
    setQStatus(fStatus);
    setQStart(fStart);
    setQEnd(fEnd);
    setPage(1);
  };

  const onClear = () => {
    setFNo("");
    setFStatus("");
    setFStart("");
    setFEnd("");
    setQNo("");
    setQStatus("");
    setQStart("");
    setQEnd("");
    setPage(1);
  };

  return (
    <div>
      <PageHeader title={t("ManagePo.pageTitle")} />

      {/* Add button row */}
      <div className="flex justify-end px-6 mt-5">
        <Link
          to="/sales/manage-po/add"
          className="h-9 px-4 rounded-md bg-[#4b2e83] text-white flex items-center gap-2 hover:opacity-95"
        >
          <FiPlus />
          {t("ManagePo.add")}
        </Link>
      </div>

      {/* Filters */}
      <div className="px-6 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ManagePo.number")}
            </label>
            <input
              value={fNo}
              onChange={(e) => setFNo(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
              placeholder={t("ManagePo.numberPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ManagePo.status")}
            </label>
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            >
              <option value="">{t("ManagePo.all")}</option>
              {/* keep JP values for logic; show translated labels */}
              <option value="保留">{t("ManagePo.status.pending")}</option>
              <option value="成功">{t("ManagePo.status.success")}</option>
              <option value="失敗">{t("ManagePo.status.failed")}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ManagePo.startDate")}
            </label>
            <input
              type="date"
              value={fStart}
              onChange={(e) => setFStart(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ManagePo.endDate")}
            </label>
            <input
              type="date"
              value={fEnd}
              onChange={(e) => setFEnd(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onSearch}
              className="h-9 px-3 rounded-md bg-[#7083c2] text-white flex items-center gap-2 hover:opacity-95"
            >
              <FiSearch /> {t("ManagePo.search")}
            </button>
            <button
              onClick={onClear}
              className="h-9 px-3 rounded-md bg-amber-400 text-white flex items-center gap-2 hover:opacity-95"
            >
              <FiX /> {t("ManagePo.clear")}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 mt-4">
        <div className="overflow-x-auto rounded-md border border-indigo-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 text-indigo-900">
                <th className="px-3 py-2 border-b text-start">{t("ManagePo.th.poNo")}</th>
                <th className="px-3 py-2 border-b text-start">{t("ManagePo.th.qtNo")}</th>
                <th className="px-3 py-2 border-b text-start">{t("ManagePo.th.customer")}</th>
                <th className="px-3 py-2 border-b text-start">{t("ManagePo.th.date")}</th>
                <th className="px-3 py-2 border-b text-right">{t("ManagePo.th.amount")}</th>
                <th className="px-3 py-2 border-b text-center">{t("ManagePo.th.status")}</th>
                <th className="px-3 py-2 border-b text-center">{t("ManagePo.th.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={r.poNo} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-3 py-3 border-t">{r.poNo}</td>
                  <td className="px-3 py-3 border-t">{r.qtNo}</td>
                  <td className="px-3 py-3 border-t">{r.customer}</td>
                  <td className="px-3 py-3 border-t">{toEnGB(r.date)}</td>
                  <td className="px-3 py-3 border-t text-right">{money(r.amount)}</td>

                  {/* Status centered */}
                  <td className="px-3 py-3 border-t text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        r.status
                      )}`}
                      title={displayStatus(r.status, t)}
                    >
                      {displayStatus(r.status, t)}
                    </span>
                  </td>

                  {/* Action icons follow status */}
                  <td className="px-3 py-3 border-t">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      {/* View */}
                      <button
                        type="button"
                        className="text-indigo-700"
                        title={t("ManagePo.view")}
                        onClick={() =>
                          navigate("/sales/manage-po/view", {
                            state: { row: r },
                          })
                        }
                      >
                        <FiEye />
                      </button>

                      {/* icon by status (tooltip translated) */}
                      {r.status === "成功" && (
                        <FiCheckCircle
                          className="text-emerald-500"
                          title={t("ManagePo.status.success")}
                        />
                      )}
                      {r.status === "保留" && (
                        <FiFileText
                          className="text-amber-500"
                          title={t("ManagePo.status.pending")}
                        />
                      )}
                      {r.status === "失敗" && (
                        <FiXCircle className="text-red-500" title={t("ManagePo.status.failed")} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                    {t("ManagePo.noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ManagePo.firstPage")}
          >
            <FiChevronsLeft />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ManagePo.prevPage")}
          >
            <FiChevronLeft />
          </button>
          <span className="px-3 py-1 border rounded bg-white">{page}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ManagePo.nextPage")}
          >
            <FiChevronRight />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ManagePo.lastPage")}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
