// src/pages/service/Repair.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  FiSearch,
  FiX,
  FiEye,
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

/* mock data (ตามภาพ) */
const MOCK = [
  {
    repairNo: "SR-2025-0582",
    date: "2025-04-30",
    customer: "Somchai Meesuk",
    productId: "001",
    technicianName: "Thanakorn Srisuk",
  },
  {
    repairNo: "SR-2025-0581",
    date: "2025-04-30",
    customer: "Anong Rakdee",
    productId: "002",
    technicianName: "Paweena Chandee",
  },
  {
    repairNo: "SR-2025-0580",
    date: "2025-04-30",
    customer: "Peter Johnson",
    productId: "003",
    technicianName: "Kittiphong Saelee",
  },
  {
    repairNo: "SR-2025-0579",
    date: "2025-04-30",
    customer: "Somchai Meesuk",
    productId: "004",
    technicianName: "Nattida Wilailporn",
  },
];

export default function Repair() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ค้นหา (ต้องกดปุ่มถึงจะค้น)
  const [fText, setFText] = useState("");
  const [qText, setQText] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    const key = qText.trim().toLowerCase();
    if (!key) return [...MOCK];
    return MOCK.filter((r) =>
      [r.repairNo, toEnGB(r.date), r.customer, r.productId, r.technicianName]
        .join(" ")
        .toLowerCase()
        .includes(key)
    );
  }, [qText]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSearch = () => {
    setQText(fText);
    setPage(1);
  };
  const onClear = () => {
    setFText("");
    setQText("");
    setPage(1);
  };

  return (
    <div>
      <PageHeader title={t("ServiceRepair.pageTitle")} />

      {/* Search bar (press button to search) */}
      <div className="px-6 mt-5">
        <div className="flex gap-2">
          <input
            value={fText}
            onChange={(e) => setFText(e.target.value)}
            className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3"
            placeholder={t("ServiceRepair.placeholder")}
          />
          <button
            onClick={onSearch}
            className="h-10 w-10 rounded-md bg-[#7083c2] text-white grid place-items-center hover:opacity-95"
            title={t("ServiceRepair.search")}
          >
            <FiSearch />
          </button>
          <button
            onClick={onClear}
            className="h-10 w-10 rounded-md bg-amber-400 text-white grid place-items-center hover:opacity-95"
            title={t("ServiceRepair.clear")}
          >
            <FiX />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 mt-4">
        <div className="overflow-x-auto rounded-md border border-indigo-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 text-indigo-900 text-left">
                <th className="px-3 py-2 border-b">{t("ServiceRepair.th.repairNo")}</th>
                <th className="px-3 py-2 border-b">{t("ServiceRepair.th.date")}</th>
                <th className="px-3 py-2 border-b">{t("ServiceRepair.th.customer")}</th>
                <th className="px-3 py-2 border-b">{t("ServiceRepair.th.productId")}</th>
                <th className="px-3 py-2 border-b">{t("ServiceRepair.th.technician")}</th>
                <th className="px-3 py-2 border-b text-center">{t("ServiceRepair.th.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={r.repairNo} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-3 py-3 border-t">{r.repairNo}</td>
                  <td className="px-3 py-3 border-t">{toEnGB(r.date)}</td>
                  <td className="px-3 py-3 border-t">{r.customer}</td>
                  <td className="px-3 py-3 border-t">{r.productId}</td>
                  <td className="px-3 py-3 border-t">{r.technicianName}</td>
                  <td className="px-3 py-3 border-t">
                    <div className="flex items-center justify-center text-[18px]">
                      <button
                        className="text-indigo-700"
                        title={t("ServiceRepair.actions.view")}
                        onClick={() =>
                          navigate("/service/repair/view", { state: { row: r } })
                        }
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    {t("ServiceRepair.empty")}
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
            title={t("ServiceRepair.pager.first")}
          >
            <FiChevronsLeft />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ServiceRepair.pager.prev")}
          >
            <FiChevronLeft />
          </button>
          <span className="px-3 py-1 border rounded bg-white">{page}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ServiceRepair.pager.next")}
          >
            <FiChevronRight />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ServiceRepair.pager.last")}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
