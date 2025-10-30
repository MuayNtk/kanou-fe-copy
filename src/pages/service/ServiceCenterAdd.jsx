// src/pages/service/ServiceCenterAdd.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function ServiceCenterAdd() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    location: "",
    type: "",
    productId: "",
    productName: "",
    date: "",
    time: "",
    technicianId: "",
    technicianName: "",
    remark: ""
  });

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onCancel = () => navigate("/service/servicecenter");
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: submit to API
    console.log("SUBMIT:", form);
    navigate("/service/servicecenter");
  };

  return (
    <div>
      <PageHeader title={t("ServiceServiceCenterAdd.pageTitle")} />

      {/* Top-right List button */}
      <div className="px-6 mt-4 flex justify-end">
        <Link
          to="/service/servicecenter"
          className="px-4 h-9 rounded-md bg-gray-100 border text-gray-700 flex items-center"
        >
          {t("ServiceServiceCenterAdd.list")}
        </Link>
      </div>

      <form onSubmit={onSubmit} className="px-6 pb-12">
        {/* 4-column grid to match the reference layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {/* Row 1 */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.customerId")}
            </label>
            <input
              value={form.customerId}
              onChange={(e) => setField("customerId", e.target.value)}
              className="w-full h-9 border rounded px-3"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.customerName")}
            </label>
            <input
              value={form.customerName}
              onChange={(e) => setField("customerName", e.target.value)}
              className="w-full h-9 border rounded px-3"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.location")}
            </label>
            <select
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              className="w-full h-9 border rounded px-3 bg-white"
            >
              <option value="">{t("ServiceServiceCenterAdd.locationSelect")}</option>
              <option value="On-site">{t("ServiceServiceCenterAdd.locationOnsite")}</option>
              <option value="In-house">{t("ServiceServiceCenterAdd.locationInhouse")}</option>
              <option value="Remote">{t("ServiceServiceCenterAdd.locationRemote")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.type")}
            </label>
            <select
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
              className="w-full h-9 border rounded px-3 bg-white"
            >
              <option value="">{t("ServiceServiceCenterAdd.typeSelect")}</option>
              <option value="Repair">{t("ServiceServiceCenterAdd.typeRepair")}</option>
              <option value="Maintenance">{t("ServiceServiceCenterAdd.typeMaintenance")}</option>
              <option value="Inspection">{t("ServiceServiceCenterAdd.typeInspection")}</option>
            </select>
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.productId")}
            </label>
            <input
              value={form.productId}
              onChange={(e) => setField("productId", e.target.value)}
              className="w-full h-9 border rounded px-3"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.productName")}
            </label>
            <input
              value={form.productName}
              onChange={(e) => setField("productName", e.target.value)}
              className="w-full h-9 border rounded px-3"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.date")}
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className="w-full h-9 border rounded px-3"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.time")}
            </label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setField("time", e.target.value)}
              className="w-full h-9 border rounded px-3"
            />
          </div>

          {/* Row 3 */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.technicianId")}
            </label>
            <input
              value={form.technicianId}
              onChange={(e) => setField("technicianId", e.target.value)}
              className="w-full h-9 border rounded px-3"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.technicianName")}
            </label>
            <input
              value={form.technicianName}
              onChange={(e) => setField("technicianName", e.target.value)}
              className="w-full h-9 border rounded px-3"
            />
          </div>

          {/* Row 4: Remark (full width) */}
          <div className="md:col-span-4">
            <label className="block text-sm text-gray-700 mb-1">
              {t("ServiceServiceCenterAdd.remark")}
            </label>
            <textarea
              rows={4}
              value={form.remark}
              onChange={(e) => setField("remark", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder=""
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 h-10 rounded-md bg-gray-200 text-gray-800 hover:opacity-95"
          >
            {t("ServiceServiceCenterAdd.cancel")}
          </button>
          <button
            type="submit"
            className="px-6 h-10 rounded-md bg-[#4b2e83] text-white hover:opacity-95"
          >
            {t("ServiceServiceCenterAdd.submit")}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Export to PDF", { form });
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
