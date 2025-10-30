// src/pages/purchasing/ProcurementAdd.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiPlus, FiX, FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

/* helpers */
const today = () => new Date().toISOString().slice(0, 10);
const money = (n) =>
  (Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default function ProcurementAdd() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* header form */
  const [header, setHeader] = useState({
    purchaseNo: "PO-20250501-907",
    date: today(),
    supplier: "",
    refNo: "",
    deliveryDate: "",
    paymentTerms: "",
    remark: "",
    status: "", // pending | pendingApproval | approved | pendingDelivery
  });
  const setHeaderField = (k, v) => setHeader((s) => ({ ...s, [k]: v }));

  /* item rows */
  const [items, setItems] = useState([
    { id: 1, productId: "", productName: "", qty: "", unitPrice: "" },
    { id: 2, productId: "", productName: "", qty: "", unitPrice: "" },
  ]);
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
        productId: "",
        productName: "",
        qty: "",
        unitPrice: "",
      },
    ]);
  const removeRow = (i) =>
    setItems((rows) => rows.filter((_, idx) => idx !== i));

  /* summary */
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) =>
          sum + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0),
        0
      ),
    [items]
  );
  const vat = Math.round(subtotal * 0.07);
  const total = subtotal + vat;

  const onCancel = () => navigate("/purchasing/procurement");
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT", { header, items, subtotal, vat, total });
    navigate("/purchasing/procurement");
  };

  const label = "block text-[13px] text-slate-800 mb-1";
  const input = "w-full h-9 border rounded-md border-slate-300 px-3 bg-white";
  const area =
    "w-full border rounded-md border-slate-300 px-3 py-2 bg-white resize-none";

  return (
    <div>
      <PageHeader title={t("ProcurementAdd.pageTitle")} />

      {/* top-right: List */}
      <div className="px-6 mt-2 flex justify-end">
        <Link
          to="/purchasing/procurement"
          className="px-4 h-8 rounded-md bg-blue-100 text-blue-700 border border-blue-200 flex items-center text-[14px]"
        >
          {t("ProcurementAdd.list")}
        </Link>
      </div>

      <form onSubmit={onSubmit} className="px-6 pb-12">
        {/* header grid */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          <div>
            <label className={label}>{t("ProcurementAdd.fields.purchaseNo")}</label>
            <input
              className={input}
              value={header.purchaseNo}
              onChange={(e) => setHeaderField("purchaseNo", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>{t("ProcurementAdd.fields.supplier")}</label>
            <select
              className={input}
              value={header.supplier}
              onChange={(e) => setHeaderField("supplier", e.target.value)}
            >
              <option value="">{t("ProcurementAdd.fields.supplierPlaceholder")}</option>
              {/* ค่า option คงเป็นข้อความเดิมเพื่อไม่กระทบการใช้งานต่อ */}
              <option>Tech Supply Co.</option>
              <option>Office Deco Corp.</option>
              <option>Global Bags Ltd.</option>
            </select>
          </div>
          <div>
            <label className={label}>{t("ProcurementAdd.fields.refNo")}</label>
            <input
              className={input}
              value={header.refNo}
              onChange={(e) => setHeaderField("refNo", e.target.value)}
            />
          </div>

          {/* row 2 */}
          <div>
            <label className={label}>{t("ProcurementAdd.fields.date")}</label>
            <input
              type="date"
              className={input}
              value={header.date}
              onChange={(e) => setHeaderField("date", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>{t("ProcurementAdd.fields.deliveryDate")}</label>
            <input
              type="date"
              className={input}
              value={header.deliveryDate}
              onChange={(e) => setHeaderField("deliveryDate", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>{t("ProcurementAdd.fields.paymentTerms")}</label>
            <select
              className={input}
              value={header.paymentTerms}
              onChange={(e) => setHeaderField("paymentTerms", e.target.value)}
            >
              <option value="">{t("ProcurementAdd.fields.paymentTermsPlaceholder")}</option>
              {/* แสดงผลอังกฤษไว้เดิม */}
              <option>Cash</option>
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 45</option>
            </select>
          </div>
        </div>

        {/* section title line */}
        <div className="mt-6">
          <div className="flex items-center">
            <span className="text-[16px] font-semibold text-indigo-700 pr-3 bg-white">
              {t("ProcurementAdd.items.section")}
            </span>
            <div className="flex-1 border-b-[3px] border-indigo-400" />
          </div>
        </div>

        {/* table */}
        <div className="mt-2 overflow-x-auto border rounded">
          <table className="min-w-full text-[14px]">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border px-3 py-2 w-16 text-left">{t("ProcurementAdd.items.no")}</th>
                <th className="border px-3 py-2 w-40 text-left">{t("ProcurementAdd.items.productId")}</th>
                <th className="border px-3 py-2 text-left">{t("ProcurementAdd.items.productName")}</th>
                <th className="border px-3 py-2 w-36 text-center">{t("ProcurementAdd.items.qty")}</th>
                <th className="border px-3 py-2 w-36 text-right">{t("ProcurementAdd.items.unitPrice")}</th>
                <th className="border px-3 py-2 w-40 text-right">{t("ProcurementAdd.items.amount")}</th>
                <th className="border px-3 py-2 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const amount =
                  (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
                return (
                  <tr key={it.id} className={idx % 2 ? "bg-white" : "bg-slate-50"}>
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">
                      <input
                        value={it.productId}
                        onChange={(e) =>
                          setItemField(idx, "productId", e.target.value)
                        }
                        className="w-full h-9 border rounded px-2 border-slate-300 bg-white"
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        value={it.productName}
                        onChange={(e) =>
                          setItemField(idx, "productName", e.target.value)
                        }
                        className="w-full h-9 border rounded px-2 border-slate-300 bg-white"
                      />
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <input
                        value={it.qty}
                        onChange={(e) =>
                          setItemField(idx, "qty", e.target.value)
                        }
                        className="w-full h-9 border rounded px-2 border-slate-300 bg-white text-center"
                      />
                    </td>
                    <td className="border px-3 py-2 text-right">
                      <input
                        value={it.unitPrice}
                        onChange={(e) =>
                          setItemField(idx, "unitPrice", e.target.value)
                        }
                        className="w-full h-9 border rounded px-2 border-slate-300 bg-white text-right"
                        placeholder={t("ProcurementAdd.items.unitPricePlaceholder")}
                      />
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {money(amount)}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        type="button"
                        className="text-red-600"
                        onClick={() => removeRow(idx)}
                        title={t("ProcurementAdd.items.delete")}
                        aria-label={t("ProcurementAdd.items.delete")}
                      >
                        <FiX />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* add button */}
        <button
          type="button"
          onClick={addRow}
          className="mt-3 px-5 h-10 rounded-md bg-[#4b2e83] text-white flex items-center gap-2 text-[14px]"
        >
          <FiPlus />
          {t("ProcurementAdd.items.add")}
        </button>

        {/* summary box */}
        <div className="mt-4 w-full text-[14px] border rounded overflow-hidden">
          <div className="grid grid-cols-3">
            <div className="col-span-2 border-r px-3 py-2 bg-gray-50 font-semibold text-right">
              {t("ProcurementAdd.summary.subtotal")}
            </div>
            <div className="px-3 py-2 text-right">{money(subtotal)}</div>

            <div className="col-span-2 border-t border-r px-3 py-2 bg-gray-50 font-semibold text-right">
              {t("ProcurementAdd.summary.vat")}
            </div>
            <div className="border-t px-3 py-2 text-right">{money(vat)} THB</div>

            <div className="col-span-2 border-t border-r px-3 py-2 bg-gray-50 font-semibold text-right">
              {t("ProcurementAdd.summary.total")}
            </div>
            <div className="border-t px-3 py-2 text-right">
              {money(total)} THB
            </div>
          </div>
        </div>

        {/* remark */}
        <div className="mt-6">
          <label className={label}>{t("ProcurementAdd.fields.remark")}</label>
          <textarea
            rows={3}
            className={area}
            value={header.remark}
            onChange={(e) => setHeaderField("remark", e.target.value)}
          />
        </div>

        {/* status radios (value คงเดิม) */}
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-[14px]">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="pending"
              checked={header.status === "pending"}
              onChange={(e) => setHeaderField("status", e.target.value)}
            />
            <span>{t("ProcurementAdd.status.pending")}</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="pendingApproval"
              checked={header.status === "pendingApproval"}
              onChange={(e) => setHeaderField("status", e.target.value)}
            />
            <span>{t("ProcurementAdd.status.pendingApproval")}</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="approved"
              checked={header.status === "approved"}
              onChange={(e) => setHeaderField("status", e.target.value)}
            />
            <span>{t("ProcurementAdd.status.approved")}</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="pendingDelivery"
              checked={header.status === "pendingDelivery"}
              onChange={(e) => setHeaderField("status", e.target.value)}
            />
            <span>{t("ProcurementAdd.status.pendingDelivery")}</span>
          </label>
        </div>

        {/* actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-gray-200 px-5 py-2 text-gray-800  hover:opacity-90"
          >
            {t("ProcurementAdd.actions.cancel")}
          </button>
          <button
            type="submit"
            className="px-6 h-10 rounded-md bg-[#4b2e83] text-white text-[14px] hover:opacity-95"
          >
            {t("ProcurementAdd.actions.submit")}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Export to PDF", { header, items });
              // TODO: export PDF logic
            }}
            className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
            title={t("ProcurementAdd.actions.pdf")}
            aria-label={t("ProcurementAdd.actions.pdf")}
          >
            <FiFileText className="w-4 h-4" />
            {t("ProcurementAdd.actions.pdf")}
          </button>
        </div>
      </form>
    </div>
  );
}
