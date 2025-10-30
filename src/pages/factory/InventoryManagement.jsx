// src/pages/factory/InventoryManagement.jsx
import React, { useMemo, useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiX,
  FiFileText,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

/* ---------------- Mock data ---------------- */
const initialData = [
  {
    id: "mat-1",
    name: "Product A",
    lots: [
      {
        id: "L-001",
        serial: "CH-2505-001",
        productId: "001",
        date: "2025-04-30",
        quantity: 50,
        remark: "New batch",
      },
    ],
  },
  {
    id: "mat-2",
    name: "Product B",
    lots: [
      {
        id: "L-002",
        serial: "DM-2505-001",
        productId: "002",
        date: "2025-04-30",
        quantity: 200,
        remark: "—",
      },
    ],
  },
  {
    id: "mat-3",
    name: "Product C",
    lots: [
      {
        id: "L-003",
        serial: "DM-2505-002",
        productId: "003",
        date: "2025-04-30",
        quantity: 120,
        remark: "—",
      },
    ],
  },
];

/* ---------------- utils ---------------- */
const fmtDateYMD = (iso) => {
  try {
    const d = new Date(iso + "T00:00:00");
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return iso;
  }
};

/* ---------------- Small UI helpers ---------------- */
const Btn = ({ className = "", children, ...rest }) => (
  <button
    className={
      "px-4 h-10 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed " +
      className
    }
    {...rest}
  >
    {children}
  </button>
);

const BtnIcon = ({ className = "", children, ...rest }) => (
  <button
    className={
      "h-9 w-9 flex items-center justify-center rounded-md " + className
    }
    {...rest}
  >
    {children}
  </button>
);

/* ---------------- Base Modal ---------------- */
function Modal({
  isOpen,
  title,
  onClose,
  onPrimary,
  primary = "55",
  hidePrimary = false,
  children,
  showPdf = false,
  onPdf,
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl shadow-xl w-[92vw] sm:w-[640px] p-5">
        {!!title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        <div className="space-y-4">{children}</div>

        {/* footer */}
        <div className="mt-5 flex justify-end gap-2">
          <Btn className="border hover:bg-gray-50" onClick={onClose}>
            {t("InventoryManagement.modalClose")}
          </Btn>

          {!hidePrimary && (
            <Btn
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onPrimary}
            >
              {t("InventoryManagement.modalSave")}
            </Btn>
          )}
          {showPdf && (
            <Btn
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
              onClick={onPdf}
            >
              <FiFileText className="w-4 h-4" />
              PDF
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Confirm Modal ---------------- */
function ConfirmModal({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onCancel,
  onConfirm,
  confirmColor = "bg-blue-600 hover:bg-blue-700",
}) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-[92vw] sm:w-[520px] p-5">
        <h3 className="text-lg font-semibold mb-3">
          {title || t("InventoryManagement.confirmTitle")}
        </h3>
        <p className="text-sm text-gray-700">
          {message || t("InventoryManagement.confirmSaveMsg")}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn className="border" onClick={onCancel}>
            {cancelText || t("InventoryManagement.cancel")}
          </Btn>
          <Btn className={`${confirmColor} text-white`} onClick={onConfirm}>
            {confirmText || t("InventoryManagement.confirm")}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Success Modal (auto-close 1s) ---------------- */
function SuccessModal({ open, onClose, text }) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!open) return;
    const tmr = setTimeout(onClose, 1000);
    return () => clearTimeout(tmr);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[92vw] sm:w-[420px] p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-800 font-medium">
            {text || t("InventoryManagement.saved")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Form (รองรับ readOnly) ---------------- */
function RowForm({ values, setValues, readOnly = false }) {
  const { t } = useTranslation();
  const common = "mt-1 w-full h-10 border rounded px-3 text-sm";
  const ro = readOnly ? "bg-gray-50 text-gray-700" : "focus:ring-2 focus:ring-blue-200";
  const bind = (key, isNumber = false) => ({
    value:
      values[key] === 0 || values[key]
        ? values[key]
        : "",
    onChange: (e) =>
      !readOnly &&
      setValues((v) => ({
        ...v,
        [key]: isNumber ? Number(e.target.value) : e.target.value,
      })),
    readOnly,
    className: `${common} ${ro}`,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className="text-sm font-medium">
          {t("InventoryManagement.formProductName")} *
        </label>
        <input
          placeholder={t("InventoryManagement.placeholderProductName")}
          {...bind("name")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("InventoryManagement.formProductId")} *
        </label>
        <input
          placeholder={t("InventoryManagement.placeholderProductId")}
          {...bind("productId")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("InventoryManagement.formSerial")} *
        </label>
        <input
          placeholder={t("InventoryManagement.placeholderSerial")}
          {...bind("serial")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("InventoryManagement.formLot")} *
        </label>
        <input
          placeholder={t("InventoryManagement.placeholderLot")}
          {...bind("lot")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("InventoryManagement.formReceivedDate")} *
        </label>
        <input type="date" {...bind("date")} />
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("InventoryManagement.formQuantity")} *
        </label>
        <input type="number" min={0} placeholder="0" {...bind("quantity", true)} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-sm font-medium">
          {t("InventoryManagement.formRemark")}
        </label>
        <input placeholder={t("InventoryManagement.placeholderRemark")} {...bind("remark")} />
      </div>
    </div>
  );
}

/* ---------------- Main Page ---------------- */
export default function InventoryManagement() {
  const { t } = useTranslation();
  const [materials, setMaterials] = useState(initialData);

  // search: type first -> click/enter to search
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // pagination
  const pageSize = 7;
  const [page, setPage] = useState(1);

  // modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successText, setSuccessText] = useState(t("InventoryManagement.saved"));

  // forms/context
  const [formAdd, setFormAdd] = useState({
    date: new Date().toISOString().slice(0, 10),
    quantity: 0,
  });
  const [formView, setFormView] = useState({});
  const [formEdit, setFormEdit] = useState({});
  const [editCtx, setEditCtx] = useState(null);     // { materialId, lotId }
  const [deleteCtx, setDeleteCtx] = useState(null); // row to delete

  // flatten rows for table/card
  const rows = useMemo(
    () =>
      materials.flatMap((m) =>
        (m.lots || []).map((l) => ({
          materialId: m.id,
          productName: m.name,
          serial: l.serial,
          productId: l.productId,
          lot: l.id,
          date: l.date,
          quantity: l.quantity ?? 0,
          remark: l.remark,
        }))
      ),
    [materials]
  );

  // filter by searchTerm only when clicking 🔍 / pressing Enter
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        (r.serial || "").toLowerCase().includes(term) ||
        (r.productId || "").toLowerCase().includes(term) ||
        (r.lot || "").toLowerCase().includes(term)
    );
  }, [rows, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ---------- Search handlers ---------- */
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };
  const handleClear = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  /* ---------- Open modals ---------- */
  const openAddModal = () => {
    setFormAdd({ date: new Date().toISOString().slice(0, 10), quantity: 0 });
    setOpenAdd(true);
  };
  const openViewModal = (row) => {
    setFormView({
      name: row.productName,
      productId: row.productId,
      serial: row.serial,
      lot: row.lot,
      date: row.date,
      quantity: row.quantity ?? 0,
      remark: row.remark,
    });
    setOpenView(true);
  };
  const openEditModal = (row) => {
    setEditCtx({ materialId: row.materialId, lotId: row.lot });
    setFormEdit({
      name: row.productName,
      productId: row.productId,
      serial: row.serial,
      lot: row.lot,
      date: row.date,
      quantity: row.quantity ?? 0,
      remark: row.remark,
    });
    setOpenEdit(true);
  };
  const openDeleteModal = (row) => {
    setDeleteCtx(row);
    setConfirmDeleteOpen(true);
  };

  /* ---------- Save (Add) ---------- */
  const requestSaveAdd = () => setConfirmSaveOpen(true);
  const actuallySaveAdd = () => {
    const { name, productId, serial, lot, date, quantity } = formAdd;
    if (
      !name ||
      !productId ||
      !serial ||
      !lot ||
      !date ||
      quantity === undefined ||
      quantity === null
    ) {
      setConfirmSaveOpen(false);
      return;
    }

    const newLot = {
      id: lot,
      serial,
      productId,
      date,
      quantity: Number(quantity) || 0,
      remark: formAdd.remark || "",
    };
    setMaterials((prev) => {
      const idx = prev.findIndex(
        (m) => m.name.toLowerCase() === name.toLowerCase()
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], lots: [...next[idx].lots, newLot] };
        return next;
      }
      return [...prev, { id: `mat-${Date.now()}`, name, lots: [newLot] }];
    });

    setConfirmSaveOpen(false);
    setOpenAdd(false);
    setSuccessText(t("InventoryManagement.saved"));
    setSuccessOpen(true);
  };

  /* ---------- Save (Edit) ---------- */
  const requestSaveEdit = () => setConfirmEditOpen(true);
  const actuallySaveEdit = () => {
    if (!editCtx) return;
    const { name, productId, serial, lot, date, quantity } = formEdit;
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== editCtx.materialId) return m;
        return {
          ...m,
          name,
          lots: m.lots.map((l) =>
            l.id === editCtx.lotId
              ? {
                  id: lot,
                  serial,
                  productId,
                  date,
                  quantity: Number(quantity) || 0,
                  remark: formEdit.remark || "",
                }
              : l
          ),
        };
      })
    );
    setConfirmEditOpen(false);
    setOpenEdit(false);
    setSuccessText(t("InventoryManagement.saved"));
    setSuccessOpen(true);
  };

  /* ---------- Delete ---------- */
  const actuallyDelete = () => {
    if (!deleteCtx) return;
    setMaterials((prev) =>
      prev
        .map((m) =>
          m.id !== deleteCtx.materialId
            ? m
            : { ...m, lots: m.lots.filter((l) => l.id !== deleteCtx.lot) }
        )
        .filter((m) => (m.lots || []).length > 0)
    );
    setConfirmDeleteOpen(false);
    setSuccessText(t("InventoryManagement.deleted"));
    setSuccessOpen(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <PageHeader title={t("InventoryManagement.title")} />

      {/* Search + Add */}
      <div className="flex items-center justify-between mt-5 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("InventoryManagement.searchPlaceholder")}
            className="w-[600px] max-w-[80vw] rounded-md border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <BtnIcon
            onClick={handleSearch}
            className="bg-blue-500 text-white"
            title={t("InventoryManagement.search")}
          >
            🔍
          </BtnIcon>
          <BtnIcon
            onClick={handleClear}
            className="bg-yellow-400 text-white"
            title={t("InventoryManagement.clear")}
          >
            ✖
          </BtnIcon>
        </div>

        <Btn
          onClick={openAddModal}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <FiPlus className="inline -mt-1 mr-2" />
          {t("InventoryManagement.add")}
        </Btn>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden md:block">
        <div className="border-t-2 border-blue-200" />
        <div className="mt-3 overflow-x-auto rounded-lg">
          <table className="min-w-[1000px] sm:min-w-full w-full border-collapse">
            <thead>
              <tr className="text-left text-blue-900">
                <th className="p-2 border-b-2 border-blue-200">{t("InventoryManagement.colSerial")}</th>
                <th className="p-2 border-b-2 border-blue-200">{t("InventoryManagement.colProductId")}</th>
                <th className="p-2 border-b-2 border-blue-200">{t("InventoryManagement.colProductName")}</th>
                <th className="p-2 border-b-2 border-blue-200">{t("InventoryManagement.colLot")}</th>
                <th className="p-2 border-b-2 border-blue-200">{t("InventoryManagement.colQty")}</th>
                <th className="p-2 border-b-2 border-blue-200">{t("InventoryManagement.colReceivedDate")}</th>
                <th className="p-2 border-b-2 border-blue-200 flex justify-center">
                  {t("InventoryManagement.colActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.length ? (
                paged.map((row, i) => (
                  <tr
                    key={row.serial + i}
                    className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}
                  >
                    <td className="p-2 border-b border-blue-200">{row.serial}</td>
                    <td className="p-2 border-b border-blue-200 text-blue-600">
                      {row.productId}
                    </td>
                    <td className="p-2 border-b border-blue-200 text-blue-600">
                      {row.productName}
                    </td>
                    <td className="p-2 border-b border-blue-200">{row.lot}</td>
                    <td className="p-2 border-b border-blue-200">
                      {row.quantity?.toLocaleString?.() ?? row.quantity}
                    </td>
                    <td className="p-2 border-b border-blue-200">
                      {fmtDateYMD(row.date)}
                    </td>
                    <td className="p-2 border-b border-blue-200 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-4 text-[18px]">
                        <button
                          className="text-indigo-700"
                          title={t("InventoryManagement.view")}
                          onClick={() => openViewModal(row)}
                        >
                          <FiEye />
                        </button>
                        <button
                          className="text-amber-600"
                          title={t("InventoryManagement.edit")}
                          onClick={() => openEditModal(row)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="text-red-600"
                          title={t("InventoryManagement.delete")}
                          onClick={() => openDeleteModal(row)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    {t("InventoryManagement.noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards (Mobile) */}
      <div className="md:hidden space-y-3 mt-3">
        {paged.length ? (
          paged.map((row, i) => (
            <div
              key={row.serial + i}
              className="bg-white shadow rounded-lg p-4 border border-blue-200"
            >
              <div className="font-medium text-blue-700">{row.productName}</div>
              <div className="mt-2 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("InventoryManagement.colSerialShort")}</span>
                  <span>{row.serial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("InventoryManagement.colProductId")}</span>
                  <span>{row.productId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("InventoryManagement.colLot")}</span>
                  <span>{row.lot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("InventoryManagement.colQty")}</span>
                  <span>{row.quantity?.toLocaleString?.() ?? row.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("InventoryManagement.colReceivedDate")}</span>
                  <span>{fmtDateYMD(row.date)}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-4 text-[18px]">
                <button
                  className="text-indigo-700"
                  title={t("InventoryManagement.view")}
                  onClick={() => openViewModal(row)}
                >
                  <FiEye />
                </button>
                <button
                  className="text-amber-600"
                  title={t("InventoryManagement.edit")}
                  onClick={() => openEditModal(row)}
                >
                  <FiEdit2 />
                </button>
                <button
                  className="text-red-600"
                  title={t("InventoryManagement.delete")}
                  onClick={() => openDeleteModal(row)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">{t("InventoryManagement.noData")}</div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <Btn
          className="border text-purple-700"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          «
        </Btn>
        {Array.from({ length: pageCount }).map((_, i) => (
          <Btn
            key={i}
            className={
              page === i + 1
                ? "bg-purple-600 text-white"
                : "border text-purple-700"
            }
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Btn>
        ))}
        <Btn
          className="border text-purple-700"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          »
        </Btn>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={openAdd}
        title={t("InventoryManagement.modalAddTitle")}
        onClose={() => setOpenAdd(false)}
        onPrimary={() => setConfirmSaveOpen(true)}
        showPdf
        onPdf={() => console.log("export pdf add")}
      >
        <RowForm values={formAdd} setValues={setFormAdd} />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={openView}
        title={t("InventoryManagement.modalViewTitle")}
        onClose={() => setOpenView(false)}
        showPdf
        onPdf={() => console.log("export pdf view")}
        hidePrimary
      >
        <RowForm values={formView} setValues={setFormView} readOnly />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={openEdit}
        title={t("InventoryManagement.modalEditTitle")}
        onClose={() => setOpenEdit(false)}
        onPrimary={() => setConfirmEditOpen(true)}
        primary={t("InventoryManagement.modalSaveChanges")}
      >
        <RowForm values={formEdit} setValues={setFormEdit} />
      </Modal>

      {/* Confirm dialogs */}
      <ConfirmModal
        open={confirmSaveOpen}
        title={t("InventoryManagement.confirmTitle")}
        message={t("InventoryManagement.confirmSaveMsg")}
        onCancel={() => setConfirmSaveOpen(false)}
        onConfirm={actuallySaveAdd}
        confirmText={t("InventoryManagement.confirm")}
        confirmColor="bg-blue-600 hover:bg-blue-700"
      />
      <ConfirmModal
        open={confirmEditOpen}
        title={t("InventoryManagement.confirmTitle")}
        message={t("InventoryManagement.confirmEditMsg")}
        onCancel={() => setConfirmEditOpen(false)}
        onConfirm={actuallySaveEdit}
        confirmText={t("InventoryManagement.confirm")}
        confirmColor="bg-blue-600 hover:bg-blue-700"
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        title={t("InventoryManagement.confirmDeleteTitle")}
        message={t("InventoryManagement.confirmDeleteMsg")}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={actuallyDelete}
        confirmText={t("InventoryManagement.delete")}
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      {/* Success (auto-close 1s) */}
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        text={successText}
      />
    </div>
  );
}
