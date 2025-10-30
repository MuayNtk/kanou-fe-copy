// src/pages/inventory/InventoryCheckAdd.jsx
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

const badgeColor = (s) => {
  switch (s) {
    case "成功":
      return "bg-emerald-500 text-white";
    case "失敗":
      return "bg-red-500 text-white";
    case "保留":
      return "bg-amber-400 text-white";
    case "下書き":
      return "bg-sky-600 text-white";
    default:
      return "bg-slate-300 text-white";
  }
};

/* แปลตอน “แสดงผล” เท่านั้น — ค่าจริงของ status ยังเป็นภาษาญี่ปุ่นเหมือนเดิม */
const displayStatus = (s, t) => {
  switch (s) {
    case "成功":
      return t("InventoryInventoryCheckAdd.status.success");
    case "失敗":
      return t("InventoryInventoryCheckAdd.status.fail");
    case "保留":
      return t("InventoryInventoryCheckAdd.status.pending");
    case "下書き":
      return t("InventoryInventoryCheckAdd.status.draft");
    default:
      return s;
  }
};

const MOCK = [
  {
    invNo: "INVT-2505-001",
    checkDate: "2025-04-30",
    type: "サイクル",
    qty: 20,
    status: "成功",
  },
  {
    invNo: "INVT-2505-002",
    checkDate: "2025-04-30",
    type: "フル",
    qty: 30,
    status: "失敗",
  },
  {
    invNo: "INVT-2505-003",
    checkDate: "2025-04-30",
    type: "スポット",
    qty: 10,
    status: "保留",
  },
  {
    invNo: "INVT-2505-004",
    checkDate: "2025-04-30",
    type: "サイクル",
    qty: 25,
    status: "下書き",
  },
];

export default function InventoryCheckAdd() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* applied filters */
  const [qNo, setQNo] = useState("");
  const [qStatus, setQStatus] = useState("");
  const [qType, setQType] = useState("");
  const [qDate, setQDate] = useState("");

  /* form filters */
  const [fNo, setFNo] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fType, setFType] = useState("");
  const [fDate, setFDate] = useState("");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    let rows = [...MOCK];
    if (qNo.trim())
      rows = rows.filter((r) =>
        r.invNo.toLowerCase().includes(qNo.toLowerCase())
      );
    if (qStatus) rows = rows.filter((r) => r.status === qStatus);
    if (qType) rows = rows.filter((r) => r.type === qType);
    if (qDate) rows = rows.filter((r) => r.checkDate === qDate);
    return rows;
  }, [qNo, qStatus, qType, qDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSearch = () => {
    setQNo(fNo);
    setQStatus(fStatus);
    setQType(fType);
    setQDate(fDate);
    setPage(1);
  };

  const onClear = () => {
    setFNo("");
    setFStatus("");
    setFType("");
    setFDate("");
    setQNo("");
    setQStatus("");
    setQType("");
    setQDate("");
    setPage(1);
  };

  return (
    <div>
      <PageHeader title={t("InventoryInventoryCheckAdd.pageTitle")} />

      {/* 追加ボタン (คงเส้นทางเดิม) */}
      <div className="flex justify-end px-6 mt-5">
        <Link
          to="/sales/inventorycheck/add"
          className="h-9 px-4 rounded-md bg-[#4b2e83] text-white flex items-center gap-2 hover:opacity-95"
        >
          <FiPlus />
          {t("InventoryInventoryCheckAdd.add")}
        </Link>
      </div>

      {/* フィルター (番号, ステータス, 種類, 日付) */}
      <div className="px-6 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">
              {t("InventoryInventoryCheckAdd.number")}
            </label>
            <input
              value={fNo}
              onChange={(e) => setFNo(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
              placeholder={t("InventoryInventoryCheckAdd.numberPh")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("InventoryInventoryCheckAdd.statusLabel")}
            </label>
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            >
              <option value="">{t("InventoryInventoryCheckAdd.all")}</option>
              {/* value เป็นภาษาญี่ปุ่นเพื่อให้ฟิลเตอร์ทำงานตรงกับข้อมูลเดิม */}
              <option value="成功">
                {t("InventoryInventoryCheckAdd.status.success")}
              </option>
              <option value="失敗">
                {t("InventoryInventoryCheckAdd.status.fail")}
              </option>
              <option value="保留">
                {t("InventoryInventoryCheckAdd.status.pending")}
              </option>
              <option value="下書き">
                {t("InventoryInventoryCheckAdd.status.draft")}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("InventoryInventoryCheckAdd.type")}
            </label>
            <select
              value={fType}
              onChange={(e) => setFType(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            >
              <option value="">{t("InventoryInventoryCheckAdd.all")}</option>
              <option value="フル">
                {t("InventoryInventoryCheckAdd.typeFull")}
              </option>
              <option value="サイクル">
                {t("InventoryInventoryCheckAdd.typeCycle")}
              </option>
              <option value="スポット">
                {t("InventoryInventoryCheckAdd.typeSpot")}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("InventoryInventoryCheckAdd.date")}
            </label>
            <input
              type="date"
              value={fDate}
              onChange={(e) => setFDate(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3"
            />
          </div>

          <div className="flex gap-1">
            <button
              onClick={onSearch}
              className="h-8 px-2 rounded-md bg-[#7083c2] text-white flex items-center gap-1 text-sm hover:opacity-95"
            >
              <FiSearch className="text-[14px]" />
              {t("InventoryInventoryCheckAdd.search")}
            </button>
            <button
              onClick={onClear}
              className="h-8 px-2 rounded-md bg-amber-400 text-white flex items-center gap-1 text-sm hover:opacity-95"
            >
              <FiX className="text-[14px]" />
              {t("InventoryInventoryCheckAdd.clear")}
            </button>
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="px-6 mt-4">
        <div className="overflow-x-auto rounded-md border border-indigo-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 text-indigo-900">
                <th className="px-3 py-2 border-b text-start">
                  {t("InventoryInventoryCheckAdd.thInvNo")}
                </th>
                <th className="px-3 py-2 border-b text-start">
                  {t("InventoryInventoryCheckAdd.thCheckDate")}
                </th>
                <th className="px-3 py-2 border-b text-start">
                  {t("InventoryInventoryCheckAdd.thType")}
                </th>
                <th className="px-3 py-2 border-b text-start">
                  {t("InventoryInventoryCheckAdd.thQty")}
                </th>
                <th className="px-3 py-2 border-b text-center">
                  {t("InventoryInventoryCheckAdd.thStatus")}
                </th>
                <th className="px-3 py-2 border-b text-center">
                  {t("InventoryInventoryCheckAdd.thActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={r.invNo} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-3 py-3 border-t">{r.invNo}</td>
                  <td className="px-3 py-3 border-t">{toEnGB(r.checkDate)}</td>
                  <td className="px-3 py-3 border-t">{r.type}</td>
                  <td className="px-3 py-3 border-t">{r.qty}</td>
                  <td className="px-3 py-3 border-t text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                        r.status
                      )}`}
                    >
                      {displayStatus(r.status, t)}
                    </span>
                  </td>
                  <td className="px-3 py-3 border-t">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button
                        className="text-indigo-700"
                        title={t("InventoryInventoryCheckAdd.view")}
                        onClick={() =>
                          navigate("/inventory-check/view", {
                            state: { row: r },
                          })
                        }
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-amber-600"
                        title={t("InventoryInventoryCheckAdd.edit")}
                        onClick={() =>
                          navigate("/inventory-check/edit", {
                            state: { row: r },
                          })
                        }
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="text-red-600"
                        title={t("InventoryInventoryCheckAdd.delete")}
                        onClick={() => alert(`${t("InventoryInventoryCheckAdd.delete")} ${r.invNo}`)}
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
                    {t("InventoryInventoryCheckAdd.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
            title={t("InventoryInventoryCheckAdd.pgFirst")}
          >
            <FiChevronsLeft />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
            title={t("InventoryInventoryCheckAdd.pgPrev")}
          >
            <FiChevronLeft />
          </button>
          <span className="px-3 py-1 border rounded bg-white">{page}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("InventoryInventoryCheckAdd.pgNext")}
          >
            <FiChevronRight />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
            title={t("InventoryInventoryCheckAdd.pgLast")}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
