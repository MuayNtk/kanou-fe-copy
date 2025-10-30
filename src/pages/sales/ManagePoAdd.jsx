// src/pages/sales/ManagePoAdd.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiPlus, FiTrash2, FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const formatMoney = (n) =>
  (Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default function ManagePoAdd() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [header, setHeader] = useState({
    customerPoNo: "",
    poDate: "",
    deliveryDate: "",
    paymentDueDays: "",
    note: "",
  });

  // initial rows (2,5,10)
  const [items, setItems] = useState([
    { id: 1, description: "", qty: 2, unitPrice: 12500 },
    { id: 2, description: "", qty: 5, unitPrice: 2900 },
    { id: 3, description: "", qty: 10, unitPrice: 120 },
  ]);

  const setHeaderField = (k, v) => setHeader((h) => ({ ...h, [k]: v }));
  const setItemField = (i, k, v) =>
    setItems((rows) => {
      const next = [...rows];
      next[i] = { ...next[i], [k]: v };
      return next;
    });

  const addRow = () =>
    setItems((rows) => [
      ...rows,
      {
        id: rows.length ? rows[rows.length - 1].id + 1 : 1,
        description: "",
        qty: "",
        unitPrice: "",
      },
    ]);
  const removeRow = (i) => setItems((rows) => rows.filter((_, idx) => idx !== i));

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0),
        0
      ),
    [items]
  );
  const vat = subtotal * 0.07;
  const grand = subtotal + vat;

  const onCancel = () => navigate("/sales/manage-po");
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT", { header, items, subtotal, vat, grand });
    navigate("/sales/manage-po");
  };

  return (
    <div>
      <PageHeader title={t("ManagePoAdd.pageTitle")} />

      {/* top-right list button */}
      <div className="px-6 mt-3 flex justify-end">
        <Link
          to="/sales/manage-po"
          className="px-4 h-8 rounded-md bg-blue-100 text-blue-700 border border-blue-200 flex items-center"
        >
          {t("ManagePoAdd.list")}
        </Link>
      </div>

      <form onSubmit={onSubmit} className="px-6 pb-10 text-sm">
        {/* Order information + company block */}
        <div className="mt-2">
          <div className="flex items-end gap-3">
            <h2 className="text-[20px] font-semibold text-indigo-700">
              {t("ManagePoAdd.orderInfo")}
            </h2>
          </div>
          {/* company block (ข้อความตัวอย่าง ทิ้งไว้แบบเดิมได้) */}
          <div className="mt-2 text-gray-700 leading-relaxed">
            Japansystem Co., Ltd.<br />
            123 Sukhumvit Road, Klongtoey Subdistrict, Klongtoey District,<br />
            Bangkok 10110<br />
            {t("ManagePoAdd.taxId")}: 0123456789012
          </div>
          <div className="mt-3 border-t-2 border-slate-200" />
        </div>

        {/* Header fields row: 4 columns */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ManagePoAdd.customerPoNo")}
            </label>
            <input
              value={header.customerPoNo}
              onChange={(e) => setHeaderField("customerPoNo", e.target.value)}
              className="w-full h-9 rounded-md border px-3"
              placeholder={t("ManagePoAdd.customerPoNoPh")}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ManagePoAdd.poDate")}
            </label>
            <input
              type="date"
              value={header.poDate}
              onChange={(e) => setHeaderField("poDate", e.target.value)}
              className="w-full h-9 rounded-md border px-3"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ManagePoAdd.deliveryDate")}
            </label>
            <input
              type="date"
              value={header.deliveryDate}
              onChange={(e) => setHeaderField("deliveryDate", e.target.value)}
              className="w-full h-9 rounded-md border px-3"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("ManagePoAdd.paymentDueDays")}
            </label>
            <input
              value={header.paymentDueDays}
              onChange={(e) => setHeaderField("paymentDueDays", e.target.value)}
              className="w-full h-9 rounded-md border px-3"
              placeholder={t("ManagePoAdd.paymentDueDaysPh")}
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border text-left">{t("ManagePoAdd.th.desc")}</th>
                <th className="px-3 py-2 border text-center">{t("ManagePoAdd.th.qty")}</th>
                <th className="px-3 py-2 border text-right">{t("ManagePoAdd.th.unitPrice")}</th>
                <th className="px-3 py-2 border text-right">{t("ManagePoAdd.th.amount")}</th>
                <th className="px-3 py-2 border text-center">{t("ManagePoAdd.th.action")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const rowTotal = (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
                return (
                  <tr key={it.id} className={idx % 2 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-3 py-2 border text-center">{idx + 1}</td>
                    <td className="px-3 py-2 border">
                      <input
                        value={it.description}
                        onChange={(e) => setItemField(idx, "description", e.target.value)}
                        className="w-full h-8 border rounded px-2"
                        placeholder={t("ManagePoAdd.descPh")}
                      />
                    </td>
                    <td className="px-3 py-2 border text-center">
                      <input
                        value={it.qty}
                        onChange={(e) => setItemField(idx, "qty", e.target.value)}
                        className="w-full h-8 border rounded px-2 text-center"
                      />
                    </td>
                    <td className="px-3 py-2 border text-right">
                      <input
                        value={it.unitPrice}
                        onChange={(e) => setItemField(idx, "unitPrice", e.target.value)}
                        className="w-full h-8 border rounded px-2 text-right"
                      />
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {formatMoney(rowTotal)}
                    </td>
                    <td className="px-3 py-2 border text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="px-2 py-1 rounded text-red-600 hover:bg-red-50"
                        title={t("ManagePoAdd.removeRow")}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Summary rows inside table */}
              <tr className="bg-white">
                <td className="border px-3 py-2 text-right" colSpan={4}>
                  {t("ManagePoAdd.subtotal")}
                </td>
                <td className="border px-3 py-2 text-right">{formatMoney(subtotal)}</td>
                <td className="border px-3 py-2"></td>
              </tr>
              <tr className="bg-white">
                <td className="border px-3 py-2 text-right" colSpan={4}>
                  {t("ManagePoAdd.vat")} 7%
                </td>
                <td className="border px-3 py-2 text-right">{formatMoney(vat)} THB</td>
                <td className="border px-3 py-2"></td>
              </tr>
              <tr className="bg-white font-semibold">
                <td className="border px-3 py-2 text-right" colSpan={4}>
                  {t("ManagePoAdd.grand")}
                </td>
                <td className="border px-3 py-2 text-right">{formatMoney(grand)} THB</td>
                <td className="border px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add row */}
        <button
          type="button"
          onClick={addRow}
          className="mt-3 px-4 h-9 rounded-md bg-[#4b2e83] text-white flex items-center gap-2"
          title={t("ManagePoAdd.addRow")}
        >
          <FiPlus />
          {t("ManagePoAdd.addRow")}
        </button>

        {/* Note box */}
        <div className="mt-4">
          <textarea
            rows={3}
            value={header.note}
            onChange={(e) => setHeaderField("note", e.target.value)}
            placeholder={t("ManagePoAdd.notePh")}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Buttons bottom-right */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 h-10 rounded-md bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
          >
            {t("ManagePoAdd.cancel")}
          </button>
          <button
            type="submit"
            className="px-6 h-10 rounded-md bg-[#4b2e83] text-white"
          >
            {t("ManagePoAdd.submit")}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Export to PDF", { header, items });
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
