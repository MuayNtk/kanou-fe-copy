// src/pages/accounting/IssueInvoice.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiEye, FiPlusCircle, FiFileText, FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const rows = [
  { no: "INV-001", date: "2025-04-20", po: { id: "PO-20250428-003", link: "#" }, customer: "Somchai Meesuk", total: 43549, status: "Add", actions: ["add", "view", "doc"] },
  { no: "INV-002", date: "2025-04-20", po: { id: "PO-20250501-005", link: "#" }, customer: "Anong Rakdee", total: 54250, status: "Success", actions: ["view", "check"] },
  { no: "INV-003", date: "2025-04-20", po: { id: "PO-20250503-006", link: "#" }, customer: "Peter Johnson", total: 73500, status: "Waiting", actions: ["view"] },
  { no: "INV-004", date: "2025-04-21", po: { id: "PO-20250510-007", link: "#" }, customer: "Suda Thongdee", total: 12000, status: "Success", actions: ["view", "check"] },
  { no: "INV-005", date: "2025-04-21", po: { id: "PO-20250511-008", link: "#" }, customer: "Arthit K.", total: 9000, status: "Waiting", actions: ["view"] },
  { no: "INV-006", date: "2025-04-22", po: { id: "PO-20250512-009", link: "#" }, customer: "Nicha P.", total: 22000, status: "Success", actions: ["view", "check"] },
  { no: "INV-007", date: "2025-04-23", po: { id: "PO-20250513-010", link: "#" }, customer: "Alpha Co.", total: 15000, status: "Waiting", actions: ["view"] },
  { no: "INV-008", date: "2025-04-24", po: { id: "PO-20250514-011", link: "#" }, customer: "Beta Ltd.", total: 18000, status: "Success", actions: ["view", "check"] },
];

const formatThaiDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543}`;
};
const thb = (n) => n.toLocaleString("th-TH") + " THB";

const statusBadge = (status) => {
  const base = "px-3 py-1 rounded-full text-white text-sm";
  if (status === "Add") return `${base} bg-blue-500`;
  if (status === "Success") return `${base} bg-green-500`;
  if (status === "Waiting") return `${base} bg-yellow-500`;
  return `${base} bg-gray-400`;
};

export default function IssueInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // filters
  const [no, setNo] = useState("");
  const [stat, setStat] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // search result
  const [result, setResult] = useState(rows);

  // pagination
  const PAGE_SIZE = 7;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return result.slice(startIdx, startIdx + PAGE_SIZE);
  }, [result, page]);

  // status label (ใช้ i18n โดยอิงค่าภายในเดิม Add/Success/Waiting)
  const statusLabel = (status) => {
    if (status === "Add") return t("IssueInvoice.status.Add");
    if (status === "Success") return t("IssueInvoice.status.Success");
    if (status === "Waiting") return t("IssueInvoice.status.Waiting");
    return status;
  };

  // search
  const handleSearch = () => {
    const sNo = no.trim().toLowerCase();
    const sStat = stat;
    const sDate = start ? new Date(start) : null;
    const eDate = end ? new Date(end) : null;

    const res = rows.filter((r) => {
      const okNo = sNo ? r.no.toLowerCase().includes(sNo) : true;
      const okStat = sStat ? r.status === sStat : true;
      const d = new Date(r.date);
      const okStart = sDate ? d >= sDate : true;
      const okEnd = eDate ? d <= eDate : true;
      return okNo && okStat && okStart && okEnd;
    });
    setResult(res);
    setPage(1);
  };

  const handleClear = () => {
    setNo("");
    setStat("");
    setStart("");
    setEnd("");
    setResult(rows);
    setPage(1);
  };

  const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="">
      {/* title ใช้คีย์ที่มีคำนำหน้าชื่อไฟล์ */}
      <PageHeader title={t("IssueInvoice.title")} />

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-end gap-4">
        <div>
          <div className="text-sm text-blue-700 mb-1">{t("IssueInvoice.filter.number")}</div>
          <input
            value={no}
            onChange={(e) => setNo(e.target.value)}
            className="w-40 rounded-md border border-blue-200 px-3 py-2"
          />
        </div>

        <div>
          <div className="text-sm text-blue-700 mb-1">{t("IssueInvoice.filter.status")}</div>
          <select
            value={stat}
            onChange={(e) => setStat(e.target.value)}
            className="w-40 rounded-md border border-blue-200 px-3 py-2"
          >
            <option value="">{t("IssueInvoice.filter.all")}</option>
            <option value="Add">{t("IssueInvoice.status.Add")}</option>
            <option value="Success">{t("IssueInvoice.status.Success")}</option>
            <option value="Waiting">{t("IssueInvoice.status.Waiting")}</option>
          </select>
        </div>

        <div>
          <div className="text-sm text-blue-700 mb-1">{t("IssueInvoice.filter.startDate")}</div>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-40 rounded-md border border-blue-200 px-3 py-2"
          />
        </div>

        <div>
          <div className="text-sm text-blue-700 mb-1">{t("IssueInvoice.filter.endDate")}</div>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-40 rounded-md border border-blue-200 px-3 py-2"
          />
        </div>

        <button
          onClick={handleSearch}
          className="h-10 w-10 rounded-md bg-blue-500 text-white text-lg flex items-center justify-center"
          title={t("IssueInvoice.btn.search")}
        >
          🔍
        </button>
        <button
          onClick={handleClear}
          className="h-10 w-10 rounded-md bg-yellow-400 text-white text-lg flex items-center justify-center"
          title={t("IssueInvoice.btn.clear")}
        >
          ✖
        </button>
      </div>

      <div className="mt-4 border-t-2 border-blue-200" />

      {/* Table */}
      <div className="mt-3 overflow-x-auto rounded-lg">
        <table className="min-w-[950px] sm:min-w-full w-full border-collapse">
          <thead className="text-blue-900">
            <tr>
              <th className="px-4 py-3 border-b-2 border-blue-200 text-left">
                {t("IssueInvoice.table.invoiceNo")}
              </th>
              <th className="px-4 py-3 border-b-2 border-blue-200 text-left">
                {t("IssueInvoice.table.date")}
              </th>
              <th className="px-4 py-3 border-b-2 border-blue-200 text-left">
                {t("IssueInvoice.table.poNo")}
              </th>
              <th className="px-4 py-3 border-b-2 border-blue-200 text-left">
                {t("IssueInvoice.table.customer")}
              </th>
              <th className="px-4 py-3 border-b-2 border-blue-200 text-left">
                {t("IssueInvoice.table.totalAmount")}
              </th>
              <th className="px-4 py-3 border-b-2 border-blue-200 text-left">
                {t("IssueInvoice.table.status")}
              </th>
              <th className="px-4 py-3 border-b-2 border-blue-200 text-left">
                {t("IssueInvoice.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((r, i) => (
              <tr
                key={r.no}
                className={`${i % 2 === 0 ? "bg-blue-50" : "bg-white"} border-b border-blue-200`}
              >
                <td className="px-4 py-3 whitespace-nowrap">{r.no}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatThaiDate(r.date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-blue-600 underline">
                  {r.po.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{r.customer}</td>
                <td className="px-4 py-3 whitespace-nowrap">{thb(r.total)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={statusBadge(r.status)}>{statusLabel(r.status)}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3 justify-start">
                    {r.status === "Add" ? (
                      <>
                        {/* Add */}
                        <button
                          onClick={() => navigate("/accounting/issue-invoice/add")}
                          title={t("IssueInvoice.action.add")}
                          className="flex items-center justify-center gap-2 px-3 py-1 rounded text-blue-700 hover:opacity-90"
                        >
                          <FiPlusCircle size={18} />
                        </button>

                        {/* View */}
                        <button
                          onClick={() => console.log("view", r.no)}
                          title={t("IssueInvoice.action.view")}
                          className="flex items-center justify-center h-9 w-9 rounded-full ring-2 ring-transparent hover:opacity-90"
                        >
                          <FiEye size={18} className="text-[#5A2D82]" />
                        </button>

                        {/* Doc */}
                        <button
                          onClick={() => console.log("doc", r.no)}
                          title={t("IssueInvoice.action.doc")}
                          className="flex items-center justify-center h-9 w-9 rounded-full ring-2 ring-transparent hover:opacity-90"
                        >
                          <FiFileText size={16} className="text-red-500" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* View */}
                        <button
                          onClick={() => console.log("view", r.no)}
                          title={t("IssueInvoice.action.view")}
                          className="flex items-center justify-center h-9 w-9 rounded-full ring-2 ring-transparent hover:opacity-90"
                        >
                          <FiEye size={18} className="text-[#5A2D82]" />
                        </button>

                        {/* Success => check icon */}
                        {r.status === "Success" && (
                          <button
                            onClick={() => console.log("checked", r.no)}
                            title={t("IssueInvoice.action.checked")}
                            className="flex items-center justify-center h-9 w-9 rounded-full ring-2 ring-transparent hover:opacity-90"
                          >
                            <FiCheckCircle size={18} className="text-green-600" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  {t("IssueInvoice.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-center gap-3 text-purple-800">
        <button
          onClick={() => goto(page - 1)}
          disabled={page === 1}
          className={`text-2xl ${page === 1 ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          «
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          return (
            <button
              key={p}
              onClick={() => goto(p)}
              className={`px-3 py-1 rounded border ${
                p === page ? "border-purple-800 bg-purple-800 text-white" : "border-purple-800"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => goto(page + 1)}
          disabled={page === totalPages}
          className={`text-2xl ${page === totalPages ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          »
        </button>
      </div>
    </div>
  );
}
