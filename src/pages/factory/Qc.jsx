// src/pages/factory/Qc.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiEye, FiEdit2, FiXCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const rows = [
  { qcNo: "QC-23050348", date: "2025-04-30", productNo: "001", productName: "Product A", inspector: "—", status: "Pass", severity: "Medium" },
  { qcNo: "QC-23050347", date: "2025-04-30", productNo: "002", productName: "Product B", inspector: "—", status: "Conditional Pass", severity: "Medium" },
  { qcNo: "QC-23050345", date: "2025-04-30", productNo: "003", productName: "Product C", inspector: "—", status: "Fail", severity: "High" },
  { qcNo: "QC-23050342", date: "2025-04-30", productNo: "004", productName: "Product D", inspector: "—", status: "Fail", severity: "Low" },
  { qcNo: "QC-23050341", date: "2025-05-01", productNo: "005", productName: "Product E", inspector: "—", status: "Pass", severity: "Low" },
  { qcNo: "QC-23050340", date: "2025-05-01", productNo: "006", productName: "Product F", inspector: "—", status: "Pass", severity: "Medium" },
  { qcNo: "QC-23050339", date: "2025-05-01", productNo: "007", productName: "Product G", inspector: "—", status: "Fail", severity: "High" },
  { qcNo: "QC-23050338", date: "2025-05-02", productNo: "008", productName: "Product H", inspector: "—", status: "Conditional Pass", severity: "Medium" },
];

function Qc() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(rows);

  // Pagination
  const PAGE_SIZE = 7;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filtered.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filtered, page]);

  // Search
  const handleSearch = () => {
    const q = search.trim().toLowerCase();
    const result = rows.filter(
      (r) =>
        r.qcNo.toLowerCase().includes(q) ||
        r.productNo.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q)
    );
    setFiltered(result);
    setPage(1);
  };

  // Clear search
  const handleClear = () => {
    setSearch("");
    setFiltered(rows);
    setPage(1);
  };

  const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div>
      <PageHeader title={t("Qc.title")} />

      {/* Search + Actions */}
      <div className="flex items-center justify-between mb-4 mt-5">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-[600px] max-w-[80vw] rounded-md border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            placeholder={t("Qc.searchPlaceholder")}
          />
          <button
            title={t("Qc.search")}
            onClick={handleSearch}
            className="h-9 w-9 rounded-md bg-blue-500 text-white text-lg flex items-center justify-center"
          >
            🔍
          </button>
          <button
            title={t("Qc.clear")}
            onClick={handleClear}
            className="h-9 w-9 rounded-md bg-yellow-400 text-white text-lg flex items-center justify-center"
          >
            ✖
          </button>
        </div>

        <Link to="/factory/qc/add" className="block">
          <button className="bg-purple-700 text-white px-4 py-2 rounded">
            + {t("Qc.add")}
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="border-t-2 border-blue-200" />
      <div className="mt-3 overflow-x-auto rounded-lg">
        <table className="min-w-[950px] sm:min-w-full w-full border-collapse">
          <thead>
            <tr className="text-left text-blue-900">
              <th className="py-3 px-3 border-b-2 border-blue-200">{t("Qc.qcNo")}</th>
              <th className="py-3 px-3 border-b-2 border-blue-200">{t("Qc.date")}</th>
              <th className="py-3 px-3 border-b-2 border-blue-200">{t("Qc.productNo")}</th>
              <th className="py-3 px-3 border-b-2 border-blue-200">{t("Qc.productName")}</th>
              <th className="py-3 px-3 border-b-2 border-blue-200">{t("Qc.inspector")}</th>
              <th className="py-3 px-3 border-b-2 border-blue-200">{t("Qc.status")}</th>
              <th className="py-3 px-3 border-b-2 border-blue-200">{t("Qc.severity")}</th>
              <th className="py-3 px-3 border-b-2 border-blue-200 flex justify-center">{t("Qc.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length > 0 ? (
              pageItems.map((r, i) => (
                <tr
                  key={r.qcNo}
                  className={`border-b border-blue-200 ${
                    i % 2 === 0 ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <td className="px-3 py-3">{r.qcNo}</td>
                  <td className="px-3 py-3">{r.date}</td>
                  <td className="px-3 py-3 text-blue-600">{r.productNo}</td>
                  <td className="px-3 py-3 text-blue-600">{r.productName}</td>
                  <td className="px-3 py-3">{r.inspector}</td>
                  <td className="px-3 py-3">
                    {r.status === "Pass" && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white">
                        {t("Qc.statusPass")}
                      </span>
                    )}
                    {r.status === "Conditional Pass" && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-white">
                        {t("Qc.statusConditional")}
                      </span>
                    )}
                    {r.status === "Fail" && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white">
                        {t("Qc.statusFail")}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {r.severity === "High" && (
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-red-600 inline-block" />
                        {t("Qc.severityHigh")}
                      </span>
                    )}
                    {r.severity === "Medium" && (
                      <span className="text-yellow-600 font-semibold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
                        {t("Qc.severityMedium")}
                      </span>
                    )}
                    {r.severity === "Low" && (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                        {t("Qc.severityLow")}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button className="text-indigo-700" title={t("Qc.view")}>
                        <FiEye />
                      </button>
                      <button className="text-amber-600" title={t("Qc.edit")}>
                        <FiEdit2 />
                      </button>
                      <button className="text-red-600" title={t("Qc.delete")}>
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  {t("Qc.noData")}
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
                p === page
                  ? "border-purple-800 bg-purple-800 text-white"
                  : "border-purple-800"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => goto(page + 1)}
          disabled={page === totalPages}
          className={`text-2xl ${
            page === totalPages ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          »
        </button>
      </div>
    </div>
  );
}

export default Qc;
