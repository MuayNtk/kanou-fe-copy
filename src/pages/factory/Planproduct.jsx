// src/pages/factory/PlanProduct.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/PageHeader";

/* ===== Status config ===== */
const STATUS_META = {
  pending: { color: "bg-amber-100 text-amber-800 border-amber-200" },
  planned: { color: "bg-blue-100 text-blue-800 border-blue-200" },
  in_progress: { color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  done: { color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  qa_completed: { color: "bg-teal-100 text-teal-800 border-teal-200" },
};
function StatusPill({ code }) {
  const { t } = useTranslation();
  const meta = STATUS_META[code] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.color}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1 opacity-75" />
      {t(`StatusLabel_${code}`)}
    </span>
  );
}

/* ===== Helpers ===== */
const STATUS_ORDER = ["pending", "planned", "in_progress", "done", "qa_completed"];
function deriveRowStatusFromTasks(tasks = []) {
  const highest = [...STATUS_ORDER].reverse().find((code) => tasks?.some((t) => t.status === code));
  return highest || "pending";
}

/* ===== MOCK DATA ===== */
const MOCK_ROWS = [
  {
    orderNo: "PO-2025-001",
    quantity: 120,
    orderDate: "2025-10-05",
    productName: "Widget A",
    productCategory: "A",
    productCode: "WGA-M-001",
    material: "Aluminum 6061",
    color: "Silver",
    size: "M",
    unit: "pcs",
    bomVersion: "BOM-1.2",
    processLine: "Assembly Line 1",
    machine: "ASM-01",
    moldNo: "M-12-AX",
    standardTime: "45",
    leadTimeDays: "7",
    costPerUnit: "120.00",
    targetQty: "120",
    lotSize: "60",
    productSpecs: "Tolerance ±0.2mm; Surface Anodized",
    notes: "Priority lot",
    requestedDelivery: "2025-10-20",
    tasks: [
      { name: "Plan production", planDate: "2025-10-06", doneDate: "2025-10-06", qty: "120", status: "planned" },
      { name: "Start assembly", planDate: "2025-10-07", doneDate: "", qty: "120", status: "in_progress" },
    ],
  },
  {
    orderNo: "PO-2025-002",
    quantity: 80,
    orderDate: "2025-10-02",
    productName: "Spare Set B",
    productCategory: "B",
    productCode: "SSB-080",
    material: "ABS",
    color: "Black",
    size: "—",
    unit: "set",
    bomVersion: "BOM-3.0",
    processLine: "Injection",
    machine: "INJ-10",
    moldNo: "M-88",
    standardTime: "30",
    leadTimeDays: "5",
    costPerUnit: "67.50",
    targetQty: "80",
    lotSize: "80",
    productSpecs: "Flammability UL94 V-0",
    notes: "QA sampling 100%",
    requestedDelivery: "2025-10-18",
    tasks: [
      { name: "Plan", planDate: "2025-10-03", doneDate: "2025-10-03", qty: "80", status: "planned" },
      { name: "Production", planDate: "2025-10-04", doneDate: "2025-10-10", qty: "80", status: "done" },
      { name: "Quality Check", planDate: "2025-10-11", doneDate: "2025-10-11", qty: "80", status: "qa_completed" },
    ],
  },
  {
    orderNo: "PO-2025-003",
    quantity: 200,
    orderDate: "2025-10-06",
    productName: "Precision Unit C",
    productCategory: "C",
    productCode: "PUC-200",
    material: "SUS304",
    color: "Steel",
    size: "C",
    unit: "pcs",
    bomVersion: "BOM-0.9",
    processLine: "CNC",
    machine: "CNC-3",
    moldNo: "-",
    standardTime: "75",
    leadTimeDays: "10",
    costPerUnit: "56.00",
    targetQty: "200",
    lotSize: "100",
    productSpecs: "Ra ≤ 1.6 μm",
    notes: "—",
    requestedDelivery: "2025-10-30",
    tasks: [{ name: "Plan", planDate: "2025-10-07", doneDate: "2025-10-07", qty: "200", status: "planned" }],
  },
  {
    orderNo: "PO-2025-004",
    quantity: 150,
    orderDate: "2025-10-08",
    productName: "Gear Housing D",
    productCategory: "D",
    productCode: "GHD-150",
    material: "Zinc Alloy",
    color: "Gray",
    size: "L",
    unit: "pcs",
    bomVersion: "BOM-2.5",
    processLine: "Die Casting",
    machine: "DC-05",
    moldNo: "M-54-ZA",
    standardTime: "60",
    leadTimeDays: "8",
    costPerUnit: "89.00",
    targetQty: "150",
    lotSize: "75",
    productSpecs: "Hardness ≥ 80HB",
    notes: "Heat treatment required",
    requestedDelivery: "2025-10-25",
    tasks: [
      { name: "Plan", planDate: "2025-10-09", doneDate: "2025-10-09", qty: "150", status: "planned" },
      { name: "Casting", planDate: "2025-10-10", doneDate: "2025-10-14", qty: "150", status: "done" },
      { name: "Finishing", planDate: "2025-10-15", doneDate: "", qty: "150", status: "in_progress" },
    ],
  },
  {
    orderNo: "PO-2025-005",
    quantity: 300,
    orderDate: "2025-10-10",
    productName: "Connector E",
    productCategory: "E",
    productCode: "CNE-300",
    material: "Copper",
    color: "Gold",
    size: "S",
    unit: "pcs",
    bomVersion: "BOM-4.1",
    processLine: "Stamping",
    machine: "STP-02",
    moldNo: "M-22-CN",
    standardTime: "25",
    leadTimeDays: "4",
    costPerUnit: "14.80",
    targetQty: "300",
    lotSize: "100",
    productSpecs: "Conductivity ≥ 99%",
    notes: "Urgent delivery",
    requestedDelivery: "2025-10-15",
    tasks: [
      { name: "Plan", planDate: "2025-10-10", doneDate: "2025-10-10", qty: "300", status: "planned" },
      { name: "Stamping", planDate: "2025-10-11", doneDate: "2025-10-12", qty: "300", status: "done" },
      { name: "Packaging", planDate: "2025-10-13", doneDate: "", qty: "300", status: "pending" },
    ],
  },
  {
    orderNo: "PO-2025-006",
    quantity: 60,
    orderDate: "2025-10-09",
    productName: "Valve Set F",
    productCategory: "F",
    productCode: "VSF-060",
    material: "Brass",
    color: "Yellow",
    size: "Standard",
    unit: "set",
    bomVersion: "BOM-5.0",
    processLine: "Assembly Line 2",
    machine: "ASM-07",
    moldNo: "M-90",
    standardTime: "40",
    leadTimeDays: "6",
    costPerUnit: "95.00",
    targetQty: "60",
    lotSize: "30",
    productSpecs: "Pressure 15 bar; Leak test 100%",
    notes: "Recheck sealing",
    requestedDelivery: "2025-10-22",
    tasks: [
      { name: "Plan", planDate: "2025-10-10", doneDate: "2025-10-10", qty: "60", status: "planned" },
      { name: "Assembly", planDate: "2025-10-11", doneDate: "2025-10-15", qty: "60", status: "done" },
      { name: "QA Inspection", planDate: "2025-10-16", doneDate: "", qty: "60", status: "pending" },
    ],
  },
].map((r) => ({ ...r, status: deriveRowStatusFromTasks(r.tasks) }));


/* ===== Overlay ===== */
function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">{children}</div>
    </div>
  );
}

/* ===== Inputs ===== */
function Label({ children, required }) {
  return (
    <label className="block text-xs font-medium text-gray-700">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
function InputText({ label, required, placeholder, value, onChange, readOnly, className }) {
  return (
    <div className={className}>
      <Label required={required}>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={readOnly}
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm shadow-inner focus:ring-2 focus:ring-blue-300 outline-none disabled:bg-gray-100"
      />
    </div>
  );
}
function InputDate({ label, required, value, onChange, readOnly, className }) {
  return (
    <div className={className}>
      <Label required={required}>{label}</Label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm shadow-inner focus:ring-2 focus:ring-blue-300 outline-none disabled:bg-gray-100"
      />
    </div>
  );
}
function InputSelect({ label, required, value, onChange, options, readOnly, className }) {
  return (
    <div className={className}>
      <Label required={required}>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm shadow-inner focus:ring-2 focus:ring-blue-300 outline-none disabled:bg-gray-100"
      >
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}
function InputAmount({ label, placeholder, value, onChange, readOnly, className }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 opacity-70">฿</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={readOnly}
          className="mt-1 w-full rounded-md border border-gray-300 bg-white pl-6 pr-2 py-1.5 text-sm shadow-inner focus:ring-2 focus:ring-blue-300 outline-none disabled:bg-gray-100"
        />
      </div>
    </div>
  );
}
function InputNumber({ label, required, value, onChange, readOnly, className, min = 0, step = 1, placeholder }) {
  return (
    <div className={className}>
      <Label required={required}>{label}</Label>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={readOnly}
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm shadow-inner focus:ring-2 focus:ring-blue-300 outline-none disabled:bg-gray-100 text-right"
      />
    </div>
  );
}

/* ===== LocalStorage wiring ===== */
const LS_KEY = "pp_rows";
const loadRowsFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveRowsToLS = (rows) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rows || []));
  } catch {}
};

/* ===== Main Page ===== */
export default function PlanProduct() {
  const { t } = useTranslation();

  const [rows, setRows] = useState(() => loadRowsFromLS() || MOCK_ROWS);
  useEffect(() => {
    saveRowsToLS(rows);
  }, [rows]);

  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState(null); // 'add' | 'edit' | 'view' | null
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const emptyForm = {
    orderNo: "",
    orderDate: "",
    productName: "",
    productCategory: "",
    productCode: "",
    material: "",
    color: "",
    size: "",
    unit: "pcs",
    bomVersion: "",
    processLine: "",
    machine: "",
    moldNo: "",
    standardTime: "",
    leadTimeDays: "",
    costPerUnit: "",
    targetQty: "",
    lotSize: "",
    productSpecs: "",
    notes: "",
    requestedDelivery: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [tasks, setTasks] = useState([{ name: "", planDate: "", doneDate: "", qty: "", status: "pending" }]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const resetForm = () => {
    setForm(emptyForm);
    setTasks([{ name: "", planDate: "", doneDate: "", qty: "", status: "pending" }]);
  };
  const openAdd = () => {
    resetForm();
    setMode("add");
  };
  const openWithRow = (row, m) => {
    setForm({
      orderNo: row.orderNo || "",
      orderDate: row.orderDate || "",
      productName: row.productName || "",
      productCategory: row.productCategory || "",
      productCode: row.productCode || "",
      material: row.material || "",
      color: row.color || "",
      size: row.size || "",
      unit: row.unit || "pcs",
      bomVersion: row.bomVersion || "",
      processLine: row.processLine || "",
      machine: row.machine || "",
      moldNo: row.moldNo || "",
      standardTime: row.standardTime || "",
      leadTimeDays: row.leadTimeDays || "",
      costPerUnit: row.costPerUnit || "",
      targetQty: row.targetQty || "",
      lotSize: row.lotSize || "",
      productSpecs: row.productSpecs || "",
      notes: row.notes || "",
      requestedDelivery: row.requestedDelivery || "",
    });
    setTasks(row.tasks?.length ? row.tasks : [{ name: "", planDate: "", doneDate: "", qty: "", status: "pending" }]);
    setMode(m);
  };
  const openEdit = (row) => openWithRow(row, "edit");
  const openView = (row) => openWithRow(row, "view");
  const closeModal = () => setMode(null);

  const addTaskRow = () => setTasks((t) => [...t, { name: "", planDate: "", doneDate: "", qty: "", status: "pending" }]);
  const updateTask = (idx, key, val) => setTasks((t) => t.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));
  const removeTask = (idx) => setTasks((t) => t.filter((_, i) => i !== idx));

  const handleCancel = () => closeModal();
  const handleSaveClick = () => setShowConfirm(true);
  const handlePdf = () => alert("PDF export placeholder");

  const confirmSave = () => {
    setShowConfirm(false);
    const payload = { ...form, tasks: [...tasks] };
    payload.status = deriveRowStatusFromTasks(tasks);
    const sumQty = tasks.reduce((acc, t) => acc + (Number(t.qty) || 0), 0);
    payload.quantity = sumQty || (rows.find((r) => r.orderNo === form.orderNo)?.quantity ?? 0);

    if (isAdd) setRows((prev) => [payload, ...prev]);
    if (isEdit) setRows((prev) => prev.map((r) => (r.orderNo === form.orderNo ? payload : r)));
    setShowSuccess(true);
  };

  const askDelete = (row) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };
  const cancelDelete = () => {
    setShowDelete(false);
    setDeleteTarget(null);
  };
  const confirmDelete = () => {
    if (deleteTarget) {
      setRows((prev) => prev.filter((r) => r.orderNo !== deleteTarget.orderNo));
    }
    setShowDelete(false);
    setDeleteTarget(null);
  };

  const doSearch = () => setQuery(searchText.trim());
  const clearSearch = () => {
    setSearchText("");
    setQuery("");
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.orderNo.toLowerCase().includes(q));
  }, [query, rows]);

  return (
    <div className="space-y-4">
      <PageHeader title={t("PlanningProduct_pageTitle")} />

      <div className="flex items-center justify-between mt-5 mb-3">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            doSearch();
          }}
        >
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t("PlanningProduct_searchPlaceholder")}
            className="w-[520px] max-w-[80vw] rounded-md border border-blue-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-md px-3 py-1.5 text-sm" title={t("Common_search") || "Search"}>
            🔍
          </button>
          <button type="button" className="bg-yellow-400 text-white rounded-md px-3 py-1.5 text-sm" onClick={clearSearch} title={t("Common_clear") || "Clear"}>
            ✖
          </button>
        </form>
        <button onClick={openAdd} className="bg-purple-700 hover:bg-purple-800 text-white rounded-md px-3.5 py-1.5 text-sm">
          {t("Common_add")}
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="border-t-2 border-blue-200" />
        <div className="mt-3 overflow-x-auto rounded-lg">
          <table className="min-w-[820px] w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-blue-900">
                <th className="p-2 border-b-2 border-blue-200">{t("PlanningProduct_colOrderNo")}</th>
                <th className="p-2 border-b-2 border-blue-200">{t("PlanningProduct_colQty")}</th>
                <th className="p-2 border-b-2 border-blue-200">{t("PlanningProduct_colStatus")}</th>
                <th className="p-2 border-b-2 border-blue-200 flex justify-center">{t("PlanningProduct_colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.orderNo + i} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="p-2 border-b border-blue-200">{row.orderNo}</td>
                  <td className="p-2 border-b border-blue-200">{(row.quantity ?? 0).toLocaleString()}</td>
                  <td className="p-2 border-b border-blue-200">
                    <StatusPill code={row.status} />
                  </td>
                  <td className="p-2 border-b border-blue-200 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3 text-[18px]">
                      <button className="text-indigo-700" title={t("Common_view")} onClick={() => openView(row)}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button className="text-amber-600" title={t("Common_edit")} onClick={() => openEdit(row)}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                        </svg>
                      </button>
                      <button className="text-red-600" title={t("Common_delete")} onClick={() => askDelete(row)}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3-3h8a1 1 0 0 1 1 1v2H7V4a1 1 0 0 1 1-1z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    {t("Common_noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {filtered.map((r) => (
          <div key={r.orderNo} className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-gray-600">{t("PlanningProduct_colOrderNo")}</p>
                <p className="text-sm font-semibold text-gray-900">{r.orderNo}</p>
              </div>
              <StatusPill code={r.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[11px] text-gray-600">{t("PlanningProduct_colQty")}</p>
                <p className="font-semibold">{(r.quantity ?? 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-3 text-[18px]">
              <button className="text-indigo-700" title={t("Common_view")} onClick={() => openView(r)}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button className="text-amber-600" title={t("Common_edit")} onClick={() => openEdit(r)}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                </svg>
              </button>
              <button className="text-red-600" title={t("Common_delete")} onClick={() => askDelete(r)}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3-3h8a1 1 0 0 1 1 1v2H7V4a1 1 0 0 1 1-1z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit / View Modal */}
      {mode && (
        <Overlay onClose={closeModal}>
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b px-6 py-3">
              <div className="h-7 w-7 rounded-md bg-indigo-50 border border-indigo-200 grid place-items-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5h6a2 2 0 0 1 2 2v1H7V7a2 2 0 0 1 2-2z" />
                  <rect x="5" y="5" width="14" height="16" rx="2" />
                  <path d="M9 14l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">
                {isAdd && t("PlanningProduct_titleAdd")}
                {isEdit && t("PlanningProduct_titleEdit")}
                {isView && t("PlanningProduct_titleView")}
              </h3>
              <button className="ml-auto text-gray-500 hover:text-gray-700" onClick={closeModal} aria-label="Close">✖</button>
            </div>

            <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputText label={t("PlanningProduct_field_orderNo")} required placeholder="PO-2025-001" value={form.orderNo} onChange={(v) => setForm((f) => ({ ...f, orderNo: v }))} readOnly={isView} />
                <InputDate label={t("PlanningProduct_field_orderDate")} required value={form.orderDate} onChange={(v) => setForm((f) => ({ ...f, orderDate: v }))} readOnly={isView} />
                <InputText label={t("PlanningProduct_field_productName") || "Product Name"} required placeholder="Widget A" value={form.productName} onChange={(v) => setForm((f) => ({ ...f, productName: v }))} readOnly={isView} />

                <InputSelect label={t("PlanningProduct_field_productCategory")} value={form.productCategory} onChange={(v) => setForm((f) => ({ ...f, productCategory: v }))} options={["-- Select Category --", "A", "B", "C"]} readOnly={isView} />
                <InputText label={t("PlanningProduct_field_productCode") || "Product Code / SKU"} value={form.productCode} onChange={(v) => setForm((f) => ({ ...f, productCode: v }))} readOnly={isView} />
                <InputText label={t("PlanningProduct_field_material") || "Material"} value={form.material} onChange={(v) => setForm((f) => ({ ...f, material: v }))} readOnly={isView} />

                <InputText label={t("PlanningProduct_field_color") || "Color"} value={form.color} onChange={(v) => setForm((f) => ({ ...f, color: v }))} readOnly={isView} />
                <InputText label={t("PlanningProduct_field_size") || "Size"} value={form.size} onChange={(v) => setForm((f) => ({ ...f, size: v }))} readOnly={isView} />
                <InputSelect label={t("PlanningProduct_field_unit") || "Unit"} value={form.unit} onChange={(v) => setForm((f) => ({ ...f, unit: v }))} options={["pcs", "set", "box", "kg"]} readOnly={isView} />

                <InputText label={t("PlanningProduct_field_bomVersion") || "BOM Version"} value={form.bomVersion} onChange={(v) => setForm((f) => ({ ...f, bomVersion: v }))} readOnly={isView} />
                <InputText label={t("PlanningProduct_field_processLine") || "Process Line"} value={form.processLine} onChange={(v) => setForm((f) => ({ ...f, processLine: v }))} readOnly={isView} />
                <InputText label={t("PlanningProduct_field_machine") || "Machine"} value={form.machine} onChange={(v) => setForm((f) => ({ ...f, machine: v }))} readOnly={isView} />

                <InputText label={t("PlanningProduct_field_moldNo") || "Mold/Tool No."} value={form.moldNo} onChange={(v) => setForm((f) => ({ ...f, moldNo: v }))} readOnly={isView} />
                <InputNumber label={t("PlanningProduct_field_standardTime") || "Standard Time (sec/pc)"} value={form.standardTime} onChange={(v) => setForm((f) => ({ ...f, standardTime: v }))} readOnly={isView} step={0.1} />
                <InputNumber label={t("PlanningProduct_field_leadTimeDays") || "Lead Time (days)"} value={form.leadTimeDays} onChange={(v) => setForm((f) => ({ ...f, leadTimeDays: v }))} readOnly={isView} />

                <InputAmount label={t("PlanningProduct_field_costPerUnit") || "Cost / Unit"} placeholder="0.00" value={form.costPerUnit} onChange={(v) => setForm((f) => ({ ...f, costPerUnit: v }))} readOnly={isView} />
                <InputNumber label={t("PlanningProduct_field_targetQty") || "Target Qty"} value={form.targetQty} onChange={(v) => setForm((f) => ({ ...f, targetQty: v }))} readOnly={isView} />
                <InputNumber label={t("PlanningProduct_field_lotSize") || "Lot Size"} value={form.lotSize} onChange={(v) => setForm((f) => ({ ...f, lotSize: v }))} readOnly={isView} />

                <InputText className="md:col-span-2" label={t("PlanningProduct_field_productSpecs") || "Product Specs"} placeholder={t("PlanningProduct_placeholder_productDetails") || "e.g., tolerances, surface finishing, packaging"} value={form.productSpecs} onChange={(v) => setForm((f) => ({ ...f, productSpecs: v }))} readOnly={isView} />
                <InputText label={t("PlanningProduct_field_notes") || "Notes"} value={form.notes} onChange={(v) => setForm((f) => ({ ...f, notes: v }))} readOnly={isView} />
                <InputDate label={t("PlanningProduct_field_requestedDelivery")} value={form.requestedDelivery} onChange={(v) => setForm((f) => ({ ...f, requestedDelivery: v }))} readOnly={isView} />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">{t("WorkPlan_title")}</h4>
                  {!isView && (
                    <button onClick={addTaskRow} className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
                      {t("WorkPlan_addRow")}
                    </button>
                  )}
                </div>

                <div className="lg:hidden space-y-3">
                  {tasks.map((row, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">{t("WorkPlan_no")}</div>
                        <div className="text-xs font-semibold">{idx + 1}</div>
                      </div>

                      <div className="mt-2">
                        <Label>{t("WorkPlan_taskName")}</Label>
                        <input
                          value={row.name}
                          onChange={(e) => updateTask(idx, "name", e.target.value)}
                          placeholder={t("WorkPlan_taskNamePh")}
                          disabled={isView}
                          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                        />
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <Label>{t("WorkPlan_planDate")}</Label>
                          <input
                            type="date"
                            value={row.planDate}
                            onChange={(e) => updateTask(idx, "planDate", e.target.value)}
                            disabled={isView}
                            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <Label>{t("WorkPlan_doneDate")}</Label>
                          <input
                            type="date"
                            value={row.doneDate}
                            onChange={(e) => updateTask(idx, "doneDate", e.target.value)}
                            disabled={isView}
                            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <Label>{t("WorkPlan_qty")}</Label>
                          <input
                            type="number"
                            min="0"
                            value={row.qty}
                            onChange={(e) => updateTask(idx, "qty", e.target.value)}
                            placeholder="0"
                            disabled={isView}
                            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-right outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <Label>{t("WorkPlan_status")}</Label>
                          <select
                            value={row.status}
                            onChange={(e) => updateTask(idx, "status", e.target.value)}
                            disabled={isView}
                            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                          >
                            {STATUS_ORDER.map((code) => (
                              <option key={code} value={code}>
                                {t(`StatusLabel_${code}`)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {!isView && (
                        <div className="mt-3 flex justify-end">
                          <button onClick={() => removeTask(idx)} className="rounded-md border px-2.5 py-1.5 text-xs hover:bg-gray-50 text-red-600">
                            {t("WorkPlan_remove")}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="hidden lg:block rounded-lg border border-gray-200 overflow-x-auto touch-pan-x [-webkit-overflow-scrolling:touch]">
                  <table className="min-w-[700px] w-full border-collapse text-sm table-fixed">
                    <colgroup>
                      {[<col key="no" className="w-[52px]" />, <col key="name" />, <col key="plan" className="w-[138px]" />, <col key="done" className="w-[138px]" />, <col key="qty" className="w-[78px]" />, <col key="status" className="w-[150px]" />, <col key="rm" className="w-[86px]" />]}
                    </colgroup>
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="p-2 border-b">{t("WorkPlan_no")}</th>
                        <th className="p-2 border-b text-left">{t("WorkPlan_taskName")}</th>
                        <th className="p-2 border-b">{t("WorkPlan_planDate")}</th>
                        <th className="p-2 border-b">{t("WorkPlan_doneDate")}</th>
                        <th className="p-2 border-b">{t("WorkPlan_qty")}</th>
                        <th className="p-2 border-b">{t("WorkPlan_status")}</th>
                        <th className="p-2 border-b">{!isView ? t("WorkPlan_remove") : ""}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-2 border-t text-center">{idx + 1}</td>
                          <td className="p-2 border-t">
                            <input
                              value={row.name}
                              onChange={(e) => updateTask(idx, "name", e.target.value)}
                              placeholder={t("WorkPlan_taskNamePh")}
                              disabled={isView}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                            />
                          </td>
                          <td className="p-2 border-t">
                            <input
                              type="date"
                              value={row.planDate}
                              onChange={(e) => updateTask(idx, "planDate", e.target.value)}
                              disabled={isView}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                            />
                          </td>
                          <td className="p-2 border-t">
                            <input
                              type="date"
                              value={row.doneDate}
                              onChange={(e) => updateTask(idx, "doneDate", e.target.value)}
                              disabled={isView}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                            />
                          </td>
                          <td className="p-2 border-t">
                            <input
                              type="number"
                              min="0"
                              value={row.qty}
                              onChange={(e) => updateTask(idx, "qty", e.target.value)}
                              placeholder="0"
                              disabled={isView}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-right outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                            />
                          </td>
                          <td className="p-2 border-t">
                            <select
                              value={row.status}
                              onChange={(e) => updateTask(idx, "status", e.target.value)}
                              disabled={isView}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                            >
                              {STATUS_ORDER.map((code) => (
                                <option key={code} value={code}>
                                  {t(`StatusLabel_${code}`)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 border-t text-center">
                            {!isView && (
                              <button onClick={() => removeTask(idx)} className="rounded-md border px-2.5 py-1.5 text-xs hover:bg-gray-50 text-red-600">
                                {t("WorkPlan_remove")}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-6 py-3">
              {isView ? (
                <button onClick={handlePdf} className="rounded-md bg-red-600 px-3.5 py-1.5 text-white text-sm">
                  {t("Common_pdf")}
                </button>
              ) : (
                <>
                  <button onClick={handleCancel} className="rounded-md bg-white border border-black px-3.5 py-1.5 text-sm">
                    {t("Common_cancel")}
                  </button>
                  <button onClick={handleSaveClick} className="rounded-md bg-blue-600 px-3.5 py-1.5 text-white text-sm">
                    {t("Common_save")}
                  </button>
                  <button onClick={handlePdf} className="rounded-md bg-red-600 px-3.5 py-1.5 text-white text-sm">
                    {t("Common_pdf")}
                  </button>
                </>
              )}
            </div>
          </div>
        </Overlay>
      )}

      {mode && mode !== "view" && showConfirm && (
        <Overlay onClose={() => setShowConfirm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-200 grid place-items-center">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8h.01M11 12h2v6h-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-semibold">{t("PlanningProduct_confirm_title")}</h4>
                  <p className="text-sm text-gray-600">{t("PlanningProduct_confirm_subtitle")}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-6 py-3">
              <button onClick={() => setShowConfirm(false)} className="rounded-md bg-white border border-black px-3.5 py-1.5 text-sm">
                {t("Common_cancel")}
              </button>
              <button onClick={confirmSave} className="rounded-md bg-blue-600 px-3.5 py-1.5 text-white text-sm">
                {t("Common_save")}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {showSuccess && (
        <Overlay onClose={() => setShowSuccess(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="px-6 py-7 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-green-50 border border-green-200 grid place-items-center">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold">{t("PlanningProduct_success_title")}</h4>
              <p className="mt-1 text-sm text-gray-600">{t("PlanningProduct_success_subtitle")}</p>
            </div>
            <div className="flex items-center justify-center border-t px-6 py-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setMode(null);
                }}
                className="rounded-md bg-blue-600 px-3.5 py-1.5 text-white text-sm"
              >
                {t("Common_ok")}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {showDelete && (
        <Overlay onClose={cancelDelete}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-red-50 border border-red-200 grid place-items-center">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-semibold">{t("PlanningProduct_delete_title")}</h4>
                  <p className="text-sm text-gray-600">{t("PlanningProduct_delete_subtitle", { orderNo: deleteTarget?.orderNo || "" })}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-6 py-3">
              <button onClick={cancelDelete} className="rounded-md bg-white border border-black px-3.5 py-1.5 text-sm">
                {t("Common_cancel")}
              </button>
              <button onClick={confirmDelete} className="rounded-md bg-red-600 px-3.5 py-1.5 text-white text-sm">
                {t("Common_delete")}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}
