// src/pages/service/ServiceCenter.jsx
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

const badgeStyle = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-500 text-white";
    case "Pending":
      return "bg-amber-400 text-white";
    case "In Progress":
      return "bg-sky-600 text-white";
    default:
      return "bg-slate-300 text-white";
  }
};

/* mock data */
const MOCK = [
  {
    serviceNo: "SR-2025-0582",
    date: "2025-04-30",
    customer: "Somchai",
    productId: "PRD-1001",
    type: "Repair",
    status: "Completed",
  },
  {
    serviceNo: "SR-2025-0581",
    date: "2025-04-30",
    customer: "Anong",
    productId: "PRD-2002",
    type: "Maintenance",
    status: "Pending",
  },
  {
    serviceNo: "SR-2025-0580",
    date: "2025-04-30",
    customer: "Peter",
    productId: "PRD-1100",
    type: "Repair",
    status: "Pending",
  },
  {
    serviceNo: "SR-2025-0579",
    date: "2025-04-30",
    customer: "John",
    productId: "PRD-3050",
    type: "Inspection",
    status: "In Progress",
  },
];

export default function ServiceCenter() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // form search and applied search
  const [fText, setFText] = useState("");
  const [qText, setQText] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    const key = qText.trim().toLowerCase();
    if (!key) return [...MOCK];
    return MOCK.filter((r) =>
      [
        r.serviceNo,
        r.customer,
        r.productId,
        r.type,
        r.status,
        toEnGB(r.date),
      ]
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
      <PageHeader title={t("ServiceServiceCenter.pageTitle")} />

      {/* Add button */}
      <div className="flex justify-end px-6 mt-5">
        <Link
          to="/service/servicecenter/add"
          className="h-9 px-4 rounded-md bg-[#4b2e83] text-white flex items-center gap-2 hover:opacity-95"
        >
          <FiPlus />
          {t("ServiceServiceCenter.add")}
        </Link>
      </div>

      {/* Search bar (press button to search) */}
      <div className="px-6 mt-3">
        <div className="flex gap-2">
          <input
            value={fText}
            onChange={(e) => setFText(e.target.value)}
            className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3"
            placeholder={t("ServiceServiceCenter.searchPlaceholder")}
          />
          <button
            onClick={onSearch}
            className="h-10 w-10 rounded-md bg-[#7083c2] text-white grid place-items-center hover:opacity-95"
            title={t("ServiceServiceCenter.search")}
          >
            <FiSearch />
          </button>
          <button
            onClick={onClear}
            className="h-10 w-10 rounded-md bg-amber-400 text-white grid place-items-center hover:opacity-95"
            title={t("ServiceServiceCenter.clear")}
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
                <th className="px-3 py-2 border-b">{t("ServiceServiceCenter.table.serviceNo")}</th>
                <th className="px-3 py-2 border-b">{t("ServiceServiceCenter.table.date")}</th>
                <th className="px-3 py-2 border-b">{t("ServiceServiceCenter.table.customer")}</th>
                <th className="px-3 py-2 border-b">{t("ServiceServiceCenter.table.productId")}</th>
                <th className="px-3 py-2 border-b">{t("ServiceServiceCenter.table.type")}</th>
                <th className="px-3 py-2 border-b text-center">{t("ServiceServiceCenter.table.status")}</th>
                <th className="px-3 py-2 border-b text-center">{t("ServiceServiceCenter.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={r.serviceNo} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-3 py-3 border-t">{r.serviceNo}</td>
                  <td className="px-3 py-3 border-t">{toEnGB(r.date)}</td>
                  <td className="px-3 py-3 border-t">{r.customer}</td>
                  <td className="px-3 py-3 border-t">{r.productId}</td>
                  <td className="px-3 py-3 border-t">{r.type}</td>
                  <td className="px-3 py-3 border-t text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle(r.status)}`}>
                      {t(`ServiceServiceCenter.status.${r.status}`)}
                    </span>
                  </td>
                  <td className="px-3 py-3 border-t">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button
                        className="text-indigo-700"
                        title={t("ServiceServiceCenter.actions.view")}
                        onClick={() => navigate("/service/view", { state: { row: r } })}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-amber-600"
                        title={t("ServiceServiceCenter.actions.edit")}
                        onClick={() => navigate("/service/edit", { state: { row: r } })}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="text-red-600"
                        title={t("ServiceServiceCenter.actions.delete")}
                        onClick={() => alert(`Delete ${r.serviceNo}`)}
                      >
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                    {t("ServiceServiceCenter.empty")}
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
            title={t("ServiceServiceCenter.paging.first")}
          >
            <FiChevronsLeft />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ServiceServiceCenter.paging.prev")}
          >
            <FiChevronLeft />
          </button>
          <span className="px-3 py-1 border rounded bg-white">{page}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ServiceServiceCenter.paging.next")}
          >
            <FiChevronRight />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("ServiceServiceCenter.paging.last")}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
