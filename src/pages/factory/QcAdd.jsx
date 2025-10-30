// src/pages/factory/QcAdd.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function QcAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    inspectorId: "",
    inspectorName: "",
    inspectionDate: "",
    department: "",
    productId: "",
    productName: "",
    lotNumber: "",
    qtyInspected: "",
    inspectionType: "",
    status: "Pass",
    severity: "",
    defectTypes: [],
    defectOther: "",
    remark: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("QC ADD submit:", form);
    navigate("/factory/qc");
  };

  const onCancel = () => navigate("/factory/qc");

  const baseInput =
    "w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300";

  const toggleDefect = (val) => {
    setForm((s) => {
      const exists = s.defectTypes.includes(val);
      return {
        ...s,
        defectTypes: exists
          ? s.defectTypes.filter((d) => d !== val)
          : [...s.defectTypes, val],
      };
    });
  };

  return (
    <div>
      <PageHeader title={t("QcAdd.title")} />
      <form onSubmit={onSubmit} className="mx-auto w-full max-w-6xl bg-white mt-5">
        {/* แถว 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.inspectorId")}
            </label>
            <input name="inspectorId" value={form.inspectorId} onChange={onChange} className={baseInput} />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.inspectorName")}
            </label>
            <input name="inspectorName" value={form.inspectorName} onChange={onChange} className={baseInput} />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.inspectionDate")}
            </label>
            <input type="date" name="inspectionDate" value={form.inspectionDate} onChange={onChange} className={baseInput} />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.department")}
            </label>
            <select name="department" value={form.department} onChange={onChange} className={baseInput}>
              <option value="">{t("QcAdd.select")}</option>
              <option value="QA">QA</option>
              <option value="QC">QC</option>
              <option value="Production">{t("QcAdd.production")}</option>
              <option value="Warehouse">{t("QcAdd.warehouse")}</option>
            </select>
          </div>
        </div>

        {/* แถว 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.productId")}
            </label>
            <input name="productId" value={form.productId} onChange={onChange} className={baseInput} />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.productName")}
            </label>
            <input name="productName" value={form.productName} onChange={onChange} className={baseInput} />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.lotNumber")}
            </label>
            <input name="lotNumber" value={form.lotNumber} onChange={onChange} className={baseInput} />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.qtyInspected")}
            </label>
            <input type="number" min="0" name="qtyInspected" value={form.qtyInspected} onChange={onChange} className={baseInput} />
          </div>
        </div>

        {/* Inspection Type */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("QcAdd.inspectionType")}
            </label>
            <select name="inspectionType" value={form.inspectionType} onChange={onChange} className={baseInput}>
              <option value="">{t("QcAdd.select")}</option>
              <option value="Incoming">{t("QcAdd.typeIncoming")}</option>
              <option value="In-Process">{t("QcAdd.typeInProcess")}</option>
              <option value="Final">{t("QcAdd.typeFinal")}</option>
              <option value="Re-Inspection">{t("QcAdd.typeReInspection")}</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6">
          <div className="text-base font-semibold text-gray-800 mb-3">
            {t("QcAdd.result")}
          </div>
          <div className="flex items-center gap-10">
            {["Pass", "Conditional Pass", "Fail"].map((s) => (
              <label key={s} className="inline-flex items-center gap-2">
                <input type="radio" name="status" value={s} checked={form.status === s} onChange={onChange} className="h-5 w-5 accent-blue-600" />
                <span>
                  {s === "Pass" ? t("QcAdd.statusPass") : s === "Conditional Pass" ? t("QcAdd.statusConditional") : t("QcAdd.statusFail")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Severity & Defects */}
        {(form.status === "Conditional Pass" || form.status === "Fail") && (
          <>
            <div className="mt-6">
              <div className="text-base font-semibold text-gray-800 mb-3">
                {t("QcAdd.severity")}
              </div>
              <div className="flex items-center gap-10">
                {[
                  { val: "Low", color: "bg-green-500", label: t("QcAdd.severityLow") },
                  { val: "Medium", color: "bg-yellow-400", label: t("QcAdd.severityMedium") },
                  { val: "High", color: "bg-red-600", label: t("QcAdd.severityHigh") },
                ].map((s) => (
                  <label key={s.val} className="inline-flex items-center gap-2">
                    <input type="radio" name="severity" value={s.val} checked={form.severity === s.val} onChange={onChange} className="h-5 w-5 accent-blue-600" />
                    <span className="flex items-center gap-1">
                      <span className={`inline-block w-4 h-4 rounded-full ${s.color}`} />
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-base font-semibold text-gray-800 mb-3">
                {t("QcAdd.defectTypes")}
              </div>
              <div className="flex flex-col gap-3">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.defectTypes.includes("Appearance")} onChange={() => toggleDefect("Appearance")} className="h-5 w-5 accent-blue-600" />
                  {t("QcAdd.defectAppearance")}
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.defectTypes.includes("Functionality")} onChange={() => toggleDefect("Functionality")} className="h-5 w-5 accent-blue-600" />
                  {t("QcAdd.defectFunctionality")}
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.defectTypes.includes("Other")} onChange={() => toggleDefect("Other")} className="h-5 w-5 accent-blue-600" />
                  {t("QcAdd.defectOther")}
                  {form.defectTypes.includes("Other") && (
                    <input type="text" name="defectOther" value={form.defectOther} onChange={onChange} className="ml-2 border rounded px-2 py-1" placeholder={t("QcAdd.defectOtherPlaceholder")} />
                  )}
                </label>
              </div>
            </div>
          </>
        )}

        {/* Remark */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-blue-600 mb-1">
            {t("QcAdd.remark")}
          </label>
          <textarea rows={4} name="remark" value={form.remark} onChange={onChange} className={`${baseInput} min-h-[120px]`} />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-5 py-2 text-gray-800 hover:opacity-90">
            {t("QcAdd.cancel")}
          </button>
          <button type="submit" className="rounded-md bg-purple-800 px-5 py-2 text-white hover:opacity-90">
            {t("QcAdd.submit")}
          </button>
          <button type="button" onClick={() => console.log("Export PDF", form)} className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700">
            <FiFileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </form>
    </div>
  );
}

export default QcAdd;
