// src/pages/factory/SerialNumber.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiEye, FiEdit2, FiXCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ROWS = [
  { serial: "CH-2505-001", productId: "001", productName: "Product A", lot: "L-001", date: "2025-04-30", status: "Available" },
  { serial: "DM-2505-001", productId: "002", productName: "Product B", lot: "L-002", date: "2025-04-30", status: "Problem" },
  { serial: "DM-2505-002", productId: "003", productName: "Product C", lot: "L-003", date: "2025-04-30", status: "Waiting" },
  { serial: "CH-2505-002", productId: "004", productName: "Product D", lot: "L-004", date: "2025-04-30", status: "Verified" },
  { serial: "CH-2505-003", productId: "005", productName: "Product E", lot: "L-005", date: "2025-05-01", status: "Available" },
  { serial: "DM-2505-003", productId: "006", productName: "Product F", lot: "L-006", date: "2025-05-01", status: "Problem" },
  { serial: "DM-2505-004", productId: "007", productName: "Product G", lot: "L-007", date: "2025-05-01", status: "Waiting" },
  { serial: "CH-2505-004", productId: "008", productName: "Product H", lot: "L-008", date: "2025-05-01", status: "Verified" }
];

const badgeClass = (status) => {
  const base = "px-2 py-1 rounded text-white text-sm font-semibold";
  switch (status) {
    case "Available": return `${base} bg-green-500`;
    case "Problem": return `${base} bg-red-600`;
    case "Waiting": return `${base} bg-yellow-500`;
    case "Verified": return `${base} bg-blue-600`;
    default: return `${base} bg-gray-400`;
  }
};

function SerialNumber() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState(ROWS);

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
    const q = input.trim().toLowerCase();
    if (!q) {
      setFiltered(ROWS);
    } else {
      const res = ROWS.filter(
        (r) =>
          r.serial.toLowerCase().includes(q) ||
          r.productId.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.lot.toLowerCase().includes(q) ||
          r.date.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
      setFiltered(res);
    }
    setPage(1);
  };

  const handleClear = () => {
    setInput("");
    setFiltered(ROWS);
    setPage(1);
  };

  const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div>
      <PageHeader title={t("SerialNumber.title")} />

      {/* Search + Add */}
      <div className="flex items-center justify-between mt-5 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("SerialNumber.searchPlaceholder")}
            className="w-[600px] max-w-[80vw] rounded-md border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSearch}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-blue-500 text-white"
            title={t("SerialNumber.search")}
          >
            🔍
          </button>
          <button
            onClick={handleClear}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-yellow-400 text-white"
            title={t("SerialNumber.clear")}
          >
            ✖
          </button>
        </div>

        <Link to="/factory/order/add">
          <button className="bg-purple-700 text-white px-4 py-2 rounded">
            + {t("SerialNumber.add")}
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="border-t-2 border-blue-200" />
      <div className="mt-3 overflow-x-auto rounded-lg">
        <table className="min-w-[900px] sm:min-w-full w-full border-collapse">
          <thead>
            <tr className="text-left text-blue-900">
              <th className="p-2 border-b-2 border-blue-200">{t("SerialNumber.serial")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("SerialNumber.productId")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("SerialNumber.productName")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("SerialNumber.lot")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("SerialNumber.date")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("SerialNumber.status")}</th>
              <th className="p-2 border-b-2 border-blue-200 flex justify-center">{t("SerialNumber.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length ? (
              pageItems.map((row, i) => (
                <tr key={row.serial + i} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="p-2 border-b border-blue-200">{row.serial}</td>
                  <td className="p-2 border-b border-blue-200 text-blue-600">{row.productId}</td>
                  <td className="p-2 border-b border-blue-200 text-blue-600">{row.productName}</td>
                  <td className="p-2 border-b border-blue-200">{row.lot}</td>
                  <td className="p-2 border-b border-blue-200">{row.date}</td>
                  <td className="p-2 border-b border-blue-200">
                    <span className={badgeClass(row.status)}>{t(`SerialNumber.status_${row.status}`)}</span>
                  </td>
                  <td className="p-2 border-b border-blue-200 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button className="text-indigo-700" title={t("SerialNumber.view")}><FiEye /></button>
                      <button className="text-amber-600" title={t("SerialNumber.edit")}><FiEdit2 /></button>
                      <button className="text-red-600" title={t("SerialNumber.delete")}><FiXCircle /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  {t("SerialNumber.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-3 text-purple-700">
        <button onClick={() => goto(page - 1)} disabled={page === 1} className={`text-2xl ${page === 1 ? "opacity-30 cursor-not-allowed" : ""}`}>
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
        <button onClick={() => goto(page + 1)} disabled={page === totalPages} className={`text-2xl ${page === totalPages ? "opacity-30 cursor-not-allowed" : ""}`}>
          »
        </button>
      </div>
    </div>
  );
}

export default SerialNumber;
