// src/pages/purchasing/Procurement.jsx
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

const money0 = (n) =>
  (Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const statusBadge = (s) => {
  switch (s) {
    case "Success":
      return "bg-emerald-500 text-white";
    case "Waiting":
      return "bg-amber-400 text-white";
    case "Approved":
      return "bg-blue-600 text-white";
    default:
      return "bg-slate-300 text-white";
  }
};

/* mock data (ตามภาพ) */
const MOCK = [
  {
    poNo: "PO-2505-001",
    supplier: "Tech Supply Co.",
    date: "2025-04-30",
    amount: 12000,
    status: "Success",
  },
  {
    poNo: "PO-2505-002",
    supplier: "Office Deco Corp.",
    date: "2025-04-30",
    amount: 23000,
    status: "Success",
  },
  {
    poNo: "PO-2505-003",
    supplier: "Global Bags Ltd.",
    date: "2025-04-30",
    amount: 20000,
    status: "Waiting",
  },
  {
    poNo: "PO-2505-004",
    supplier: "Tech Supply Co.",
    date: "2025-04-30",
    amount: 40000,
    status: "Approved",
  },
];

export default function Procurement() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* applied filters */
  const [qNo, setQNo] = useState("");
  const [qSupplier, setQSupplier] = useState("");
  const [qStatus, setQStatus] = useState("");

  /* form filters (type first, search later) */
  const [fNo, setFNo] = useState("");
  const [fSupplier, setFSupplier] = useState("");
  const [fStatus, setFStatus] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;

  const supplierOptions = useMemo(
    () => ["", ...Array.from(new Set(MOCK.map((m) => m.supplier)))],
    []
  );

  const filtered = useMemo(() => {
    let rows = [...MOCK];
    if (qNo.trim()) {
      const key = qNo.toLowerCase();
      rows = rows.filter((r) => r.poNo.toLowerCase().includes(key));
    }
    if (qSupplier) rows = rows.filter((r) => r.supplier === qSupplier);
    if (qStatus) rows = rows.filter((r) => r.status === qStatus);
    return rows;
  }, [qNo, qSupplier, qStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSearch = () => {
    setQNo(fNo);
    setQSupplier(fSupplier);
    setQStatus(fStatus);
    setPage(1);
  };

  const onClear = () => {
    setFNo("");
    setFSupplier("");
    setFStatus("");
    setQNo("");
    setQSupplier("");
    setQStatus("");
    setPage(1);
  };

  // สร้าง label ของสถานะจาก i18n (ไม่กระทบลอจิก ตัวค่า status ยังใช้อังกฤษ)
  const statusLabel = (s) => {
    const key = String(s || "").toLowerCase();
    if (key === "success") return t("Procurement.status.success");
    if (key === "waiting") return t("Procurement.status.waiting");
    if (key === "approved") return t("Procurement.status.approved");
    return s || "-";
  };

  return (
    <div>
      <PageHeader title={t("Procurement.pageTitle")} />

      {/* Add button */}
      <div className="flex justify-end px-6 mt-5">
        <Link
          to="/purchasing/procurement/add"
          className="h-9 px-4 rounded-md bg-[#4b2e83] text-white flex items-center gap-2 hover:opacity-95"
        >
          <FiPlus />
          {t("Procurement.add")}
        </Link>
      </div>

      {/* Filters */}
      <div className="px-6 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("Procurement.filters.number.label")}
            </label>
            <input
              value={fNo}
              onChange={(e) => setFNo(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
              placeholder={t("Procurement.filters.number.placeholder")}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">
              {t("Procurement.filters.supplier.label")}
            </label>
            <select
              value={fSupplier}
              onChange={(e) => setFSupplier(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            >
              {supplierOptions.map((s) => (
                <option key={s} value={s}>
                  {s ? s : t("Procurement.filters.supplier.all")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("Procurement.filters.status.label")}
            </label>
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            >
              <option value="">{t("Procurement.filters.status.all")}</option>
              {/* value คงเป็นอังกฤษเพื่อให้ตัวกรองทำงานเหมือนเดิม */}
              <option value="Success">{t("Procurement.status.success")}</option>
              <option value="Waiting">{t("Procurement.status.waiting")}</option>
              <option value="Approved">{t("Procurement.status.approved")}</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onSearch}
              className="h-9 px-3 rounded-md bg-[#7083c2] text-white flex items-center gap-2 hover:opacity-95"
            >
              <FiSearch /> {t("Procurement.filters.search")}
            </button>
            <button
              onClick={onClear}
              className="h-9 px-3 rounded-md bg-amber-400 text-white flex items-center gap-2 hover:opacity-95"
            >
              <FiX /> {t("Procurement.filters.clear")}
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
                <th className="px-3 py-2 border-b text-start">{t("Procurement.table.poNo")}</th>
                <th className="px-3 py-2 border-b text-start">{t("Procurement.table.supplier")}</th>
                <th className="px-3 py-2 border-b text-start">{t("Procurement.table.date")}</th>
                <th className="px-3 py-2 border-b text-right">{t("Procurement.table.amount")}</th>
                <th className="px-3 py-2 border-b text-center">{t("Procurement.table.status")}</th>
                <th className="px-3 py-2 border-b text-center">{t("Procurement.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={r.poNo} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-3 py-3 border-t">{r.poNo}</td>
                  <td className="px-3 py-3 border-t">{r.supplier}</td>
                  <td className="px-3 py-3 border-t">{toEnGB(r.date)}</td>
                  <td className="px-3 py-3 border-t text-right">{money0(r.amount)}</td>

                  {/* status center */}
                  <td className="px-3 py-3 border-t text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        r.status
                      )}`}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </td>

                  {/* action icons */}
                  <td className="px-3 py-3 border-t">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button
                        type="button"
                        className="text-indigo-700"
                        title={t("Procurement.rowActions.view")}
                        onClick={() =>
                          navigate("/purchasing/procurement/view", { state: { row: r } })
                        }
                      >
                        <FiEye />
                      </button>
                      <button
                        type="button"
                        className="text-amber-600"
                        title={t("Procurement.rowActions.edit")}
                        onClick={() =>
                          navigate("/purchasing/procurement/edit", { state: { row: r } })
                        }
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        className="text-red-600"
                        title={t("Procurement.rowActions.delete")}
                        onClick={() => alert(`Delete ${r.poNo}`)}
                      >
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    {t("Procurement.table.noData")}
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
            aria-label={t("Procurement.pagination.first")}
            title={t("Procurement.pagination.first")}
          >
            <FiChevronsLeft />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
            aria-label={t("Procurement.pagination.prev")}
            title={t("Procurement.pagination.prev")}
          >
            <FiChevronLeft />
          </button>
          <span className="px-3 py-1 border rounded bg-white">{page}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            aria-label={t("Procurement.pagination.next")}
            title={t("Procurement.pagination.next")}
          >
            <FiChevronRight />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            aria-label={t("Procurement.pagination.last")}
            title={t("Procurement.pagination.last")}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
