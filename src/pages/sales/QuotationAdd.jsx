// src/pages/sales/QuotationAdd.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiTrash2, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

/* ---------- helpers ---------- */
const jpy = (n) =>
  (Number(n) || 0).toLocaleString("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  });
const todayStr = () => new Date().toISOString().slice(0, 10);

/* ---------- simple Modal component ---------- */
function Modal({ open, title, children, onClose }) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* dialog */}
      <div className="relative bg-white rounded-xl shadow-xl w-[92vw] sm:w-[90vw] max-w-md p-5">
        {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
        <div className="text-sm mb-4">{children}</div>
        {onClose && (
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 h-9 rounded bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
            >
              {t("QuotationAdd_close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- confirm modal (two actions) ---------- */
function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmColor = "bg-blue-600 hover:bg-blue-700", // default confirm = blue
  cancelColor = "bg-gray-200 hover:bg-gray-300 text-gray-800",
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-[92vw] sm:w-[90vw] max-w-md p-5">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <div className="text-sm mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className={`px-4 h-9 rounded text-sm ${cancelColor}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 h-9 rounded text-white text-sm ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuotationAdd() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  /* ---------- initial state factories ---------- */
  const initialHeader = () => ({
    issueDate: todayStr(),
    documentNo: "A123",
    title: t("QuotationAdd_title"),
    customerMark: t("QuotationAdd_customerMark"),
    customerName: "",
    postalMark: t("QuotationAdd_postalMark"),
    postalCode: "",
    address: "",
    taxId: "",
    tel: "",
    signText: t("QuotationAdd_signText"),
    subject: "",
    note: "",
  });

  const initialItem = (id = 1) => ({
    id,
    description: "",
    reduced: false,
    qty: "",
    unit: "",
    unitPrice: "",
    taxRate: "10",
  });

  /* ---------- header state ---------- */
  const [header, setHeader] = useState(initialHeader());

  /* sync translatable header fields when language changes */
  useEffect(() => {
    setHeader((h) => ({
      ...h,
      title: t("QuotationAdd_title"),
      customerMark: t("QuotationAdd_customerMark"),
      postalMark: t("QuotationAdd_postalMark"),
      signText: t("QuotationAdd_signText"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  /* ---------- items ---------- */
  const [items, setItems] = useState([initialItem()]);

  /* ---------- modal state ---------- */
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const setHeaderField = (k, v) => setHeader((h) => ({ ...h, [k]: v }));
  const setItemField = (i, k, v) =>
    setItems((rows) => {
      const next = [...rows];
      next[i] = { ...next[i], [k]: v };
      if (k === "reduced") next[i].taxRate = v ? "8" : "10";
      return next;
    });

  const addRow = () =>
    setItems((rows) => {
      const nextId = rows.length ? rows[rows.length - 1].id + 1 : 1;
      return [...rows, initialItem(nextId)];
    });

  const removeRow = (i) => setItems((rows) => rows.filter((_, idx) => idx !== i));

  /* ---------- actions ---------- */
  const handleSave = () => {
    setShowConfirmSave(true);
  };

  const actuallySave = () => {
    console.log("SAVE payload", { header, items });
    setShowConfirmSave(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate("/sales/quotation");
    }, 1000);
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmLeave = () => {
    setShowCancelConfirm(false);
    navigate("/sales/quotation");
  };

  /* ---------- calculations ---------- */
  const lineAmountExcl = (it) =>
    (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);

  const subtotalExcl = useMemo(
    () => items.reduce((s, it) => s + lineAmountExcl(it), 0),
    [items]
  );

  const subtotal10Excl = useMemo(
    () =>
      items
        .filter((it) => Number(it.taxRate) === 10)
        .reduce((s, it) => s + lineAmountExcl(it), 0),
    [items]
  );
  const subtotal8Excl = useMemo(
    () =>
      items
        .filter((it) => Number(it.taxRate) === 8)
        .reduce((s, it) => s + lineAmountExcl(it), 0),
    [items]
  );

  const tax10Only = useMemo(() => Math.round(subtotal10Excl * 0.1), [subtotal10Excl]);
  const tax8Only = useMemo(() => Math.round(subtotal8Excl * 0.08), [subtotal8Excl]);
  const totalTax = tax10Only + tax8Only;
  const grandTotalIncl = subtotalExcl + totalTax;

  return (
    <div className="">
      <PageHeader title={t("QuotationAdd_pageHeader")} />

      {/* outer frame */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="border border-gray-300 mt-5 rounded-md overflow-hidden">
          {/* top meta rows */}
          <div className="flex justify-end">
            <div className="flex-1  hidden sm:block" />
            <div className="flex">
              <div className="flex justify-end px-3 sm:px-4 py-2 text-xs gap-4 sm:space-x-6 ">
                <div className="text-right w-40">
                  <div className="mb-1">{t("QuotationAdd_issueDateLabel")}</div>
                  <input
                    type="date"
                    value={header.issueDate}
                    onChange={(e) => setHeaderField("issueDate", e.target.value)}
                    className="h-8 border rounded px-2 text-xs w-full"
                  />
                </div>
                <div className="text-right w-40">
                  <div className="mb-1">{t("QuotationAdd_documentNoLabel")}</div>
                  <input
                    value={header.documentNo}
                    onChange={(e) => setHeaderField("documentNo", e.target.value)}
                    className="h-8 border rounded px-2 text-xs w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center py-4 sm:py-5 px-3 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">{header.title}</h1>
          </div>

          {/* address block row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 border-t border-gray-300">
            {/* left column with postal mark */}
            <div className="sm:col-span-2 border-b sm:border-b-0 sm:border-r border-gray-300">
              <div className="h-10 border-b border-gray-300 flex items-center px-3 text-sm">
                {header.postalMark}
              </div>
              <div className="h-10 border-b border-gray-300 px-3 flex items-center text-sm">
                <input
                  value={header.postalCode}
                  onChange={(e) => setHeaderField("postalCode", e.target.value)}
                  className="w-full h-8 border rounded px-2 text-xs"
                  placeholder={t("QuotationAdd_postalCodePlaceholder")}
                />
              </div>
              <div className="h-[56px] sm:h-[72px] px-3" />
            </div>

            {/* middle narrow cell with “To” */}
            <div className="sm:col-span-2 sm:border-r border-gray-300">
              <div className="h-10 border-b border-gray-300 flex items-center sm:justify-center px-3 sm:px-0 text-sm">
                {header.customerMark}
              </div>
              <div className="h-[72px] hidden sm:block" />
            </div>

            {/* right info box */}
            <div className="sm:col-span-8">
              <div className="h-10 border-b border-gray-300 px-3 flex items-center">
                <input
                  value={header.customerName}
                  onChange={(e) => setHeaderField("customerName", e.target.value)}
                  className="w-full h-8 border rounded px-2 text-xs"
                  placeholder={t("QuotationAdd_customerNamePlaceholder")}
                />
              </div>
              <div className="h-10 border-b border-gray-300 px-3 flex items-center">
                <input
                  value={header.address}
                  onChange={(e) => setHeaderField("address", e.target.value)}
                  className="w-full h-8 border rounded px-2 text-xs"
                  placeholder={t("QuotationAdd_addressPlaceholder")}
                />
              </div>
              <div className="h-auto border-b border-gray-300 px-3 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 w-full">
                  <input
                    value={header.taxId}
                    onChange={(e) => setHeaderField("taxId", e.target.value)}
                    className="sm:col-span-7 h-8 border rounded px-2 text-xs w-full"
                    placeholder={t("QuotationAdd_taxIdPlaceholder")}
                  />
                  <input
                    value={header.tel}
                    onChange={(e) => setHeaderField("tel", e.target.value)}
                    className="sm:col-span-5 h-8 border rounded px-2 text-xs w-full"
                    placeholder={t("QuotationAdd_telPlaceholder")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* received sentence + subject */}
          <div className="grid grid-cols-1 sm:grid-cols-12 border-t border-gray-300">
            <div className="sm:col-span-12 border-b border-gray-300 px-3 py-2 text-sm">
              {header.signText}
            </div>
            <div className="sm:col-span-4 sm:border-r border-b border-gray-300 px-3 py-2 text-sm flex items-center gap-2">
              <span className="whitespace-nowrap">{t("QuotationAdd_subjectLabel")}</span>
              <input
                value={header.subject}
                onChange={(e) => setHeaderField("subject", e.target.value)}
                className="h-8 border rounded px-2 text-xs flex-1"
                placeholder={t("QuotationAdd_subjectPlaceholder")}
              />
            </div>

            {/* big total box */}
            <div className="sm:col-span-8 border-b border-gray-300 grid grid-cols-12">
              <div className="col-span-6 border-r border-gray-300 px-3 py-3 text-base sm:text-lg">
                {t("QuotationAdd_totalLabel")}
              </div>
              <div className="col-span-4 border-r border-gray-300 px-3 py-3 text-right text-lg font-semibold">
                {jpy(grandTotalIncl)}
              </div>
              <div className="col-span-2 px-3 py-3 text-sm flex items-center">
                {t("QuotationAdd_taxIncluded")}
              </div>
            </div>
          </div>

          {/* items section */}
          <div className="border-t border-gray-300">
            {/* table header (hidden on mobile) */}
            <div className="hidden sm:grid grid-cols-12 bg-gray-100 border-b border-gray-300 text-sm">
              <div className="col-span-5 border-r border-gray-300 px-3 py-2">{t("QuotationAdd_colDescription")}</div>
              <div className="col-span-1 border-r border-gray-300 px-3 py-2 text-center">{t("QuotationAdd_colReduced")}</div>
              <div className="col-span-2 border-r border-gray-300 px-3 py-2 text-center">{t("QuotationAdd_colQtyUnit")}</div>
              <div className="col-span-2 border-r border-gray-300 px-3 py-2 text-right">{t("QuotationAdd_colUnitPrice")}</div>
              <div className="col-span-1 border-r border-gray-300 px-3 py-2 text-center">{t("QuotationAdd_colTaxRate")}</div>
              <div className="col-span-1 px-3 py-2 text-right">{t("QuotationAdd_colAmountExcl")}</div>
            </div>

            {/* desktop rows */}
            <div className="hidden sm:block">
              {items.map((it, idx) => {
                const amount = lineAmountExcl(it);
                return (
                  <div key={it.id} className="grid grid-cols-12 border-b border-gray-300 text-sm">
                    <div className="col-span-5 border-r border-gray-200 px-2 py-1.5">
                      <input
                        value={it.description}
                        onChange={(e) => setItemField(idx, "description", e.target.value)}
                        className="w-full h-8 border rounded px-2 text-xs"
                        placeholder={t("QuotationAdd_descPlaceholder")}
                      />
                    </div>
                    <div className="col-span-1 border-r border-gray-200 px-2 py-1.5 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={it.reduced}
                        onChange={(e) => setItemField(idx, "reduced", e.target.checked)}
                        aria-label={t("QuotationAdd_reducedAria")}
                      />
                    </div>
                    <div className="col-span-2 border-r border-gray-200 px-2 py-1.5">
                      <div className="grid grid-cols-12 gap-2">
                        <input
                          value={it.qty}
                          onChange={(e) => setItemField(idx, "qty", e.target.value)}
                          className="col-span-6 h-8 border rounded px-2 text-xs text-center"
                          placeholder={t("QuotationAdd_qtyPlaceholder")}
                        />
                        <input
                          value={it.unit}
                          onChange={(e) => setItemField(idx, "unit", e.target.value)}
                          className="col-span-6 h-8 border rounded px-2 text-xs text-center"
                          placeholder={t("QuotationAdd_unitPlaceholder")}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 border-r border-gray-200 px-2 py-1.5">
                      <input
                        value={it.unitPrice}
                        onChange={(e) => setItemField(idx, "unitPrice", e.target.value)}
                        className="w-full h-8 border rounded px-2 text-xs text-right"
                        placeholder={t("QuotationAdd_unitPricePlaceholder")}
                      />
                    </div>
                    <div className="col-span-1 border-r border-gray-200 px-2 py-1.5">
                      <select
                        value={it.taxRate}
                        onChange={(e) => setItemField(idx, "taxRate", e.target.value)}
                        className="w-full h-8 border rounded px-2 text-xs text-center"
                        aria-label={t("QuotationAdd_colTaxRate")}
                      >
                        <option value="10">10%</option>
                        <option value="8">8%</option>
                      </select>
                    </div>
                    <div className="col-span-1 px-2 py-1.5 text-right">{jpy(amount)}</div>
                  </div>
                );
              })}
            </div>

            {/* mobile card rows */}
            <div className="sm:hidden divide-y divide-gray-200">
              {items.map((it, idx) => {
                const amount = lineAmountExcl(it);
                return (
                  <div key={it.id} className="p-3">
                    <div className="flex items-start gap-2">
                      <input
                        className="flex-1 h-10 border rounded px-2 text-sm"
                        value={it.description}
                        onChange={(e) => setItemField(idx, "description", e.target.value)}
                        placeholder={t("QuotationAdd_descPlaceholder")}
                      />
                      {/* remove last row quick */}
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="shrink-0 px-3 h-10 rounded bg-red-600 text-white text-xs flex items-center gap-1"
                        aria-label={t("QuotationAdd_removeRowAria")}
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 border rounded px-2 h-9">
                        <input
                          type="checkbox"
                          checked={it.reduced}
                          onChange={(e) => setItemField(idx, "reduced", e.target.checked)}
                        />
                        <span>{t("QuotationAdd_reducedLabelMobile")}</span>
                      </label>
                      <select
                        value={it.taxRate}
                        onChange={(e) => setItemField(idx, "taxRate", e.target.value)}
                        className="border rounded px-2 h-9"
                        aria-label={t("QuotationAdd_colTaxRate")}
                      >
                        <option value="10">10%</option>
                        <option value="8">8%</option>
                      </select>
                      <input
                        value={it.qty}
                        inputMode="decimal"
                        onChange={(e) => setItemField(idx, "qty", e.target.value)}
                        className="border rounded px-2 h-9"
                        placeholder={t("QuotationAdd_qtyPlaceholder")}
                      />
                      <input
                        value={it.unit}
                        onChange={(e) => setItemField(idx, "unit", e.target.value)}
                        className="border rounded px-2 h-9"
                        placeholder={t("QuotationAdd_unitPlaceholder")}
                      />
                      <input
                        value={it.unitPrice}
                        inputMode="decimal"
                        onChange={(e) => setItemField(idx, "unitPrice", e.target.value)}
                        className="border rounded px-2 h-9 col-span-2"
                        placeholder={t("QuotationAdd_unitPricePlaceholder")}
                      />
                    </div>

                    <div className="mt-2 text-right text-sm">
                      <span className="text-gray-500 mr-2">{t("QuotationAdd_amountLabel")}</span>
                      <span className="font-medium">{jpy(amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* add/remove buttons */}
            <div className="px-2 py-2 flex gap-2 sticky bottom-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t sm:border-none">
              <button
                type="button"
                onClick={addRow}
                className="px-3 h-9 rounded bg-indigo-600 text-white text-xs flex items-center gap-1"
              >
                <FiPlus /> {t("QuotationAdd_addRow")}
              </button>
              <button
                type="button"
                onClick={() => removeRow(items.length - 1)}
                disabled={items.length <= 1}
                className="px-3 h-9 rounded bg-red-600 text-white text-xs flex items-center gap-1 disabled:opacity-50"
              >
                <FiTrash2 /> {t("QuotationAdd_removeLastRow")}
              </button>
            </div>
          </div>

          {/* bottom summary strip */}
          <div className="grid grid-cols-1 sm:grid-cols-12 border-t border-gray-300">
            <div className="sm:col-span-8 sm:border-r border-gray-300">
              <div className="hidden sm:grid grid-cols-12 bg-gray-100 text-sm border-b border-gray-300">
                <div className="col-span-4 px-3 py-2 border-r border-gray-300">{t("QuotationAdd_taxBreakdown")}</div>
                <div className="col-span-4 px-3 py-2 border-r border-gray-300 text-right">{t("QuotationAdd_subtotalExcl")}</div>
                <div className="col-span-4 px-3 py-2 text-right">{t("QuotationAdd_taxAmount")}</div>
              </div>
              <div className="hidden sm:grid grid-cols-12 text-sm border-b border-gray-200">
                <div className="col-span-4 px-3 py-2 border-r border-gray-200">{t("QuotationAdd_target10")}</div>
                <div className="col-span-4 px-3 py-2 border-r border-gray-200 text-right">{jpy(subtotal10Excl)}</div>
                <div className="col-span-4 px-3 py-2 text-right">{jpy(tax10Only)}</div>
              </div>
              <div className="hidden sm:grid grid-cols-12 text-sm">
                <div className="col-span-4 px-3 py-2 border-r border-gray-200">{t("QuotationAdd_target8")}</div>
                <div className="col-span-4 px-3 py-2 border-r border-gray-200 text-right">{jpy(subtotal8Excl)}</div>
                <div className="col-span-4 px-3 py-2 text-right">{jpy(tax8Only)}</div>
              </div>

              {/* mobile summary cards */}
              <div className="sm:hidden divide-y border-t border-gray-200 text-sm">
                <div className="flex items-center justify-between px-3 py-2">
                  <span>{t("QuotationAdd_target10")}</span>
                  <span className="font-medium">{jpy(subtotal10Excl)}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span>{t("QuotationAdd_tax10")}</span>
                  <span className="font-medium">{jpy(tax10Only)}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span>{t("QuotationAdd_target8")}</span>
                  <span className="font-medium">{jpy(subtotal8Excl)}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span>{t("QuotationAdd_tax8")}</span>
                  <span className="font-medium">{jpy(tax8Only)}</span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-4 text-sm">
              <div className="grid grid-cols-12">
                <div className="col-span-6 px-3 py-2 bg-gray-100 border-b border-gray-300">{t("QuotationAdd_subtotal")}</div>
                <div className="col-span-6 px-3 py-2 border-b border-gray-300 text-right">{jpy(subtotalExcl)}</div>

                <div className="col-span-6 px-3 py-2 bg-gray-100 border-b border-gray-300">{t("QuotationAdd_tax")}</div>
                <div className="col-span-6 px-3 py-2 border-b border-gray-300 text-right">{jpy(totalTax)}</div>

                <div className="col-span-6 px-3 py-2 bg-gray-100">{t("QuotationAdd_grandTotal")}</div>
                <div className="col-span-6 px-3 py-2 text-right font-semibold">{jpy(grandTotalIncl)}</div>
              </div>
            </div>
          </div>

          {/* footnote + remarks */}
          <div className="border-t border-gray-300">
            <div className="px-3 py-2 text-xs text-gray-600">
              {t("QuotationAdd_footnote")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 border-t border-gray-300">
              <div className="sm:col-span-2 sm:border-r border-gray-300 px-3 py-2 text-sm bg-gray-100">
                {t("QuotationAdd_remarks")}
              </div>
              <div className="sm:col-span-10 px-3 py-2">
                <textarea
                  rows={4}
                  value={header.note}
                  onChange={(e) => setHeaderField("note", e.target.value)}
                  className="w-full border rounded px-2 py-2 text-xs"
                  placeholder={t("QuotationAdd_remarksPlaceholder")}
                />
              </div>
            </div>

            {/* Save/Cancel row */}
            <div className="border-t border-gray-300 px-3 py-3 flex flex-col sm:flex-row sm:items-center justify-end gap-2 sticky bottom-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <div className="text-xs text-gray-500 sm:mr-auto sm:hidden">
                {t("QuotationAdd_notAutoSave")}
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 h-9 rounded bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
              >
                {t("QuotationAdd_cancel")}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 h-9 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                {t("QuotationAdd_save")}
              </button>

              {/* PDF button */}
              <button
                type="button"
                onClick={() => {
                  console.log("Export to PDF", { header, items });
                  // TODO: export PDF logic
                }}
                className="px-4 h-9 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
                aria-label={t("QuotationAdd_pdf")}
              >
                <FiFileText className="w-4 h-4" />
                {t("QuotationAdd_pdf")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={showConfirmSave}
        title={t("QuotationAdd_confirm_title")}
        message={t("QuotationAdd_confirm_message")}
        confirmText={t("QuotationAdd_confirm_save")}
        cancelText={t("QuotationAdd_confirm_cancel")}
        onConfirm={actuallySave}
        onCancel={() => setShowConfirmSave(false)}
        confirmColor="bg-blue-600 hover:bg-blue-700"
      />

      {/* Success Modal with green check & auto-close */}
      <Modal
        open={showSuccessModal}
        title=""
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/sales/quotation");
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-800 font-medium">{t("QuotationAdd_success_added")}</p>
        </div>
      </Modal>

      {/* Confirm Cancel Modal (Leave = red) */}
      <ConfirmModal
        open={showCancelConfirm}
        title={t("QuotationAdd_cancel_confirm_title")}
        message={t("QuotationAdd_cancel_confirm_message")}
        confirmText={t("QuotationAdd_cancel_confirm_leave")}
        cancelText={t("QuotationAdd_cancel_confirm_stay")}
        onConfirm={confirmLeave}
        onCancel={() => setShowCancelConfirm(false)}
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
