// src/pages/sales/ShippingInstructionAdd.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiPlus, FiX, FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const today = () => new Date().toISOString().slice(0, 10);

export default function ShippingInstructionAdd() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* Header form state */
  const [form, setForm] = useState({
    documentNo: "SI-20250501-807",
    issueDate: today(),
    deliveryDate: "",
    customerName: "",
    cpoNo: "",
    deliveryAddress: "",
    shippingMethod: "",
    specialInstructions: "",
    approval: "approved",
    personInCharge: "",
  });
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  /* Items state */
  const [items, setItems] = useState([
    { id: 1, productId: "", productName: "", qty: "", unit: "", remarks: "" },
    { id: 2, productId: "", productName: "", qty: "", unit: "", remarks: "" },
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
        unit: "",
        remarks: "",
      },
    ]);
  const removeRow = (i) =>
    setItems((rows) => rows.filter((_, idx) => idx !== i));

  const onCancel = () => navigate("/sales/shippinginstruction");
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT", { form, items });
    navigate("/sales/shippinginstruction");
  };

  /* ---------- shared styles to match the screenshot ---------- */
  const labelCls = "block text-[13px] text-slate-700 mb-1";
  const inputCls =
    "w-full h-10 border border-slate-300 rounded-md px-3 text-[14px] bg-white";
  const areaCls =
    "w-full border border-slate-300 rounded-md px-3 py-2 text-[14px] bg-white";
  const cellInputCls =
    "w-full h-9 border border-slate-300 rounded-md px-2 text-[14px] bg-white";

  return (
    <div>
      <PageHeader title={t("ShippingInstructionAdd_pageHeader")} />

      {/* top-right List button */}
      <div className="px-6 mt-5 flex justify-end">
        <Link
          to="/sales/shipping-instruction"
          className="px-4 h-8 rounded-md bg-blue-100 text-blue-700 border border-blue-200 flex items-center text-[14px]"
        >
          {t("ShippingInstructionAdd_list")}
        </Link>
      </div>

      <form onSubmit={onSubmit} className="px-6 pb-12">
        {/* Header (compact 2 columns; 2 textareas same row) */}
        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 items-start">
          {/* Row 1 */}
          <div className="space-y-0">
            <label className="block text-xs text-slate-700 mb-0.5">
              {t("ShippingInstructionAdd_documentNoLabel")}
            </label>
            <input
              value={form.documentNo}
              onChange={(e) => setField("documentNo", e.target.value)}
              className="w-full h-8 border border-slate-300 rounded-md px-2 text-[13px] bg-white"
              placeholder={t("ShippingInstructionAdd_documentNoPh")}
            />
          </div>

          <div className="space-y-0">
            <label className="block text-xs text-slate-700 mb-0.5">
              {t("ShippingInstructionAdd_customerNameLabel")}
            </label>
            <input
              value={form.customerName}
              onChange={(e) => setField("customerName", e.target.value)}
              className="w-full h-8 border border-slate-300 rounded-md px-2 text-[13px] bg-white"
              placeholder={t("ShippingInstructionAdd_customerNamePh")}
            />
          </div>

          {/* Row 2 */}
          <div className="space-y-0">
            <label className="block text-xs text-slate-700 mb-0.5">
              {t("ShippingInstructionAdd_issueDateLabel")}
            </label>
            <input
              type="date"
              value={form.issueDate}
              onChange={(e) => setField("issueDate", e.target.value)}
              className="w-full h-8 border border-slate-300 rounded-md px-2 text-[13px] bg-white"
            />
          </div>

          <div className="space-y-0">
            <label className="block text-xs text-slate-700 mb-0.5">
              {t("ShippingInstructionAdd_cpoNoLabel")}
            </label>
            <input
              value={form.cpoNo}
              onChange={(e) => setField("cpoNo", e.target.value)}
              className="w-full h-8 border border-slate-300 rounded-md px-2 text-[13px] bg-white"
              placeholder={t("ShippingInstructionAdd_cpoNoPh")}
            />
          </div>

          {/* Row 3 */}
          <div className="space-y-0">
            <label className="block text-xs text-slate-700 mb-0.5">
              {t("ShippingInstructionAdd_deliveryDateLabel")}
            </label>
            <input
              type="date"
              value={form.deliveryDate}
              onChange={(e) => setField("deliveryDate", e.target.value)}
              className="w-full h-8 border border-slate-300 rounded-md px-2 text-[13px] bg-white"
            />
          </div>

          <div className="space-y-0">
            <label className="block text-xs text-slate-700 mb-0.5">
              {t("ShippingInstructionAdd_shippingMethodLabel")}
            </label>
            <select
              value={form.shippingMethod}
              onChange={(e) => setField("shippingMethod", e.target.value)}
              className="w-full h-8 border border-slate-300 rounded-md px-2 text-[13px] bg-white"
            >
              <option value="">{t("ShippingInstructionAdd_shippingMethodPh")}</option>
              {/* คงค่า value เดิม (ภาษาญี่ปุ่น) เพื่อไม่กระทบ logic อื่น ๆ */}
              <option value="宅配便">{t("ShippingInstructionAdd_methodCourier")}</option>
              <option value="トラック">{t("ShippingInstructionAdd_methodTruck")}</option>
              <option value="郵便">{t("ShippingInstructionAdd_methodMail")}</option>
              <option value="来店受取">{t("ShippingInstructionAdd_methodPickup")}</option>
            </select>
          </div>

          {/* Row 4 */}
          <div className="space-y-0">
            <label className="block text-xs text-slate-700 mb-0.5">
              {t("ShippingInstructionAdd_deliveryAddressLabel")}
            </label>
            <textarea
              rows={3}
              value={form.deliveryAddress}
              onChange={(e) => setField("deliveryAddress", e.target.value)}
              className="w-full h-[88px] border border-slate-300 rounded-md px-3 py-2 text-[13px] bg-white resize-none"
              placeholder={t("ShippingInstructionAdd_deliveryAddressPh")}
            />
          </div>

          <div className="space-y-0">
            <label className="block text-xs text-slate-700 mb-0.5">
              {t("ShippingInstructionAdd_specialInstructionsLabel")}
            </label>
            <textarea
              rows={3}
              value={form.specialInstructions}
              onChange={(e) => setField("specialInstructions", e.target.value)}
              className="w-full h-[88px] border border-slate-300 rounded-md px-3 py-2 text-[13px] bg-white resize-none"
              placeholder={t("ShippingInstructionAdd_specialInstructionsPh")}
            />
          </div>
        </div>

        {/* Section title + rule */}
        <div className="mt-7">
          <div className="flex items-center mb-2">
            <span className="text-[16px] font-semibold text-indigo-700 pr-3 bg-white">
              {t("ShippingInstructionAdd_itemsSection")}
            </span>
            <div className="flex-1 border-b-[3px] border-indigo-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-[14px]">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border px-3 py-2 text-left w-16">{t("ShippingInstructionAdd_thNo")}</th>
                <th className="border px-3 py-2 text-left w-48">{t("ShippingInstructionAdd_thProductId")}</th>
                <th className="border px-3 py-2 text-left">{t("ShippingInstructionAdd_thProductName")}</th>
                <th className="border px-3 py-2 text-center w-36">{t("ShippingInstructionAdd_thQty")}</th>
                <th className="border px-3 py-2 text-left w-32">{t("ShippingInstructionAdd_thUnit")}</th>
                <th className="border px-3 py-2 text-left w-[260px]">{t("ShippingInstructionAdd_thRemarks")}</th>
                <th className="border px-3 py-2 text-center w-14"> </th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr
                  key={it.id}
                  className={idx % 2 ? "bg-white" : "bg-slate-50"}
                >
                  <td className="border px-3 py-2">{idx + 1}</td>
                  <td className="border px-3 py-2">
                    <input
                      value={it.productId}
                      onChange={(e) =>
                        setItemField(idx, "productId", e.target.value)
                      }
                      className={cellInputCls}
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      value={it.productName}
                      onChange={(e) =>
                        setItemField(idx, "productName", e.target.value)
                      }
                      className={cellInputCls}
                    />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <input
                      value={it.qty}
                      onChange={(e) => setItemField(idx, "qty", e.target.value)}
                      className={`${cellInputCls} text-center`}
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      value={it.unit}
                      onChange={(e) =>
                        setItemField(idx, "unit", e.target.value)
                      }
                      className={cellInputCls}
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      value={it.remarks}
                      onChange={(e) =>
                        setItemField(idx, "remarks", e.target.value)
                      }
                      className={cellInputCls}
                    />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      type="button"
                      className="text-red-600"
                      title={t("ShippingInstructionAdd_delete")}
                      onClick={() => removeRow(idx)}
                    >
                      <FiX />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={addRow}
          className="mt-3 px-5 h-10 rounded-md bg-[#4b2e83] text-white flex items-center gap-2 text-[14px]"
        >
          <FiPlus />
          {t("ShippingInstructionAdd_addRow")}
        </button>

        {/* Approval & Person in Charge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-9">
          <div>
            <div className="text-[14px] font-semibold mb-2">{t("ShippingInstructionAdd_approvalSection")}</div>
            <div className="flex items-center gap-10">
              <label className="inline-flex items-center gap-2 text-[14px]">
                <input
                  type="radio"
                  name="approval"
                  checked={form.approval === "approved"}
                  onChange={() => setField("approval", "approved")}
                />
                <span>{t("ShippingInstructionAdd_approved")}</span>
              </label>
              <label className="inline-flex items-center gap-2 text-[14px]">
                <input
                  type="radio"
                  name="approval"
                  checked={form.approval === "notApproved"}
                  onChange={() => setField("approval", "notApproved")}
                />
                <span>{t("ShippingInstructionAdd_notApproved")}</span>
              </label>
            </div>
          </div>

          <div>
            <div className="text-[14px] font-semibold mb-2">
              {t("ShippingInstructionAdd_personInChargeLabel")}
            </div>
            <input
              value={form.personInCharge}
              onChange={(e) => setField("personInCharge", e.target.value)}
              className={inputCls}
              placeholder={t("ShippingInstructionAdd_personInChargePh")}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 h-10 rounded-md bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
          >
            {t("ShippingInstructionAdd_cancel")}
          </button>
          <button
            type="submit"
            className="px-6 h-10 rounded-md bg-[#4b2e83] text-white text-[14px] hover:opacity-95"
          >
            {t("ShippingInstructionAdd_submit")}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Export to PDF", { form, items });
              // TODO: export PDF logic
            }}
            className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
          >
            <FiFileText className="w-4 h-4" />
            {t("ShippingInstructionAdd_pdf")}
          </button>
        </div>
      </form>
    </div>
  );
}
