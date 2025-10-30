// src/pages/international/ManagePurchase.jsx
import React, { useMemo, useState, useEffect } from "react";
import { FiEye, FiEdit2, FiXCircle, FiPlus, FiFileText } from "react-icons/fi";
import { FaHourglassHalf, FaCheckCircle } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

/* ---------- Status helpers ---------- */
const STATUS = {
  DRAFT: "下書き",
  REVIEW: "レビュー中",
  APPROVED: "承認済み",
};

function StatusBadge({ status = STATUS.REVIEW, size = "md" }) {
  const { t } = useTranslation();
  const sizes = size === "sm" ? "px-2 py-0.5 text-[12px]" : "px-3 py-1 text-sm";
  let cls = "bg-gray-100 text-gray-800 border border-gray-200";
  let Icon = FaHourglassHalf;

  // รองรับค่าจาก data ทั้งที่เป็นอังกฤษหรือญี่ปุ่น
  const displayStatus =
    {
      Draft: t("ManagePurchase.status.DRAFT"),
      下書き: t("ManagePurchase.status.DRAFT"),
      "Under Review": t("ManagePurchase.status.REVIEW"),
      レビュー中: t("ManagePurchase.status.REVIEW"),
      Approved: t("ManagePurchase.status.APPROVED"),
      承認済み: t("ManagePurchase.status.APPROVED"),
    }[status] || status;

  if (status === "下書き" || status === "Draft") {
    cls = "bg-orange-100 text-orange-800 border border-orange-200";
  } else if (status === "レビュー中" || status === "Under Review") {
    cls = "bg-indigo-100 text-indigo-800 border border-indigo-200";
  } else if (status === "承認済み" || status === "Approved") {
    cls = "bg-emerald-100 text-emerald-800 border border-emerald-200";
    Icon = FaCheckCircle;
  }

  return (
    <span className={`inline-flex items-center rounded-full font-sm ${sizes} ${cls}`}>
      <Icon className="mr-1.5" />
      {t("ManagePurchase.statusPrefix")}
      {displayStatus}
    </span>
  );
}

/* ---------- File icon helper (non-image) ---------- */
function fileKindIcon(extOrMime = "") {
  const key = String(extOrMime).toLowerCase();
  if (key.includes("pdf") || key.endsWith(".pdf")) return { label: "PDF", bg: "bg-red-500" };
  if (key.includes("word") || key.endsWith(".doc") || key.endsWith(".docx")) return { label: "DOC", bg: "bg-blue-600" };
  if (key.includes("excel") || key.includes("spreadsheet") || key.endsWith(".xls") || key.endsWith(".xlsx") || key.endsWith(".csv"))
    return { label: "XLS", bg: "bg-emerald-600" };
  if (key.includes("powerpoint") || key.endsWith(".ppt") || key.endsWith(".pptx")) return { label: "PPT", bg: "bg-orange-600" };
  if (key.includes("zip") || key.includes("rar") || key.includes("7z") || key.endsWith(".zip") || key.endsWith(".rar") || key.endsWith(".7z"))
    return { label: "ZIP", bg: "bg-yellow-600" };
  if (key.endsWith(".txt")) return { label: "TXT", bg: "bg-gray-600" };
  if (key.endsWith(".json")) return { label: "JSON", bg: "bg-slate-700" };
  return { label: "ファイル", bg: "bg-indigo-600" };
}

function ManagePurchase() {
  const { t } = useTranslation();

  /* ---------- Demo data ---------- */
  const initialRows = [
    {
      poNumber: "PO-2025-001",
      orderDate: "2025-09-25",
      supplier: "ABC Trading Co., Ltd.",
      importerCountry: "タイ",
      category: "一般商品",
      currency: "THB",
      amount: "0.00",
      deliveryDate: "",
      paymentTerms: "代金引換",
      shippingMethod: "船便",
      productDetails: "",
      status: STATUS.REVIEW,
      attachments: [],
    },
    {
      poNumber: "PO-2025-002",
      orderDate: "2025-05-01",
      supplier: "Global Tech",
      importerCountry: "米国",
      category: "電子機器",
      currency: "USD",
      amount: "12500.00",
      deliveryDate: "2025-06-10",
      paymentTerms: "30日後払い",
      shippingMethod: "航空便",
      productDetails: "ノートPC X型 50台",
      status: STATUS.DRAFT,
      attachments: [],
    },
    {
      poNumber: "PO-2025-003",
      orderDate: "2025-05-06",
      supplier: "Innovate Ltd.",
      importerCountry: "英国",
      category: "部品",
      currency: "GBP",
      amount: "980.50",
      deliveryDate: "",
      paymentTerms: "銀行振込",
      shippingMethod: "宅配便",
      productDetails: "各種部品",
      status: STATUS.APPROVED,
      attachments: [],
    },
  ];

  const [rows, setRows] = useState(initialRows);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  /* ---------- search & pagination ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.poNumber, r.supplier, r.importerCountry, r.category, r.paymentTerms, r.shippingMethod, r.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filtered.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filtered, page]);

  const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  /* ---------- modal state ---------- */
  const [showModal, setShowModal] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const emptyForm = {
    poNumber: "",
    orderDate: "",
    supplier: "",
    importerCountry: "",
    category: "",
    currency: "THB",
    amount: "",
    deliveryDate: "",
    paymentTerms: "",
    shippingMethod: "",
    productDetails: "",
    attachments: [],
    status: STATUS.REVIEW,
  };
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  /* ---------- previews for attachments ---------- */
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const files = Array.isArray(form.attachments) ? form.attachments : [];
    const next = [];
    files.forEach((f, idx) => {
      const isImage = f && typeof f.type === "string" && f.type.startsWith("image/");
      const ext = f?.name?.includes(".") ? f.name.split(".").pop() : "";
      next.push({
        url: isImage ? URL.createObjectURL(f) : null,
        name: f?.name || "",
        size: f?.size || 0,
        type: f?.type || "",
        fileIndex: idx,
        isImage,
        ext,
      });
    });
    setPreviews(next);
    return () => next.forEach((p) => { if (p.isImage && p.url) URL.revokeObjectURL(p.url); });
  }, [form.attachments]);

  /* ---------- confirm & success ---------- */
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMode, setConfirmMode] = useState("submit"); // "draft" | "submit"
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* ---------- modal open/close ---------- */
  const openModal = (index = null, view = false) => {
    if (index !== null) {
      setForm({ ...rows[index] });
      setEditingIndex(index);
    } else {
      setForm({ ...emptyForm, attachments: [] });
      setEditingIndex(null);
    }
    setFormErrors({});
    setViewOnly(view);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  /* ---------- form helpers ---------- */
  const handleFormChange = (key, value) => {
    setForm((s) => ({ ...s, [key]: value }));
    setFormErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleAddAttachments = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setForm((prev) => ({
      ...prev,
      attachments: [...(Array.isArray(prev.attachments) ? prev.attachments : []), ...files],
    }));
    e.target.value = "";
  };

  const handleRemoveAttachment = (fileIndex) => {
    setForm((s) => ({
      ...s,
      attachments: (Array.isArray(s.attachments) ? s.attachments : []).filter((_, i) => i !== fileIndex),
    }));
  };

  const validateForm = () => {
    const errors = {};
    const required = ["poNumber", "orderDate", "supplier", "importerCountry", "currency", "paymentTerms", "shippingMethod"];
    required.forEach((k) => {
      if (!String(form[k] ?? "").trim()) errors[k] = t("ManagePurchase.required");
    });
    if (form.amount && Number.isNaN(Number(form.amount))) {
      errors.amount = t("ManagePurchase.amountInvalid");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const askConfirm = (mode) => {
    if (!validateForm()) return;
    setConfirmMode(mode); // draft or submit
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    const payload = { ...form, status: confirmMode === "submit" ? STATUS.REVIEW : STATUS.DRAFT };
    if (editingIndex !== null) {
      setRows((r) => {
        const next = [...r];
        next[editingIndex] = { ...next[editingIndex], ...payload };
        return next;
      });
      setSuccessMessage(t("ManagePurchase.toastUpdated"));
    } else {
      setRows((r) => [{ ...payload }, ...r]);
      setPage(1);
      setSuccessMessage(confirmMode === "submit" ? t("ManagePurchase.toastSavedSubmitted") : t("ManagePurchase.toastSavedDraft"));
    }
    setShowConfirmModal(false);
    setShowModal(false);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 1000);
  };

  /* ====== quick status buttons (modal) ====== */
  const quickSetStatus = (next) => {
    setForm((s) => ({ ...s, status: next }));
    if (editingIndex !== null) {
      setRows((r) => {
        const x = [...r];
        x[editingIndex] = { ...x[editingIndex], status: next };
        return x;
      });
    }
  };

  const handleClear = () => {
    setInput("");
    setQuery("");
    setPage(1);
  };

  /* ---------- UI ---------- */
  return (
    <div className="text-[13px]">
      <PageHeader title={t("ManagePurchase.title")} />

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-5 mb-4 gap-3">
        <div className="flex items-center gap-2 flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("ManagePurchase.searchPlaceholder")}
            className="flex-1 rounded-md border border-blue-200 px-3 py-2 outline-none min-w-0"
          />
          <button
            onClick={() => { setQuery(input); setPage(1); }}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-blue-500 text-white"
            title={t("ManagePurchase.search")}
          >
            🔍
          </button>
          <button
            onClick={handleClear}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-yellow-400 text-white"
            title={t("ManagePurchase.clear")}
          >
            ✖
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded w-full sm:w-auto justify-center"
          >
            <FiPlus /> {t("ManagePurchase.newPO")}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-blue-200" />

      {/* TABLE (desktop / tablet) */}
      <div className="mt-3 w-full rounded-lg overflow-x-auto hidden sm:block">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="text-blue-900 text-[13px] whitespace-nowrap">
              <th className="p-2 border-b-2 border-blue-200 w-[8%] text-start">{t("ManagePurchase.colPoNo")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[14%] text-start">{t("ManagePurchase.colSupplier")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[7%] text-start">{t("ManagePurchase.colCountry")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[10%] text-start">{t("ManagePurchase.colCategory")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[8%] text-start">{t("ManagePurchase.colAmount")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[6%] text-start">{t("ManagePurchase.colCurrency")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[9%] text-start">{t("ManagePurchase.colOrderDate")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[9%] text-start">{t("ManagePurchase.colDeliveryDate")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[11%] text-start">{t("ManagePurchase.colPaymentTerms")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[7%] text-start">{t("ManagePurchase.colShippingMethod")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[20%] text-start">{t("ManagePurchase.colStatus")}</th>
              <th className="p-2 border-b-2 border-blue-200 w-[10%] text-center">{t("ManagePurchase.colActions")}</th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {pageItems.length ? (
              pageItems.map((row, i) => (
                <tr key={i} className={`${i % 2 === 0 ? "bg-blue-50" : "bg-white"}`}>
                  <td className="p-2 border-b border-blue-200 truncate" title={row.poNumber}>{row.poNumber}</td>
                  <td className="p-2 border-b border-blue-200 truncate max-w-[22ch]" title={row.supplier}>{row.supplier}</td>
                  <td className="p-2 border-b border-blue-200">{row.importerCountry}</td>
                  <td className="p-2 border-b border-blue-200 truncate max-w-[18ch]">{row.category || "-"}</td>
                  <td className="p-2 border-b border-blue-200">{row.amount ? Number(row.amount).toLocaleString() : "0.00"}</td>
                  <td className="p-2 border-b border-blue-200">{row.currency}</td>
                  <td className="p-2 border-b border-blue-200">{row.orderDate || "-"}</td>
                  <td className="p-2 border-b border-blue-200">{row.deliveryDate || "-"}</td>
                  <td className="p-2 border-b border-blue-200 truncate max-w-[22ch]" title={row.paymentTerms}>{row.paymentTerms || "-"}</td>
                  <td className="p-2 border-b border-blue-200">{row.shippingMethod || "-"}</td>
                  <td className="p-2 border-b border-blue-200"><StatusBadge status={row.status} size="sm" /></td>
                  <td className="p-2 border-b border-blue-200">
                    <div className="flex items-center justify-center gap-3 text-[16px]">
                      <button className="text-indigo-700" onClick={() => openModal((page - 1) * PAGE_SIZE + i, true)} aria-label={t("ManagePurchase.view")} title={t("ManagePurchase.view")}>
                        <FiEye />
                      </button>
                      <button className="text-amber-600" onClick={() => openModal((page - 1) * PAGE_SIZE + i)} aria-label={t("ManagePurchase.edit")} title={t("ManagePurchase.edit")}>
                        <FiEdit2 />
                      </button>
                      <button className="text-red-600" aria-label={t("ManagePurchase.delete")} title={t("ManagePurchase.delete")} onClick={() => {}}>
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-center py-6 text-gray-500">
                  {t("ManagePurchase.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CARDS (mobile) */}
      <div className="sm:hidden mt-3 grid grid-cols-1 gap-3">
        {pageItems.length ? (
          pageItems.map((row, i) => (
            <div key={i} className="rounded-xl border border-blue-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-blue-50">
                <div className="min-w-0">
                  <div className="text-blue-900 font-semibold truncate">{row.poNumber}</div>
                  <div className="text-[12px] text-gray-600 truncate">{row.supplier}</div>
                </div>
                <StatusBadge status={row.status} size="sm" />
              </div>

              <div className="px-4 py-3 text-[13px]">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-gray-500">{t("ManagePurchase.lblCountry")}</div>
                  <div className="text-gray-800 text-right">{row.importerCountry}</div>

                  <div className="text-gray-500">{t("ManagePurchase.lblCategory")}</div>
                  <div className="text-gray-800 text-right truncate">{row.category || "-"}</div>

                  <div className="text-gray-500">{t("ManagePurchase.lblAmount")}</div>
                  <div className="text-gray-800 text-right">
                    {row.amount ? Number(row.amount).toLocaleString() : "0.00"} {row.currency}
                  </div>

                  <div className="text-gray-500">{t("ManagePurchase.lblOrderDate")}</div>
                  <div className="text-gray-800 text-right">{row.orderDate || "-"}</div>

                  <div className="text-gray-500">{t("ManagePurchase.lblDeliveryDate")}</div>
                  <div className="text-gray-800 text-right">{row.deliveryDate || "-"}</div>

                  <div className="text-gray-500">{t("ManagePurchase.lblPaymentTerms")}</div>
                  <div className="text-gray-800 text-right truncate" title={row.paymentTerms}>{row.paymentTerms || "-"}</div>

                  <div className="text-gray-500">{t("ManagePurchase.lblShippingMethod")}</div>
                  <div className="text-gray-800 text-right">{row.shippingMethod || "-"}</div>
                </div>

                {row.productDetails && (
                  <div className="mt-3">
                    <div className="text-gray-500 mb-1">{t("ManagePurchase.lblProductDetails")}</div>
                    <div className="text-gray-800 text-[12px] leading-5">{row.productDetails}</div>
                  </div>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-blue-100 flex items-center justify-end gap-3 text-[16px]">
                <button className="text-indigo-700" onClick={() => openModal((page - 1) * PAGE_SIZE + i, true)} aria-label={t("ManagePurchase.view")}>
                  <FiEye />
                </button>
                <button className="text-amber-600" onClick={() => openModal((page - 1) * PAGE_SIZE + i)} aria-label={t("ManagePurchase.edit")}>
                  <FiEdit2 />
                </button>
                <button className="text-red-600" aria-label={t("ManagePurchase.delete")} onClick={() => {}}>
                  <FiXCircle />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">{t("ManagePurchase.noData")}</div>
        )}
      </div>

      {/* Pagination */}
      <div className="sticky bottom-0 sm:static bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 sm:py-0">
        <div className="flex justify-center items-center mt-3 sm:mt-5 gap-3 text-purple-700 flex-wrap">
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            className={`text-xl ${page === 1 ? "opacity-30 cursor-not-allowed" : ""}`}
            aria-label={t("ManagePurchase.prev")}
          >
            «
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1;
            return (
              <button
                key={p}
                onClick={() => goto(p)}
                className={`px-2.5 py-1 rounded border ${p === page ? "border-purple-800 bg-purple-800 text-white" : "border-purple-800"}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => goto(page + 1)}
            disabled={page === totalPages}
            className={`text-xl ${page === totalPages ? "opacity-30 cursor-not-allowed" : ""}`}
            aria-label={t("ManagePurchase.next")}
          >
            »
          </button>
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-auto bg-gray-50/70">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <form onSubmit={(e) => e.preventDefault()} className="relative z-10 w-full max-w-full sm:max-w-5xl bg-white rounded-xl shadow-2xl p-5 sm:p-7 overflow-auto max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-xl">📄</div>
                <h3 className="text-xl sm:text-2xl font-semibold">
                  {viewOnly ? t("ManagePurchase.hView") : editingIndex !== null ? t("ManagePurchase.hEdit") : t("ManagePurchase.hNew")}
                </h3>
              </div>
              <button type="button" onClick={closeModal} className="text-gray-500 text-2xl leading-none hover:text-gray-700" aria-label={t("ManagePurchase.close")}>
                ×
              </button>
            </div>

            {/* Gray card */}
            <div className="rounded-2xl bg-gray-50/80 p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {/* Row 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fPoNoReq")}</label>
                  <input
                    value={form.poNumber}
                    onChange={(e) => handleFormChange("poNumber", e.target.value)}
                    disabled={viewOnly}
                    placeholder="PO-2025-001"
                    className={`w-full rounded-md px-3 py-2 border bg-white ${formErrors.poNumber ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  />
                  {formErrors.poNumber && <p className="text-xs text-red-600 mt-1">{t("ManagePurchase.required")}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fOrderDateReq")}</label>
                  <input
                    type="date"
                    value={form.orderDate}
                    onChange={(e) => handleFormChange("orderDate", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-md px-3 py-2 border bg-white ${formErrors.orderDate ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fSupplierReq")}</label>
                  <input
                    value={form.supplier}
                    onChange={(e) => handleFormChange("supplier", e.target.value)}
                    disabled={viewOnly}
                    placeholder="ABC Trading Co., Ltd."
                    className={`w-full rounded-md px-3 py-2 border bg-white ${formErrors.supplier ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fCountryReq")}</label>
                  <select
                    value={form.importerCountry}
                    onChange={(e) => handleFormChange("importerCountry", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-md px-3 py-2 border bg-white ${formErrors.importerCountry ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  >
                    <option value="">{t("ManagePurchase.optSelectCountry")}</option>
                    <option value="タイ">タイ</option>
                    <option value="米国">米国</option>
                    <option value="英国">英国</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fCategory")}</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-md px-3 py-2 border border-gray-300 bg-white"
                  >
                    <option value="">{t("ManagePurchase.optSelectCategory")}</option>
                    <option value="一般商品">一般商品</option>
                    <option value="電子機器">電子機器</option>
                    <option value="部品">部品</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fCurrencyReq")}</label>
                  <select
                    value={form.currency}
                    onChange={(e) => handleFormChange("currency", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-md px-3 py-2 border bg-white ${formErrors.currency ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  >
                    <option value="THB">THB</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fAmount")}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
                    <input
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => handleFormChange("amount", e.target.value)}
                      disabled={viewOnly}
                      placeholder="0.00"
                      className={`w-full rounded-md pl-7 pr-3 py-2 border bg-white ${formErrors.amount ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    />
                  </div>
                  {formErrors.amount && <p className="text-xs text-red-600 mt-1">{formErrors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fDeliveryDate")}</label>
                  <input
                    type="date"
                    value={form.deliveryDate}
                    onChange={(e) => handleFormChange("deliveryDate", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-md px-3 py-2 border border-gray-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fPaymentTermsReq")}</label>
                  <select
                    value={form.paymentTerms}
                    onChange={(e) => handleFormChange("paymentTerms", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-md px-3 py-2 border bg-white ${formErrors.paymentTerms ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  >
                    <option value="">{t("ManagePurchase.optSelectPayment")}</option>
                    <option value="代金引換">代金引換</option>
                    <option value="30日後払い">30日後払い</option>
                    <option value="銀行振込">銀行振込</option>
                    <option value="信用状">信用状</option>
                  </select>
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fShippingMethodReq")}</label>
                  <select
                    value={form.shippingMethod}
                    onChange={(e) => handleFormChange("shippingMethod", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-md px-3 py-2 border bg-white ${formErrors.shippingMethod ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  >
                    <option value="">{t("ManagePurchase.optSelectShipping")}</option>
                    <option value="船便">船便</option>
                    <option value="航空便">航空便</option>
                    <option value="宅配便">宅配便</option>
                    <option value="陸送">陸送</option>
                  </select>
                </div>

                {/* Product details */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fProductDetails")}</label>
                  <textarea
                    value={form.productDetails}
                    onChange={(e) => handleFormChange("productDetails", e.target.value)}
                    disabled={viewOnly}
                    placeholder={t("ManagePurchase.phProductDetails")}
                    className="w-full rounded-md px-3 py-2 min-h-[110px] border border-gray-300 bg-white"
                  />
                </div>

                {/* Attachments */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-800 mb-1">{t("ManagePurchase.fAttachments")}</label>
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center text-lg">📎</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{t("ManagePurchase.attachHint")}</div>
                      <div className="text-xs text-gray-500">{t("ManagePurchase.attachLimit")}</div>
                    </div>
                    <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border ${viewOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                      <span>{t("ManagePurchase.btnUpload")}</span>
                      <input type="file" hidden multiple disabled={viewOnly} onChange={handleAddAttachments} />
                    </label>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    {form.attachments?.length ? t("ManagePurchase.filesSelected", { count: form.attachments.length }) : t("ManagePurchase.noFiles")}
                  </div>

                  {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                      {previews.map((p, idx) => {
                        const { label, bg } = fileKindIcon(p.type || `.${p.ext || ""}`);
                        return (
                          <div key={idx} className="border rounded-md overflow-hidden bg-white relative">
                            {!viewOnly && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAttachment(p.fileIndex)}
                                className="absolute top-1 right-1 bg-white/90 hover:bg-white text-red-600 rounded-full p-1 shadow focus:outline-none"
                                aria-label={t("ManagePurchase.delete")}
                                title={t("ManagePurchase.delete")}
                              >
                                <FiXCircle className="w-4 h-4" />
                              </button>
                            )}

                            {p.isImage && p.url ? (
                              <div className="w-full h-28 overflow-hidden flex items-center justify-center bg-gray-100">
                                <img src={p.url} alt={p.name} className="object-cover w-full h-full" />
                              </div>
                            ) : (
                              <div className="w-full h-28 flex items-center justify-center bg-gray-100">
                                <div className="flex flex-col items-center">
                                  <div className={`w-12 h-14 ${bg} text-white rounded-md flex items-center justify-center text-xs font-semibold`}>{label}</div>
                                  <div className="mt-1 text-[10px] text-gray-600 uppercase">{p.ext || "file"}</div>
                                </div>
                              </div>
                            )}

                            <div className="px-2 py-2 text-xs text-gray-700 truncate">
                              <div className="truncate" title={p.name}>{p.name}</div>
                              <div className="text-gray-500">{formatBytes(p.size)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Status + right-side action buttons */}
                <div className="sm:col-span-3 flex items-center justify-between mt-1">
                  <StatusBadge status={form.status} />

                  {editingIndex !== null && !viewOnly && (
                    <div className="flex items-center gap-3">
                      {form.status !== STATUS.REVIEW && (
                        <button type="button" onClick={() => quickSetStatus(STATUS.REVIEW)} className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 border border-indigo-700 ">
                          {t("ManagePurchase.toReview")}
                        </button>
                      )}
                      {form.status === STATUS.REVIEW && (
                        <button type="button" onClick={() => quickSetStatus(STATUS.APPROVED)} className="px-3 py-1.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                          {t("ManagePurchase.toApproved")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            {!viewOnly && (
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => askConfirm("draft")} className="px-4 py-2 rounded-md bg-white border">
                  {t("ManagePurchase.saveDraft")}
                </button>

                <button type="button" onClick={() => askConfirm("submit")} className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  {t("ManagePurchase.save")}
                </button>

                <button type="button" onClick={() => setForm({ ...emptyForm, attachments: [] })} className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white">
                  {t("ManagePurchase.clear")}
                </button>

                {/* แสดงปุ่ม PDF เฉพาะโหมด Add */}
                {editingIndex === null && (
                  <button
                    type="button"
                    onClick={() => { console.log("Export to PDF (ADD)", { form }); }}
                    className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
                  >
                    <FiFileText className="w-4 h-4" />
                    {t("ManagePurchase.pdf")}
                  </button>
                )}
              </div>
            )}

            {/* View-only footer */}
            {viewOnly && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => { console.log("Export to PDF (VIEW)", { form }); }}
                  className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
                >
                  <FiFileText className="w-4 h-4" />
                  {t("ManagePurchase.pdf")}
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
            <p className="text-center text-sm mb-4">
              {confirmMode === "submit" ? t("ManagePurchase.confirmSubmit") : t("ManagePurchase.confirmDraft")}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 rounded border">
                {t("ManagePurchase.cancel")}
              </button>
              <button onClick={handleConfirmSave} className="px-4 py-2 rounded bg-blue-500 text-white">
                {t("ManagePurchase.ok")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 w-48 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg animate-bounce mb-2">✔</div>
            <p className="text-center font-semibold">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePurchase;
