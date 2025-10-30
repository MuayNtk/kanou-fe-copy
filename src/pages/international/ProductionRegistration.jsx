// src/pages/international/ProductionRegistration.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  FiEye,
  FiEdit2,
  FiXCircle,
  FiPlus,
  FiFile,
  FiFileText,
  FiImage,
  FiArchive,
} from "react-icons/fi";
import { FaHourglassHalf, FaCheckCircle } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

/* ---------- Status helpers ---------- */
const STATUS = {
  DRAFT: "下書き",
  REVIEW: "レビュー中",
  APPROVED: "承認済み",
};

function normalizeStatus(s) {
  if (!s) return STATUS.REVIEW;
  if (s === "Pending Review") return STATUS.REVIEW;
  if (s === "Draft") return STATUS.DRAFT;
  if (s === "Approved") return STATUS.APPROVED;
  return s;
}

function StatusBadge({ status = STATUS.REVIEW, size = "md" }) {
  const { t } = useTranslation();
  const normalized = normalizeStatus(status);
  const sizes = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-[12px]";
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

  // แสดงสถานะตามภาษา โดยแมปทั้งค่าญี่ปุ่น/อังกฤษให้ไปคีย์เดียว
  const displayStatus =
    {
      Draft: t("ProductionRegistration.status.DRAFT"),
      下書き: t("ProductionRegistration.status.DRAFT"),
      "Under Review": t("ProductionRegistration.status.REVIEW"),
      レビュー中: t("ProductionRegistration.status.REVIEW"),
      Approved: t("ProductionRegistration.status.APPROVED"),
      承認済み: t("ProductionRegistration.status.APPROVED"),
    }[normalized] || normalized;

  return (
    <span className={`inline-flex items-center rounded-full font-sm ${sizes} ${cls}`}>
      <Icon className="mr-1.5" />
      {t("ProductionRegistration.statusPrefix")}
      {displayStatus}
    </span>
  );
}

/* ---------- Demo data ---------- */
const initialRows = [
  {
    serial: "PR-2505-001",
    productId: "001",
    productName: "製品A",
    productBrandModel: "ブランドA モデルA",
    productModelId: "001",
    fabricationYear: "2023",
    purchaseDate: "2025-04-30",
    lot: "L-001",
    date: "2025-04-30",
    status: "Pending Review",
    coordinatorFirstName: "John",
    coordinatorLastName: "Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    street: "123 Main St",
    city: "Bangkok",
    state: "Bangkok",
    postal: "10110",
    country: "Thailand",
    attachments: [],
  },
  {
    serial: "PR-2505-002",
    productId: "002",
    productName: "製品B",
    productBrandModel: "ブランドB モデルB",
    productModelId: "002",
    fabricationYear: "2024",
    purchaseDate: "2025-05-01",
    lot: "L-002",
    date: "2025-05-01",
    status: "Approved",
    coordinatorFirstName: "Alice",
    coordinatorLastName: "Smith",
    email: "alice@example.com",
    phone: "234-567-8901",
    street: "456 Second St",
    city: "Bangkok",
    state: "Bangkok",
    postal: "10120",
    country: "Thailand",
    attachments: [],
  },
  {
    serial: "PR-2505-007",
    productId: "007",
    productName: "製品G",
    productBrandModel: "ブランドG モデルG",
    productModelId: "007",
    fabricationYear: "2025",
    purchaseDate: "2025-05-06",
    lot: "L-007",
    date: "2025-05-06",
    status: "Draft",
    coordinatorFirstName: "Fiona",
    coordinatorLastName: "Taylor",
    email: "fiona@example.com",
    phone: "789-012-3456",
    street: "404 Seventh St",
    city: "Bangkok",
    state: "Bangkok",
    postal: "10170",
    country: "Thailand",
    attachments: [],
  },
];

function generateSerial(index) {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `PR-${yy}${mm}-${String(index).padStart(3, "0")}`;
}

const emptyForm = {
  coordinatorFirstName: "",
  coordinatorLastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postal: "",
  country: "",
  serial: "",
  productName: "",
  productBrandModel: "",
  productModelId: "",
  fabricationYear: "",
  purchaseDate: "",
  lot: "",
  status: STATUS.REVIEW,
  attachments: [],
};

export default function ProductionRegistration() {
  const { t } = useTranslation();

  const [rows, setRows] = useState(
    initialRows.map((r) => ({ ...r, status: normalizeStatus(r.status) }))
  );
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;

  /* ---------- search & pagination ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.serial,
        r.productId,
        r.productName,
        r.productBrandModel,
        r.productModelId,
        r.lot,
        r.date,
        r.status,
      ]
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
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  /* quick status buttons (respect transition rule) */
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

  /* confirm & success */
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [confirmMode, setConfirmMode] = useState("submit"); // 'submit' | 'draft'
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* ---------- attachments: preview (image or file icon) ---------- */
  const [previews, setPreviews] = useState([]); // [{kind:'image'|'file', url?, ext, name, size, fileIndex}]
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
        ? {
            kind: "image",
            url: URL.createObjectURL(f),
            name: f.name,
            size: f.size,
            ext: extOf(f.name),
            fileIndex: idx,
          }
        : {
            kind: "file",
            name: f?.name || `file-${idx + 1}`,
            size: f?.size ?? 0,
            ext: extOf(f?.name || ""),
            fileIndex: idx,
          };
    });
    setPreviews(next);
    return () => next.forEach((p) => p.kind === "image" && p.url && URL.revokeObjectURL(p.url));
  }, [form.attachments]);

  const handleAddAttachments = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setForm((prev) => ({
      ...prev,
      attachments: [
        ...(Array.isArray(prev.attachments) ? prev.attachments : []),
        ...files,
      ],
    }));
    e.target.value = "";
  };

  const handleRemoveAttachment = (fileIndex) => {
    setForm((s) => ({
      ...s,
      attachments: (Array.isArray(s.attachments) ? s.attachments : []).filter(
        (_, i) => i !== fileIndex
      ),
    }));
  };

  /* ---------- modal open/close ---------- */
  const openModal = (index = null, view = false) => {
    if (index !== null) {
      setForm({ ...rows[index] });
      setEditingIndex(index);
    } else {
      setForm({ ...emptyForm }); // new defaults to REVIEW
      setEditingIndex(null);
    }
    setFormErrors({});
    setViewOnly(view);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  /* ---------- form helpers ---------- */
  const handleFormChange = (key, value) => {
    const nextVal = key === "status" ? normalizeStatus(value) : value;
    setForm((s) => ({ ...s, [key]: nextVal }));
    setFormErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateForm = () => {
    const required = [
      "serial",
      "coordinatorFirstName",
      "coordinatorLastName",
      "email",
      "phone",
      "street",
      "city",
      "state",
      "postal",
      "country",
      "productName",
      "productBrandModel",
      "productModelId",
      "fabricationYear",
      "purchaseDate",
    ];
    const errors = {};
    required.forEach((f) => {
      if (!String(form[f] ?? "").trim()) errors[f] = "必須";
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ---------- save handlers ---------- */
  const handleSaveDraftClick = () => {
    setForm((s) => ({ ...s, status: STATUS.DRAFT }));
    setPendingAction(editingIndex !== null ? "edit" : "add");
    setConfirmMode("draft");
    setShowConfirmModal(true);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setPendingAction(editingIndex !== null ? "edit" : "add");
    setConfirmMode("submit");
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    const payload =
      confirmMode === "draft"
        ? { ...form, status: STATUS.DRAFT }
        : { ...form, status: normalizeStatus(form.status) };

    if (pendingAction === "edit") {
      setRows((r) => {
        const next = [...r];
        next[editingIndex] = payload;
        return next;
      });
      setSuccessMessage(t("ProductionRegistration.toast.updated"));
    } else if (pendingAction === "add") {
      const nextIndex = rows.length + 1;
      const newRow = {
        ...payload,
        serial: payload.serial || generateSerial(nextIndex),
        productId: String(nextIndex).padStart(3, "0"),
        lot: payload.lot || `L-${String(nextIndex).padStart(3, "0")}`,
        date: payload.purchaseDate,
      };
      setRows((r) => [newRow, ...r]);
      setPage(1);
      setSuccessMessage(
        confirmMode === "draft"
          ? t("ProductionRegistration.toast.draftSaved")
          : t("ProductionRegistration.toast.created")
      );
    }
    setShowConfirmModal(false);
    setShowModal(false);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 1000);
  };

  const handleCancelSave = () => setShowConfirmModal(false);

  const handleClearSearch = () => {
    setInput("");
    setQuery("");
    setPage(1);
  };

  /* ---------- render ---------- */
  return (
    <div className="text-[13px]">
      <PageHeader title={t("ProductionRegistration.pageTitle")} />

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-5 mb-4 gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("ProductionRegistration.searchPlaceholder")}
            className="flex-1 rounded-md border border-blue-200 bg-gray-50 px-3 py-2 outline-none min-w-0"
          />
          <button
            onClick={() => {
              setQuery(input);
              setPage(1);
            }}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-blue-500 text-white"
            title={t("ProductionRegistration.search")}
          >
            🔍
          </button>
          <button
            onClick={handleClearSearch}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-yellow-400 text-white"
            title={t("ProductionRegistration.clear")}
          >
            ✖
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded w-full sm:w-auto justify-center"
          >
            <FiPlus /> {t("ProductionRegistration.addButton")}
          </button>
        </div>
      </div>

      <div className="border-t-2 border-blue-200" />

      {/* TABLE (≥ sm) */}
      <div className="mt-3 w-full rounded-lg overflow-x-auto hidden sm:block">
        <table className="w-full table-auto border-collapse text-[12px]">
          <thead>
            <tr className="text-left text-blue-900 whitespace-nowrap">
              <th className="p-2 border-b-2 border-blue-200 ">{t("ProductionRegistration.th.serial")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("ProductionRegistration.th.productName")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("ProductionRegistration.th.brandModel")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("ProductionRegistration.th.modelId")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("ProductionRegistration.th.year")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("ProductionRegistration.th.purchaseDate")}</th>
              <th className="p-2 border-b-2 border-blue-200">{t("ProductionRegistration.th.status")}</th>
              <th className="p-2 border-b-2 border-blue-200 text-center">{t("ProductionRegistration.th.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length ? (
              pageItems.map((row, i) => (
                <tr key={row.serial + i} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="p-2 border-b border-blue-200 truncate max-w-[120px]">{row.serial}</td>
                  <td className="p-2 border-b border-blue-200 truncate max-w-[180px] text-blue-700">
                    {row.productName}
                  </td>
                  <td className="p-2 border-b border-blue-200 truncate max-w-[220px]">
                    {row.productBrandModel}
                  </td>
                  <td className="p-2 border-b border-blue-200">{row.productModelId}</td>
                  <td className="p-2 border-b border-blue-200">{row.fabricationYear}</td>
                  <td className="p-2 border-b border-blue-200">{row.purchaseDate}</td>
                  <td className="p-2 border-b border-blue-200">
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="p-2 border-b border-blue-200 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button
                        className="text-indigo-700"
                        onClick={() => openModal((page - 1) * PAGE_SIZE + i, true)}
                        aria-label={t("ProductionRegistration.view")}
                        title={t("ProductionRegistration.view")}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-amber-600"
                        onClick={() => openModal((page - 1) * PAGE_SIZE + i)}
                        aria-label={t("ProductionRegistration.edit")}
                        title={t("ProductionRegistration.edit")}
                      >
                        <FiEdit2 />
                      </button>
                      <button className="text-red-600" aria-label={t("ProductionRegistration.delete")} title={t("ProductionRegistration.delete")}>
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  {t("ProductionRegistration.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CARDS (< sm) */}
      <div className="sm:hidden mt-3 grid grid-cols-1 gap-3">
        {pageItems.length ? (
          pageItems.map((row, i) => (
            <div key={row.serial + i} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-lg truncate">{row.productName}</div>
                  <div className="text-sm text-gray-600 truncate">{row.productBrandModel}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {row.serial} ・ {row.purchaseDate}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-indigo-700"
                    onClick={() => openModal((page - 1) * PAGE_SIZE + i, true)}
                    aria-label={t("ProductionRegistration.view")}
                  >
                    <FiEye />
                  </button>
                  <button
                    className="text-amber-600"
                    onClick={() => openModal((page - 1) * PAGE_SIZE + i)}
                    aria-label={t("ProductionRegistration.edit")}
                  >
                    <FiEdit2 />
                  </button>
                  <button className="text-red-600" aria-label={t("ProductionRegistration.delete")}>
                    <FiXCircle />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <div>
                  <strong>{t("ProductionRegistration.label.modelId")}:</strong> {row.productModelId}
                </div>
                <div>
                  <strong>{t("ProductionRegistration.label.year")}:</strong> {row.fabricationYear}
                </div>
                <div className="flex justify-between items-center">
                  <StatusBadge status={row.status} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">{t("ProductionRegistration.noData")}</div>
        )}
      </div>

      {/* Pagination */}
      <div className="sticky bottom-0 sm:static bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 sm:py-0">
        <div className="flex justify-center items-center mt-3 sm:mt-5 gap-3 text-purple-700 flex-wrap">
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            className={`text-xl ${page === 1 ? "opacity-30 cursor-not-allowed" : ""}`}
            aria-label={t("ProductionRegistration.prev")}
          >
            «
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1;
            return (
              <button
                key={p}
                onClick={() => goto(p)}
                className={`px-2.5 py-1 rounded border ${
                  p === page ? "border-purple-800 bg-purple-800 text-white" : "border-purple-800"
                }`}
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
            aria-label={t("ProductionRegistration.next")}
          >
            »
          </button>
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-auto">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <form
            onSubmit={handleSaveClick}
            className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-5 sm:p-7 overflow-auto max-h-[92vh]"
          >
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-xl">🧾</div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{t("ProductionRegistration.modal.title")}</h3>
                  <p className="text-sm text-gray-500">
                    {t("ProductionRegistration.modal.subtitle")}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="rounded-2xl bg-gray-50/80 p-4 sm:p-5">
              {/* Coordinator */}
              <h4 className="text-lg font-semibold mb-2">{t("ProductionRegistration.section.coordinator")}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {[
                  ["coordinatorFirstName", t("ProductionRegistration.field.firstName")],
                  ["coordinatorLastName", t("ProductionRegistration.field.lastName")],
                  ["email", t("ProductionRegistration.field.email")],
                  ["phone", t("ProductionRegistration.field.phone")],
                  ["street", t("ProductionRegistration.field.street")],
                  ["city", t("ProductionRegistration.field.city")],
                  ["state", t("ProductionRegistration.field.state")],
                  ["postal", t("ProductionRegistration.field.postal")],
                  ["country", t("ProductionRegistration.field.country")],
                ].map(([key, label]) => (
                  <div key={key} className={key === "street" ? "sm:col-span-3" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} *
                    </label>
                    <input
                      value={form[key]}
                      onChange={(e) => handleFormChange(key, e.target.value)}
                      disabled={viewOnly}
                      className={`w-full rounded-lg px-3 py-2 border bg-gray-50 ${
                        formErrors[key] ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    {formErrors[key] && <p className="text-xs text-red-600 mt-1">{t("ProductionRegistration.required")}</p>}
                  </div>
                ))}
              </div>

              <hr className="my-5 border-gray-200" />

              {/* Product */}
              <h4 className="text-lg font-semibold mb-3 text-gray-900">{t("ProductionRegistration.section.product")}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("ProductionRegistration.field.serial")} *</label>
                  <input
                    value={form.serial}
                    onChange={(e) => handleFormChange("serial", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border bg-gray-50 ${
                      formErrors.serial ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="PR-2505-001"
                  />
                  {formErrors.serial && <p className="text-xs text-red-600 mt-1">{t("ProductionRegistration.required")}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("ProductionRegistration.field.productName")} *</label>
                  <input
                    value={form.productName}
                    onChange={(e) => handleFormChange("productName", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border bg-gray-50 ${
                      formErrors.productName ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {formErrors.productName && <p className="text-xs text-red-600 mt-1">{t("ProductionRegistration.required")}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("ProductionRegistration.field.modelId")} *</label>
                  <input
                    value={form.productModelId}
                    onChange={(e) => handleFormChange("productModelId", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border bg-gray-50 ${
                      formErrors.productModelId ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {formErrors.productModelId && <p className="text-xs text-red-600 mt-1">{t("ProductionRegistration.required")}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("ProductionRegistration.field.brandModel")} *</label>
                  <input
                    value={form.productBrandModel}
                    onChange={(e) => handleFormChange("productBrandModel", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border bg-gray-50 ${
                      formErrors.productBrandModel ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {formErrors.productBrandModel && <p className="text-xs text-red-600 mt-1">{t("ProductionRegistration.required")}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("ProductionRegistration.field.year")} *</label>
                  <input
                    value={form.fabricationYear}
                    onChange={(e) => handleFormChange("fabricationYear", e.target.value)}
                    disabled={viewOnly}
                    placeholder="2025"
                    className={`w-full rounded-lg px-3 py-2 border bg-gray-50 ${
                      formErrors.fabricationYear ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {formErrors.fabricationYear && <p className="text-xs text-red-600 mt-1">{t("ProductionRegistration.required")}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("ProductionRegistration.field.purchaseDate")} *</label>
                  <input
                    type="date"
                    value={form.purchaseDate}
                    onChange={(e) => handleFormChange("purchaseDate", e.target.value)}
                    disabled={viewOnly}
                    className={`w-full rounded-lg px-3 py-2 border bg-gray-50 ${
                      formErrors.purchaseDate ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {formErrors.purchaseDate && <p className="text-xs text-red-600 mt-1">{t("ProductionRegistration.required")}</p>}
                </div>

                {/* Attachments */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("ProductionRegistration.attach.title")}
                  </label>
                  <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                      📎
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {t("ProductionRegistration.attach.hint")}
                      </div>
                      <div className="text-xs text-gray-500">{t("ProductionRegistration.attach.limit")}</div>
                    </div>
                    <label
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border ${
                        viewOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <span>{t("ProductionRegistration.attach.upload")}</span>
                      <input type="file" hidden multiple disabled={viewOnly} onChange={handleAddAttachments} />
                    </label>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    {form.attachments?.length
                      ? t("ProductionRegistration.attach.selected", { count: form.attachments.length })
                      : t("ProductionRegistration.attach.noFile")}
                  </div>

                  {/* preview grid for both images & files */}
                  {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                      {previews.map((p, idx) => (
                        <div key={idx} className="border rounded-md overflow-hidden bg-white relative">
                          {!viewOnly && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(p.fileIndex)}
                              className="absolute top-1 right-1 bg-white/90 hover:bg-white text-red-600 rounded-full p-1 shadow"
                              aria-label={t("ProductionRegistration.attach.removeFile")}
                              title={t("ProductionRegistration.attach.removeFile")}
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Thumb */}
                          {p.kind === "image" ? (
                            <div className="w-full h-28 overflow-hidden flex items-center justify-center bg-gray-100">
                              <img src={p.url} alt={p.name} className="object-cover w-full h-full" />
                            </div>
                          ) : (
                            <div className="w-full h-28 flex flex-col items-center justify-center bg-gray-50">
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
                              <div className="text-[11px] uppercase tracking-wide text-gray-600">
                                {p.ext || "FILE"}
                              </div>
                            </div>
                          )}

                          {/* meta */}
                          <div className="px-2 py-2 text-[11px] text-gray-700 truncate">
                            <div className="truncate" title={p.name}>
                              {p.name}
                            </div>
                            <div className="text-gray-500">{formatBytes(p.size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status + quick actions with rules */}
                <div className="sm:col-span-3 flex items-center justify-between mt-1">
                  <StatusBadge status={form.status} />
                  {editingIndex !== null && !viewOnly && (
                    <div className="flex items-center gap-3">
                      {normalizeStatus(form.status) === STATUS.DRAFT && (
                        <button
                          type="button"
                          onClick={() => quickSetStatus(STATUS.REVIEW)}
                          className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 border border-indigo-700"
                        >
                          {t("ProductionRegistration.action.toReview")}
                        </button>
                      )}
                      {normalizeStatus(form.status) === STATUS.REVIEW && (
                        <button
                          type="button"
                          onClick={() => quickSetStatus(STATUS.APPROVED)}
                          className="px-3 py-1.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                        >
                          {t("ProductionRegistration.action.toApproved")}
                        </button>
                      )}
                      {normalizeStatus(form.status) === STATUS.APPROVED && (
                        <button
                          type="button"
                          onClick={() => quickSetStatus(STATUS.REVIEW)}
                          className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 border border-indigo-700"
                        >
                          {t("ProductionRegistration.action.backToReview")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              {!viewOnly && (
                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                  {/* Save Draft */}
                  <button
                    type="button"
                    onClick={handleSaveDraftClick}
                    className="px-5 py-2 rounded-[12px] border border-gray-400 bg-white text-gray-800 hover:bg-gray-50 shadow-sm"
                  >
                    {t("ProductionRegistration.btn.saveDraft")}
                  </button>

                  {/* Save */}
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="px-6 py-2 rounded-[12px] bg-[#4F3DFE] hover:bg-[#4636f2] text-white font-semibold shadow-md"
                  >
                    {t("ProductionRegistration.btn.save")}
                  </button>

                  {/* Clear */}
                  <button
                    type="button"
                    onClick={() => setForm({ ...emptyForm, attachments: [] })}
                    className="px-5 py-2 rounded-[12px] bg-[#FF6A00] hover:bg-[#ff6a00]/90 text-white shadow-sm"
                  >
                    {t("ProductionRegistration.btn.clear")}
                  </button>

                  {/* PDF button only when ADD */}
                  {editingIndex === null && (
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Export to PDF (ADD)", { form });
                      }}
                      className="px-6 py-2 rounded-[12px] bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md flex items-center gap-2"
                    >
                      <FiFileText className="w-4 h-4" />
                      PDF
                    </button>
                  )}
                </div>
              )}

              {/* PDF button for VIEW ONLY */}
              {viewOnly && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Export to PDF (VIEW)", { form });
                    }}
                    className="px-6 py-2 rounded-[12px] bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md flex items-center gap-2"
                  >
                    <FiFileText className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              )}
            </div>

            {/* Close (X) */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl leading-none"
              aria-label={t("ProductionRegistration.close")}
            >
              ×
            </button>
          </form>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
            <p className="text-center text-lg mb-4">
              {confirmMode === "draft"
                ? t("ProductionRegistration.confirm.saveDraft")
                : t("ProductionRegistration.confirm.saveExport")}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={handleCancelSave} className="px-4 py-2 rounded border">
                {t("ProductionRegistration.cancel")}
              </button>
              <button onClick={handleConfirmSave} className="px-4 py-2 rounded bg-blue-500 text-white">
                {t("ProductionRegistration.ok")}
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
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg animate-bounce mb-2">
              ✔
            </div>
            <p className="text-center font-semibold">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
