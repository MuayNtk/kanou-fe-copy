// src/pages/sales/ShippingInstruction.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiEye,
  FiEdit2,
  FiXCircle,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

/* helpers */
const toEnGB = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const statusBadge = (s) => {
  switch (s) {
    case "Draft":
      return "bg-blue-700 text-white";         // 青濃い
    case "Processing":
      return "bg-blue-400 text-white";         // 青
    case "Approved":
      return "bg-emerald-500 text-white";      // 緑
    default:
      return "bg-slate-300 text-white";
  }
};

/* mock rows */
const MOCK = [
  { siNo: "SI-20250430-001", date: "2025-04-30", poNo: "—",               customer: "Suda Tanakul",    status: "Draft" },
  { siNo: "SI-20250430-002", date: "2025-04-30", poNo: "C-PO-20250429-005", customer: "Anong Rakdee",   status: "Processing" },
  { siNo: "SI-20250430-003", date: "2025-04-30", poNo: "C-PO-20250429-002", customer: "Peter Johnson",  status: "Approved" },
];

export default function ShippingInstruction() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // applied filters
  const [qNo, setQNo] = useState("");
  const [qStatus, setQStatus] = useState("");
  const [qStart, setQStart] = useState("");
  const [qEnd, setQEnd] = useState("");

  // form filters
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
          r.siNo.toLowerCase().includes(key) ||
          r.poNo.toLowerCase().includes(key) ||
          r.customer.toLowerCase().includes(key)
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
    setFNo(""); setFStatus(""); setFStart(""); setFEnd("");
    setQNo(""); setQStatus(""); setQStart(""); setQEnd("");
    setPage(1);
  };

  return (
    <div>
      <PageHeader title={t("ShippingInstruction_pageHeader")} />

      {/* Add button */}
      <div className="flex justify-end px-6 mt-5">
        <Link
          to="/sales/shippinginstruction/add"
          className="h-9 px-4 rounded-md bg-[#4b2e83] text-white flex items-center gap-2 hover:opacity-95"
        >
          <FiPlus />
          {t("ShippingInstruction_add")}
        </Link>
      </div>

      {/* Filters */}
      <div className="px-6 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingInstruction_filterNumberLabel")}
            </label>
            <input
              value={fNo}
              onChange={(e) => setFNo(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
              placeholder={t("ShippingInstruction_filterNumberPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingInstruction_filterStatusLabel")}
            </label>
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            >
              <option value="">{t("ShippingInstruction_filterStatusAll")}</option>
              <option value="Draft">{t("ShippingInstruction_status_Draft")}</option>
              <option value="Processing">{t("ShippingInstruction_status_Processing")}</option>
              <option value="Approved">{t("ShippingInstruction_status_Approved")}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingInstruction_filterStartDateLabel")}
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
              {t("ShippingInstruction_filterEndDateLabel")}
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
              <FiSearch /> {t("ShippingInstruction_search")}
            </button>
            <button
              onClick={onClear}
              className="h-9 px-3 rounded-md bg-amber-400 text-white flex items-center gap-2 hover:opacity-95"
            >
              <FiX /> {t("ShippingInstruction_clear")}
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
                <th className="px-3 py-2 border-b text-start">{t("ShippingInstruction_thSiNo")}</th>
                <th className="px-3 py-2 border-b text-start">{t("ShippingInstruction_thDate")}</th>
                <th className="px-3 py-2 border-b text-start">{t("ShippingInstruction_thPoNo")}</th>
                <th className="px-3 py-2 border-b text-start">{t("ShippingInstruction_thCustomer")}</th>
                <th className="px-3 py-2 border-b text-center">{t("ShippingInstruction_thStatus")}</th>
                <th className="px-3 py-2 border-b text-center">{t("ShippingInstruction_thActions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={r.siNo} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-3 py-3 border-t">{r.siNo}</td>
                  <td className="px-3 py-3 border-t">{toEnGB(r.date)}</td>
                  <td className="px-3 py-3 border-t">{r.poNo}</td>
                  <td className="px-3 py-3 border-t">{r.customer}</td>

                  {/* Status */}
                  <td className="px-3 py-3 border-t text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        r.status
                      )}`}
                    >
                      {t(`ShippingInstruction_status_${r.status}`)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 border-t">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button
                        type="button"
                        className="text-indigo-700"
                        title={t("ShippingInstruction_action_view")}
                        onClick={() =>
                          navigate("/sales/shipping-instruction/view", {
                            state: { row: r },
                          })
                        }
                      >
                        <FiEye />
                      </button>

                      {r.status !== "Approved" && (
                        <>
                          <button
                            type="button"
                            className="text-amber-600"
                            title={t("ShippingInstruction_action_edit")}
                            onClick={() =>
                              navigate("/sales/shipping-instruction/edit", {
                                state: { row: r },
                              })
                            }
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            className="text-red-600"
                            title={t("ShippingInstruction_action_delete")}
                            onClick={() => alert(`${t("ShippingInstruction_action_delete")} ${r.siNo}`)}
                          >
                            <FiXCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    {t("ShippingInstruction_noData")}
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
          >
            <FiChevronsLeft />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
          >
            <FiChevronLeft />
          </button>
          <span className="px-3 py-1 border rounded bg-white">{page}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
          >
            <FiChevronRight />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
