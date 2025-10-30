// src/pages/sales/ShippingInstructionAdd.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiPlus, FiTrash2, FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// สีของสถานะ (ค่า value เป็น JP เหมือนเดิม)
const statusClass = (s) => {
  switch (s) {
    case "在庫あり":
      return "bg-emerald-500 text-white";
    case "在庫少なめ":
      return "bg-amber-400 text-white";
    case "在庫切れ":
      return "bg-red-600 text-white";
    default:
      return "bg-slate-300 text-white";
  }
};

const STATUS_OPTIONS = ["在庫あり", "在庫少なめ", "在庫切れ"];

/* แปลข้อความสถานะตอนแสดงผลเท่านั้น */
const displayStatus = (s, t) => {
  switch (s) {
    case "在庫あり":
      return t("ShippingShippingInstructionAdd.status.inStock");
    case "在庫少なめ":
      return t("ShippingShippingInstructionAdd.status.lowStock");
    case "在庫切れ":
      return t("ShippingShippingInstructionAdd.status.outOfStock");
    default:
      return s;
  }
};

export default function InventoryCheckAdd() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* Header form */
  const [header, setHeader] = useState({
    checkDate: "",
    checkTime: "",
    checkedBy: "",
    department: "",
    checkType: "",
  });
  const setHeaderField = (k, v) => setHeader((h) => ({ ...h, [k]: v }));

  /* Rows (Status = dropdown) */
  const [rows, setRows] = useState([
    { id: 1, name: "", category: "", expected: 10, actual: 10, unit: "個", status: "在庫あり" },
    { id: 2, name: "", category: "", expected: 10, actual: 3, unit: "個", status: "在庫少なめ" },
    { id: 3, name: "", category: "", expected: 10, actual: 0, unit: "個", status: "在庫切れ" },
  ]);
  const setRowField = (i, k, v) =>
    setRows((rs) => {
      const next = [...rs];
      next[i] = { ...next[i], [k]: v };
      return next;
    });
  const addRow = () =>
    setRows((rs) => [
      ...rs,
      {
        id: rs.length ? rs[rs.length - 1].id + 1 : 1,
        name: "",
        category: "",
        expected: "",
        actual: "",
        unit: "個",
        status: "在庫あり",
      },
    ]);
  const removeRow = (i) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  /* Summary & Notes */
  const [summary, setSummary] = useState({
    totalSemiChecked: "",
    totalFinishedChecked: "",
    discrepancyItems: "",
    remark: "",
  });
  const setSummaryField = (k, v) =>
    setSummary((s) => ({
      ...s,
      [k]: v,
    }));

  // สร้างแถวตาราง
  const tableBody = useMemo(
    () =>
      rows.map((r, idx) => (
        <tr key={r.id} className={idx % 2 ? "bg-white" : "bg-slate-50"}>
          <td className="border px-3 py-2 text-center">{idx + 1}</td>

          <td className="border px-3 py-2">
            <input
              value={r.name}
              onChange={(e) => setRowField(idx, "name", e.target.value)}
              className="w-full h-8 rounded border px-2"
            />
          </td>

          <td className="border px-3 py-2">
            <input
              value={r.category}
              onChange={(e) => setRowField(idx, "category", e.target.value)}
              className="w-full h-8 rounded border px-2"
            />
          </td>

          <td className="border px-3 py-2 text-right">
            <input
              value={r.expected}
              onChange={(e) => setRowField(idx, "expected", e.target.value)}
              className="w-full h-8 rounded border px-2 text-right"
            />
          </td>

          <td className="border px-3 py-2 text-right">
            <input
              value={r.actual}
              onChange={(e) => setRowField(idx, "actual", e.target.value)}
              className="w-full h-8 rounded border px-2 text-right"
            />
          </td>

          <td className="border px-3 py-2">
            <select
              value={r.unit}
              onChange={(e) => setRowField(idx, "unit", e.target.value)}
              className="w-full h-8 rounded border px-2 bg-white"
            >
              <option>個</option>
              <option>kg</option>
              <option>箱</option>
              <option>セット</option>
            </select>
          </td>

          {/* Status dropdown (พื้นมีสีตามสถานะ; value JP เดิม) */}
          <td className="border px-3 py-2">
            <div className={`rounded px-2 py-1 text-xs text-center ${statusClass(r.status)}`}>
              <select
                value={r.status}
                onChange={(e) => setRowField(idx, "status", e.target.value)}
                className="w-full bg-transparent text-white font-medium focus:outline-none"
                title={displayStatus(r.status, t)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-black bg-white">
                    {displayStatus(opt, t)}
                  </option>
                ))}
              </select>
            </div>
          </td>

          <td className="border px-3 py-2 text-center">
            <button
              type="button"
              className="text-red-600"
              title={t("ShippingShippingInstructionAdd.deleteRow")}
              onClick={() => removeRow(idx)}
            >
              <FiTrash2 />
            </button>
          </td>
        </tr>
      )),
    [rows, t]
  );

  const onCancel = () => navigate("/sales/inventorycheck");
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT", { header, rows, summary });
    navigate("/sales/inventorycheck");
  };

  return (
    <div>
      <PageHeader title={t("ShippingShippingInstructionAdd.pageTitle")} />

      {/* top-right List button */}
      <div className="px-6 mt-3 flex justify-end">
        <Link
          to="/sales/shipping-instruction"
          className="px-4 h-8 rounded-md bg-blue-100 text-blue-700 border border-blue-200 flex items-center"
        >
          {t("ShippingShippingInstructionAdd.list")}
        </Link>
      </div>

      <form onSubmit={onSubmit} className="px-6 pb-10 text-sm">
        {/* Header form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingShippingInstructionAdd.checkDate")}
            </label>
            <input
              type="date"
              value={header.checkDate}
              onChange={(e) => setHeaderField("checkDate", e.target.value)}
              className="w-full h-9 rounded border px-3"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingShippingInstructionAdd.checkTime")}
            </label>
            <input
              type="time"
              value={header.checkTime}
              onChange={(e) => setHeaderField("checkTime", e.target.value)}
              className="w-full h-9 rounded border px-3"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingShippingInstructionAdd.checkedBy")}
            </label>
            <input
              value={header.checkedBy}
              onChange={(e) => setHeaderField("checkedBy", e.target.value)}
              className="w-full h-9 rounded border px-3"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingShippingInstructionAdd.department")}
            </label>
            <select
              value={header.department}
              onChange={(e) => setHeaderField("department", e.target.value)}
              className="w-full h-9 rounded border px-3 bg-white"
            >
              <option value="">{t("ShippingShippingInstructionAdd.select")}</option>
              <option>{t("ShippingShippingInstructionAdd.deptProduction")}</option>
              <option>{t("ShippingShippingInstructionAdd.deptWarehouse")}</option>
              <option>{t("ShippingShippingInstructionAdd.deptQuality")}</option>
              <option>{t("ShippingShippingInstructionAdd.deptSales")}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingShippingInstructionAdd.checkType")}
            </label>
            <select
              value={header.checkType}
              onChange={(e) => setHeaderField("checkType", e.target.value)}
              className="w-full h-9 rounded border px-3 bg-white"
            >
              <option value="">{t("ShippingShippingInstructionAdd.select")}</option>
              <option>{t("ShippingShippingInstructionAdd.typeCycleCount")}</option>
              <option>{t("ShippingShippingInstructionAdd.typeSpotCheck")}</option>
              <option>{t("ShippingShippingInstructionAdd.typeFullCount")}</option>
            </select>
          </div>
        </div>

        {/* Section header */}
        <div className="mt-8">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-indigo-700 pr-3 bg-white">
              {t("ShippingShippingInstructionAdd.semiFinished")}
            </h3>
            <div className="flex-1 border-b-4 border-indigo-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border px-3 py-2 text-left">ID</th>
                <th className="border px-3 py-2 text-left">
                  {t("ShippingShippingInstructionAdd.itemName")}
                </th>
                <th className="border px-3 py-2 text-left">
                  {t("ShippingShippingInstructionAdd.category")}
                </th>
                <th className="border px-3 py-2 text-right">
                  {t("ShippingShippingInstructionAdd.expectedQty")}
                </th>
                <th className="border px-3 py-2 text-right">
                  {t("ShippingShippingInstructionAdd.actualQty")}
                </th>
                <th className="border px-3 py-2 text-left">
                  {t("ShippingShippingInstructionAdd.unit")}
                </th>
                <th className="border px-3 py-2 text-center">
                  {t("ShippingShippingInstructionAdd.status")}
                </th>
                <th className="border px-3 py-2 text-center"> </th>
              </tr>
            </thead>
            <tbody>{tableBody}</tbody>
          </table>
        </div>

        {/* Add row button */}
        <button
          type="button"
          onClick={addRow}
          className="mt-3 px-4 h-9 rounded-md bg-[#4b2e83] text-white flex items-center gap-2"
        >
          <FiPlus />
          {t("ShippingShippingInstructionAdd.addRow")}
        </button>

        {/* Summary & Notes */}
        <div className="mt-10">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-indigo-700 pr-3 bg-white">
              {t("ShippingShippingInstructionAdd.summaryAndNotes")}
            </h3>
            <div className="flex-1 border-b-4 border-indigo-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {t("ShippingShippingInstructionAdd.totalSemiChecked")}
              </label>
              <input
                value={summary.totalSemiChecked}
                onChange={(e) => setSummaryField("totalSemiChecked", e.target.value)}
                className="w-full h-9 rounded border px-3"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {t("ShippingShippingInstructionAdd.totalFinishedChecked")}
              </label>
              <input
                value={summary.totalFinishedChecked}
                onChange={(e) => setSummaryField("totalFinishedChecked", e.target.value)}
                className="w-full h-9 rounded border px-3"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {t("ShippingShippingInstructionAdd.discrepancyItems")}
              </label>
              <input
                value={summary.discrepancyItems}
                onChange={(e) => setSummaryField("discrepancyItems", e.target.value)}
                className="w-full h-9 rounded border px-3"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs text-gray-600 mb-1">
              {t("ShippingShippingInstructionAdd.remark")}
            </label>
            <textarea
              rows={4}
              value={summary.remark}
              onChange={(e) => setSummaryField("remark", e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 h-10 rounded-md bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
          >
            {t("ShippingShippingInstructionAdd.cancel")}
          </button>
          <button
            type="submit"
            className="px-6 h-10 rounded-md bg-[#4b2e83] text-white"
          >
            {t("ShippingShippingInstructionAdd.submit")}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Export to PDF", { header, rows, summary });
              // TODO: export PDF logic
            }}
            className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
          >
            <FiFileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </form>
    </div>
  );
}
