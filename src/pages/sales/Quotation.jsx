// src/pages/sales/Quotation.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  FiSearch,
  FiX,
  FiEye,
  FiEdit2,
  FiXCircle,
  FiChevronLeft,
  FiChevronsLeft,
  FiChevronRight,
  FiChevronsRight,
  FiPlus,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

const toEnGB = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const money = (n) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

// สี Badge ตามสถานะ (เก็บค่าตามอังกฤษเดิมเพื่อไม่กระทบลอจิก)
const statusStyle = (s) => {
  switch (s) {
    case "Draft":
      return "bg-slate-500 text-white";
    case "Sent":
      return "bg-indigo-500 text-white";
    case "Approved":
      return "bg-emerald-500 text-white";
    case "Rejected":
      return "bg-red-500 text-white";
    case "Expired":
      return "bg-gray-500 text-white";
    default:
      return "bg-slate-300 text-white";
  }
};

// label แสดงผลตามภาษา แต่ value ในข้อมูลยังเป็นอังกฤษ
const statusLabel = (t, s) => {
  switch (s) {
    case "Draft":
      return t("Quotation.statusDraft");
    case "Sent":
      return t("Quotation.statusSent");
    case "Approved":
      return t("Quotation.statusApproved");
    case "Rejected":
      return t("Quotation.statusRejected");
    case "Expired":
      return t("Quotation.statusExpired");
    default:
      return s;
  }
};

const MOCK = [
  {
    no: "QT-20250427-001",
    date: "2025-04-27",
    customer: "Somchai Meesuk",
    total: 20000,
    expiry: "2025-05-27",
    status: "Draft",
  },
  {
    no: "QT-20250427-002",
    date: "2025-04-27",
    customer: "Anong Rakdee",
    total: 30000,
    expiry: "2025-04-28",
    status: "Sent",
  },
  {
    no: "QT-20250427-003",
    date: "2025-04-27",
    customer: "Peter Johnson",
    total: 10000,
    expiry: "2025-05-27",
    status: "Approved",
  },
  {
    no: "QT-20250428-004",
    date: "2025-04-28",
    customer: "John Smith",
    total: 40000,
    expiry: "2025-04-28",
    status: "Rejected",
  },
  {
    no: "QT-20250427-005",
    date: "2025-04-28",
    customer: "John Smith",
    total: 12000,
    expiry: "2025-05-28",
    status: "Approved",
  },
  {
    no: "QT-20250427-006",
    date: "2025-04-28",
    customer: "Suda Tanakul",
    total: 21000,
    expiry: "2025-05-28",
    status: "Approved",
  },
  {
    no: "QT-20250429-007",
    date: "2025-04-29",
    customer: "John Smith",
    total: 31000,
    expiry: "2025-04-29",
    status: "Expired",
  },
];

export default function Quotation() {
  const { t } = useTranslation();

  // filters ที่ใช้งานจริง
  const [qNo, setQNo] = useState("");
  const [qStatus, setQStatus] = useState("");
  const [qStart, setQStart] = useState("");
  const [qEnd, setQEnd] = useState("");

  // form filters (พิมพ์ก่อน ค่อยกดค้น)
  const [fNo, setFNo] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fStart, setFStart] = useState("");
  const [fEnd, setFEnd] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;

  const filtered = useMemo(() => {
    let rows = [...MOCK];
    if (qNo.trim())
      rows = rows.filter((r) => r.no.toLowerCase().includes(qNo.toLowerCase()));
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
      <PageHeader title={t("Quotation.pageTitle")} />

      {/* Add button row */}
      <div className="flex justify-end px-6 mt-4">
        <Link
          to="/sales/quotation/add"
          className="h-9 px-4 rounded-md bg-[#4b2e83] text-white flex items-center gap-2 hover:opacity-95"
        >
          <FiPlus />
          {t("Quotation.add")}
        </Link>
      </div>

      {/* Filters */}
      <div className="px-6 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("Quotation.lblNumber")}
            </label>
            <input
              value={fNo}
              onChange={(e) => setFNo(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
              placeholder={t("Quotation.phQuoteNo")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("Quotation.lblStatus")}
            </label>
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            >
              <option value="">{t("Quotation.optAll")}</option>
              {/* ค่าที่ส่ง/เก็บยังเป็นอังกฤษเดิม */}
              <option>Draft</option>
              <option>Sent</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("Quotation.lblStart")}
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
              {t("Quotation.lblEnd")}
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
              <FiSearch /> {t("Quotation.search")}
            </button>
            <button
              onClick={onClear}
              className="h-9 px-3 rounded-md bg-amber-400 text-white flex items-center gap-2 hover:opacity-95"
            >
              <FiX /> {t("Quotation.clear")}
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
                <th className="px-3 py-2 border-b text-start">
                  {t("Quotation.thNo")}
                </th>
                <th className="px-3 py-2 border-b text-start">
                  {t("Quotation.thDate")}
                </th>
                <th className="px-3 py-2 border-b text-start">
                  {t("Quotation.thCustomer")}
                </th>
                <th className="px-3 py-2 border-b text-start">
                  {t("Quotation.thTotal")}
                </th>
                <th className="px-3 py-2 border-b text-start">
                  {t("Quotation.thExpiry")}
                </th>
                <th className="px-3 py-2 border-b text-start">
                  {t("Quotation.thStatus")}
                </th>
                <th className="px-3 py-2 border-b text-center">
                  {t("Quotation.thActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={r.no} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-3 py-3 border-t">{r.no}</td>
                  <td className="px-3 py-3 border-t">{toEnGB(r.date)}</td>
                  <td className="px-3 py-3 border-t">{r.customer}</td>
                  <td className="px-3 py-3 border-t text-start">
                    {money(r.total)}
                  </td>
                  <td className="px-3 py-3 border-t">{toEnGB(r.expiry)}</td>
                  <td className="px-3 py-3 border-t">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                        r.status
                      )}`}
                    >
                      {statusLabel(t, r.status)}
                    </span>
                  </td>
                  <td className="px-3 py-3 border-t">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button className="text-indigo-700" title={t("Quotation.actView")}>
                        <FiEye />
                      </button>
                      <button className="text-amber-600" title={t("Quotation.actEdit")}>
                        <FiEdit2 />
                      </button>
                      <button className="text-red-600" title={t("Quotation.actDelete")}>
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                    {t("Quotation.noData")}
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
            title={t("Quotation.pgFirst")}
          >
            <FiChevronsLeft />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
            title={t("Quotation.pgPrev")}
          >
            <FiChevronLeft />
          </button>
          <span className="px-3 py-1 border rounded bg-white">{page}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("Quotation.pgNext")}
          >
            <FiChevronRight />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("Quotation.pgLast")}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
