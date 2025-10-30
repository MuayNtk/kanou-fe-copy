// src/pages/international/IntlSales.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  FiEye, FiEdit2, FiXCircle, FiPlus, FiFile, FiFileText, FiImage, FiArchive,
} from "react-icons/fi";
import { FaHourglassHalf, FaCheckCircle } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

/* ---------- Status helpers ---------- */
const STATUS = {
  DRAFT: "Draft",
  REVIEW: "Under Review",
  APPROVED: "Approved",
};

function normalizeStatus(s) {
  if (!s) return STATUS.REVIEW;
  if (s === "Pending Review") return STATUS.REVIEW; // backward compat
  return s;
}

function StatusBadge({ status = STATUS.REVIEW, size = "sm" }) {
  const { t } = useTranslation();

  const normalized = normalizeStatus(status);
  const sizes = size === "sm" ? "px-2 py-0.5 text-[12px]" : "px-3 py-1 text-sm";
  let cls = "bg-gray-100 text-gray-800 border border-gray-200";
  let Icon = FaHourglassHalf;

  if (normalized === STATUS.DRAFT) {
    cls = "bg-orange-100 text-orange-800 border border-orange-200";
  } else if (normalized === STATUS.REVIEW) {
    cls = "bg-indigo-100 text-indigo-800 border border-indigo-200";
  } else if (normalized === STATUS.APPROVED) {
    cls = "bg-emerald-100 text-emerald-800 border border-emerald-200";
    Icon = FaCheckCircle;
  }

  // แปลงค่า status ให้เป็นภาษาญี่ปุ่น (โชว์อย่างเดียว)
  const displayStatus = {
    [STATUS.DRAFT]: t("IntlSales.status.DRAFT"),
    [STATUS.REVIEW]: t("IntlSales.status.REVIEW"),
    [STATUS.APPROVED]: t("IntlSales.status.APPROVED"),
  }[normalized] || normalized;

  return (
    <span className={`inline-flex items-center rounded-full font-sm ${sizes} ${cls}`}>
      <Icon className="mr-1.5" />
      {t("IntlSales.statusPrefix")}{displayStatus}
    </span>
  );
}

/* ---------- Demo data ---------- */
const initialRows = [
  {
    soNumber: "SO-2025-001",
    soDate: "2025-09-25",
    customer: "XYZ International Ltd.",
    countryType: "Asia",
    productType: "General",
    currency: "THB",
    saleValue: "0.00",
    shipDate: "",
    incoterms: "FOB (Free on Board)",
    originPort: "Laem Chabang",
    destinationPort: "Los Angeles",
    exportPermit: "EXP-2025-001",
    details: "—",
    status: "Approved",
    attachments: [],
  },
  {
    soNumber: "SO-2025-002",
    soDate: "2025-05-01",
    customer: "Global Tech",
    countryType: "USA",
    productType: "Electronics",
    currency: "USD",
    saleValue: "12500.00",
    shipDate: "2025-06-10",
    incoterms: "CIF (Cost, Insurance & Freight)",
    originPort: "Laem Chabang",
    destinationPort: "Seattle",
    exportPermit: "EXP-2025-002",
    details: "Laptop model X, 50 units",
    status: "Under Review",
    attachments: [],
  },
  {
    soNumber: "SO-2025-003",
    soDate: "2025-05-06",
    customer: "Innovate Ltd.",
    countryType: "UK",
    productType: "Components",
    currency: "GBP",
    saleValue: "980.50",
    shipDate: "",
    incoterms: "EXW (Ex Works)",
    originPort: "Khlong Toei",
    destinationPort: "London",
    exportPermit: "EXP-2025-003",
    details: "Assorted parts",
    status: "Approved",
    attachments: [],
  },
];

function IntlSales() {
  const { t } = useTranslation();

  const [rows, setRows] = useState(initialRows.map((r) => ({ ...r, status: normalizeStatus(r.status) })));
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.soNumber, r.customer, r.countryType, r.productType, r.currency,
        r.incoterms, r.originPort, r.destinationPort, r.exportPermit, r.details, r.status,
      ].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const startIdx = (page - 1) * PAGE_SIZE;
    return filtered.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filtered, page]);

  const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  // ===== Modal state =====
  const [showModal, setShowModal] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // ===== Form =====
  const emptyForm = {
    soNumber: "SO-2025-001",
    soDate: "2025-09-25",
    customer: "XYZ International Ltd.",
    countryType: "",
    productType: "",
    currency: "THB",
    saleValue: "",
    shipDate: "",
    incoterms: "FOB (Free on Board)",
    originPort: "Laem Chabang",
    destinationPort: "",
    exportPermit: "EXP-2025-001",
    details: "",
    status: STATUS.REVIEW,
    attachments: [],
  };
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  // ===== Attachments preview =====
  const [previews, setPreviews] = useState([]);
  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };
  const extOf = (name = "") => (name.includes(".") ? name.split(".").pop().toLowerCase() : "");

  useEffect(() => {
    const files = Array.isArray(form.attachments) ? form.attachments : [];
    const next = files.map((f, idx) => {
      const isImg = f && typeof f.type === "string" && f.type.startsWith("image/");
      return isImg
        ? { kind: "image", url: URL.createObjectURL(f), name: f.name, size: f.size, ext: extOf(f.name), fileIndex: idx }
        : { kind: "file", name: f?.name || `file-${idx + 1}`, size: f?.size ?? 0, ext: extOf(f?.name || ""), fileIndex: idx };
    });
    setPreviews(next);
    return () => next.forEach((p) => p.kind === "image" && p.url && URL.revokeObjectURL(p.url));
  }, [form.attachments]);

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

  const handleFormChange = (key, value) => {
    const nextVal = key === "status" ? normalizeStatus(value) : value;
    setForm((s) => ({ ...s, [key]: nextVal }));
    setFormErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateForm = () => {
    const errs = {};
    if (!form.soNumber?.trim()) errs.soNumber = t("InternationalSales.errSoNumber");
    if (!form.soDate?.trim()) errs.soDate = t("InternationalSales.errSoDate");
    if (!form.customer?.trim()) errs.customer = t("InternationalSales.errCustomer");
    if (!form.currency?.trim()) errs.currency = t("InternationalSales.errCurrency");
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===== Confirm / Success =====
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMode, setConfirmMode] = useState("submit"); // 'draft' | 'submit'
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const askConfirm = (mode) => {
    if (!validateForm()) return;
    setConfirmMode(mode);
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    let nextStatus;
    if (confirmMode === "draft") {
      nextStatus = STATUS.DRAFT;
    } else {
      nextStatus = editingIndex !== null ? normalizeStatus(form.status) : STATUS.APPROVED;
    }

    const payload = { ...form, status: nextStatus };

    if (editingIndex !== null) {
      setRows((r) => {
        const x = [...r];
        x[editingIndex] = payload;
        return x;
      });
      setSuccessMessage(confirmMode === "draft" ? t("InternationalSales.savedAsDraft") : t("InternationalSales.saved"));
    } else {
      setRows((r) => [payload, ...r]);
      setPage(1);
      setSuccessMessage(confirmMode === "draft" ? t("InternationalSales.savedAsDraft") : t("InternationalSales.savedAndExported"));
    }

    setShowConfirmModal(false);
    setShowModal(false);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 1000);
  };

  const handleClearSearch = () => {
    setInput("");
    setQuery("");
    setPage(1);
  };

  return (
    <div className="text-xs sm:text-sm">
      <PageHeader title={t("InternationalSales.title")} />

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-5 mb-4 gap-3">
        <div className="flex items-center gap-2 flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("InternationalSales.searchPlaceholder")}
            className="flex-1 rounded-md border border-blue-200 px-3 py-2 outline-none min-w-0"
          />
          <button
            onClick={() => {
              setQuery(input);
              setPage(1);
            }}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-blue-500 text-white"
            title={t("InternationalSales.search")}
          >
            🔍
          </button>
          <button
            onClick={handleClearSearch}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-yellow-400 text-white"
            title={t("InternationalSales.clear")}
          >
            ✖
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-3 py-2 rounded w-full sm:w-auto justify-center"
          >
            <FiPlus /> {t("InternationalSales.addNew")}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-blue-200" />

      {/* Table (desktop / tablet) */}
      <div className="mt-2 w-full overflow-x-auto rounded-lg text-[10px] sm:text-[11px] hidden md:block">
        <table className="min-w-[980px] border-collapse">
          <thead>
            <tr className="text-blue-900 whitespace-nowrap">
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colSoNumber")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colCustomer")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colCountry")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colProductType")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colCurrency")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colSaleValue")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colSoDate")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colShipDate")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colIncoterms")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colOriginPort")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colDestinationPort")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colExportPermit")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-start">{t("InternationalSales.colStatus")}</th>
              <th className="p-1.5 sm:p-2 border-b-2 border-blue-200 text-center">{t("InternationalSales.colActions")}</th>
            </tr>
          </thead>

          <tbody className="text-[11px] sm:text-[12px]">
            {pageItems.length ? (
              pageItems.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.soNumber}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.customer}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.countryType || "-"}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.productType || "-"}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.currency}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">
                    {row.saleValue ? Number(row.saleValue).toLocaleString() : "0.00"}
                  </td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.soDate || "-"}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.shipDate || "-"}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.incoterms || "-"}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.originPort || "-"}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.destinationPort || "-"}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">{row.exportPermit || "-"}</td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200">
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="p-1.5 sm:p-2 border-b border-blue-200 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5 text-[12px] sm:text-[13px]">
                      <button
                        className="text-indigo-700"
                        onClick={() => openModal((page - 1) * PAGE_SIZE + i, true)}
                        aria-label={t("InternationalSales.view")}
                        title={t("InternationalSales.view")}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-amber-600"
                        onClick={() => openModal((page - 1) * PAGE_SIZE + i)}
                        aria-label={t("InternationalSales.edit")}
                        title={t("InternationalSales.edit")}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="text-red-600"
                        aria-label={t("InternationalSales.delete")}
                        title={t("InternationalSales.delete")}
                        onClick={() => {}}
                      >
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14} className="text-center py-4 text-gray-500">
                  {t("InternationalSales.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="mt-3 space-y-3 md:hidden">
        {pageItems.length ? (
          pageItems.map((row, i) => (
            <div key={i} className="bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="font-semibold text-base">{row.soNumber}</div>
                  <div className="text-xs text-gray-600">
                    {row.customer} • {row.countryType || "-"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-indigo-700" onClick={() => openModal((page - 1) * PAGE_SIZE + i, true)} aria-label={t("InternationalSales.view")}>
                    <FiEye />
                  </button>
                  <button className="text-amber-600" onClick={() => openModal((page - 1) * PAGE_SIZE + i)} aria-label={t("InternationalSales.edit")}>
                    <FiEdit2 />
                  </button>
                  <button className="text-red-600" aria-label={t("InternationalSales.delete")} onClick={() => {}}>
                    <FiXCircle />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-700 space-y-1">
                <div>
                  <strong>{t("InternationalSales.labelSaleValue")} </strong>
                  {row.saleValue || "0.00"} {row.currency}
                </div>
                <div>
                  <strong>{t("InternationalSales.labelIncoterms")} </strong>
                  {row.incoterms || "-"}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{t("InternationalSales.labelShip")} </strong>
                    {row.shipDate || "-"}
                  </div>
                  <div className="text-gray-500">{row.soDate || "-"}</div>
                </div>
                <div className="pt-1">
                  <StatusBadge status={row.status} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">{t("InternationalSales.noData")}</div>
        )}
      </div>

      {/* Pagination */}
      <div className="sticky bottom-0 sm:static bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 sm:py-0">
        <div className="flex justify-center items-center mt-3 sm:mt-5 gap-3 text-purple-700 flex-wrap">
          <button onClick={() => goto(page - 1)} disabled={page === 1} className={`text-xl ${page === 1 ? "opacity-30 cursor-not-allowed" : ""}`} aria-label={t("InternationalSales.prev")}>
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
          <button onClick={() => goto(page + 1)} disabled={page === totalPages} className={`text-xl ${page === totalPages ? "opacity-30 cursor-not-allowed" : ""}`} aria-label={t("InternationalSales.next")}>
            »
          </button>
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-5 overflow-auto">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <form onSubmit={(e) => e.preventDefault()} className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6 overflow-auto max-h-[92vh]">
            {/* Header */}
            <div className="mb-4 sm:mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-lg">🌍</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{t("InternationalSales.modalTitle")}</h3>
                  <p className="text-xs text-gray-500">{t("InternationalSales.modalSubtitle")}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="rounded-2xl bg-gray-50/70 p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Row 1 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fSoNumber")}
                  </label>
                  <input
                    value={form.soNumber}
                    onChange={(e) => handleFormChange("soNumber", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border ${formErrors.soNumber ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    placeholder={t("InternationalSales.phSoNumber")}
                  />
                  {formErrors.soNumber && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.soNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fSoDateRequired")}
                  </label>
                  <input
                    type="date"
                    value={form.soDate}
                    onChange={(e) => handleFormChange("soDate", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border ${formErrors.soDate ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fCustomerRequired")}
                  </label>
                  <input
                    value={form.customer}
                    onChange={(e) => handleFormChange("customer", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border ${formErrors.customer ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    placeholder="XYZ International Ltd."
                  />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fCountryRequired")}
                  </label>
                  <select
                    value={form.countryType}
                    onChange={(e) => handleFormChange("countryType", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border ${formErrors.countryType ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  >
                    <option value="">{t("InternationalSales.optSelectCountry")}</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fProductType")}
                  </label>
                  <select
                    value={form.productType}
                    onChange={(e) => handleFormChange("productType", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-lg px-3 py-2 border border-gray-200"
                  >
                    <option value="">{t("InternationalSales.optSelectType")}</option>
                    <option value="General">General</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Components">Components</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fCurrencyRequired")}
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => handleFormChange("currency", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border ${formErrors.currency ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  >
                    <option value="THB">THB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fSaleValue")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
                    <input
                      type="number"
                      step="0.01"
                      value={form.saleValue}
                      onChange={(e) => handleFormChange("saleValue", e.target.value)}
                      disabled={viewOnly}
                      className="w-full rounded-lg pl-7 pr-3 py-2 border border-gray-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fShipDate")}
                  </label>
                  <input
                    type="date"
                    value={form.shipDate}
                    onChange={(e) => handleFormChange("shipDate", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-lg px-3 py-2 border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fIncoterms")}
                  </label>
                  <select
                    value={form.incoterms}
                    onChange={(e) => handleFormChange("incoterms", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-lg px-3 py-2 border border-gray-200"
                  >
                    <option>FOB (Free on Board)</option>
                    <option>CIF (Cost, Insurance & Freight)</option>
                    <option>EXW (Ex Works)</option>
                    <option>DAP (Delivered At Place)</option>
                  </select>
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fOriginPort")}
                  </label>
                  <select
                    value={form.originPort}
                    onChange={(e) => handleFormChange("originPort", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-lg px-3 py-2 border border-gray-200"
                  >
                    <option value="Laem Chabang">Laem Chabang</option>
                    <option value="Khlong Toei">Khlong Toei</option>
                    <option value="Songkhla">Songkhla</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fDestinationPort")}
                  </label>
                  <input
                    value={form.destinationPort}
                    onChange={(e) => handleFormChange("destinationPort", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-lg px-3 py-2 border border-gray-200"
                    placeholder={t("InternationalSales.phDestinationPort")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fExportPermit")}
                  </label>
                  <input
                    value={form.exportPermit}
                    onChange={(e) => handleFormChange("exportPermit", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-lg px-3 py-2 border border-gray-200"
                    placeholder="EXP-2025-001"
                  />
                </div>

                {/* Details */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("InternationalSales.fDetails")}
                  </label>
                  <textarea
                    value={form.details}
                    onChange={(e) => handleFormChange("details", e.target.value)}
                    disabled={viewOnly}
                    className="w-full rounded-lg px-3 py-2 min-h-[110px] border border-gray-200"
                    placeholder={t("InternationalSales.phDetails")}
                  />
                </div>

                {/* Attachments + preview */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t("InternationalSales.fAttachments")}</label>
                  <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-base">📎</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{t("InternationalSales.attachHint")}</div>
                      <div className="text-[11px] text-gray-500">{t("InternationalSales.attachLimit")}</div>
                    </div>
                    <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border ${viewOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                      <span>{t("InternationalSales.btnUpload")}</span>
                      <input type="file" hidden multiple disabled={viewOnly} onChange={handleAddAttachments} />
                    </label>
                  </div>

                  <div className="mt-2 text-xs text-gray-600">
                    {form.attachments?.length
                      ? t("InternationalSales.filesSelected", { count: form.attachments.length })
                      : t("InternationalSales.noFiles")}
                  </div>

                  {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                      {previews.map((p, idx) => (
                        <div key={idx} className="border rounded-md overflow-hidden bg-white relative">
                          {!viewOnly && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(p.fileIndex)}
                              className="absolute top-1 right-1 bg-white/90 hover:bg-white text-red-600 rounded-full p-1 shadow"
                              aria-label={t("InternationalSales.removeFile")}
                              title={t("InternationalSales.removeThisFile")}
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          )}

                          {p.kind === "image" ? (
                            <div className="w-full h-24 overflow-hidden flex items-center justify-center bg-gray-100">
                              <img src={p.url} alt={p.name} className="object-cover w-full h-full" />
                            </div>
                          ) : (
                            <div className="w-full h-24 flex flex-col items-center justify-center bg-gray-50">
                              <div className="text-3xl mb-1">
                                {(() => {
                                  const e = p.ext;
                                  if (["pdf"].includes(e)) return <FiFileText />;
                                  if (["doc", "docx"].includes(e)) return <FiFileText />;
                                  if (["xls", "xlsx", "csv"].includes(e)) return <FiFile />;
                                  if (["zip", "rar", "7z"].includes(e)) return <FiArchive />;
                                  if (["jpg", "jpeg", "png", "gif", "webp"].includes(e)) return <FiImage />;
                                  return <FiFile />;
                                })()}
                              </div>
                              <div className="text-[11px] uppercase tracking-wide text-gray-600">{p.ext || "FILE"}</div>
                            </div>
                          )}

                          <div className="px-2 py-2 text-[11px] text-gray-700 truncate">
                            <div className="truncate" title={p.name}>{p.name}</div>
                            <div className="text-gray-500">{formatBytes(p.size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status row + actions */}
                <div className="sm:col-span-3 flex items-center justify-between gap-3">
                  <StatusBadge status={form.status} />
                  {!viewOnly && editingIndex !== null && (
                    <div className="flex items-center gap-3">
                      {form.status === STATUS.DRAFT && (
                        <button
                          type="button"
                          onClick={() => handleFormChange("status", STATUS.REVIEW)}
                          className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 border border-indigo-700"
                        >
                          {t("InternationalSales.moveToReview")}
                        </button>
                      )}
                      {form.status === STATUS.REVIEW && (
                        <button
                          type="button"
                          onClick={() => handleFormChange("status", STATUS.APPROVED)}
                          className="px-3 py-1.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                        >
                          {t("InternationalSales.markApproved")}
                        </button>
                      )}
                      {form.status === STATUS.APPROVED && (
                        <button
                          type="button"
                          onClick={() => handleFormChange("status", STATUS.REVIEW)}
                          className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 border border-indigo-700"
                        >
                          {t("InternationalSales.reopenToReview")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            {!viewOnly && (
              <div className="mt-5 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => askConfirm("draft")}
                  className="px-4 py-2 rounded-md bg-white border"
                >
                  {t("InternationalSales.saveDraft")}
                </button>

                <button
                  type="button"
                  onClick={() => askConfirm("submit")}
                  className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {t("InternationalSales.save")}
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...emptyForm, attachments: [] })}
                  className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {t("InternationalSales.clearForm")}
                </button>

                {editingIndex === null && (
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Export to PDF (ADD)", { form });
                    }}
                    className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
                  >
                    <FiFileText className="w-4 h-4" />
                    {t("InternationalSales.pdf")}
                  </button>
                )}
              </div>
            )}

            {viewOnly && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    console.log("Export to PDF (VIEW)", { form });
                  }}
                  className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
                >
                  <FiFileText className="w-4 h-4" />
                  {t("InternationalSales.pdf")}
                </button>
              </div>
            )}

            {/* Close */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-2.5 right-4 text-gray-500 hover:text-gray-700 text-xl leading-none"
              aria-label={t("InternationalSales.close")}
              title={t("InternationalSales.close")}
            >
              ×
            </button>
          </form>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-lg shadow-lg p-5">
            <p className="text-center text-sm mb-4">
              {confirmMode === "draft"
                ? t("InternationalSales.confirmSaveDraft")
                : t("InternationalSales.confirmSaveExport")}
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 rounded border">
                {t("InternationalSales.cancel")}
              </button>
              <button onClick={handleConfirmSave} className="px-4 py-2 rounded bg-blue-500 text-white">
                {t("InternationalSales.ok")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 w-44 bg-white rounded-lg shadow-lg p-5 flex flex-col items-center">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg animate-bounce mb-2">✔</div>
            <p className="text-center font-semibold text-xs">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default IntlSales;
