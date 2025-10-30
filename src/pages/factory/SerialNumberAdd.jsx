// src/pages/factory/SerialNumberAdd.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function SerialNumberAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productId: "",
    productName: "",
    serialPrefix: "",
    serialId: "",
    serialStart: "",
    serialEnd: "",
    amount: "",
    date: "",
    remark: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submit:", form);
    navigate("/factory/order");
  };

  return (
    <div className="">
      <PageHeader title={t("SerialNumberAdd.title")} />
      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-6xl rounded-2xl bg-white mt-5"
      >
        {/* แถว 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("SerialNumberAdd.productId")}
            </label>
            <input
              name="productId"
              value={form.productId}
              onChange={onChange}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("SerialNumberAdd.productName")}
            </label>
            <input
              name="productName"
              value={form.productName}
              onChange={onChange}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("SerialNumberAdd.serialPrefix")}
            </label>
            <select
              name="serialPrefix"
              value={form.serialPrefix}
              onChange={onChange}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
            >
              <option value="">{t("SerialNumberAdd.selectPlaceholder")}</option>
              <option value="CH">CH</option>
              <option value="DM">DM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("SerialNumberAdd.serialId")}
            </label>
            <input
              name="serialId"
              value={form.serialId}
              onChange={onChange}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
              type="text"
            />
          </div>
        </div>

        {/* แถว 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("SerialNumberAdd.serialStart")}
            </label>
            <input
              name="serialStart"
              value={form.serialStart}
              onChange={onChange}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("SerialNumberAdd.serialEnd")}
            </label>
            <input
              name="serialEnd"
              value={form.serialEnd}
              onChange={onChange}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("SerialNumberAdd.amount")}
            </label>
            <input
              name="amount"
              value={form.amount}
              onChange={onChange}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
              type="number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              {t("SerialNumberAdd.date")}
            </label>
            <input
              name="date"
              value={form.date}
              onChange={onChange}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
              type="date"
            />
          </div>
        </div>

        {/* Remark */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-blue-600 mb-1">
            {t("SerialNumberAdd.remark")}
          </label>
          <textarea
            name="remark"
            value={form.remark}
            onChange={onChange}
            rows={4}
            className="w-full rounded-md border border-blue-200 px-3 py-2"
          />
        </div>

        {/* ปุ่ม */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/factory/order")}
            className="rounded-md bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 px-5 py-2  hover:opacity-90"
          >
            {t("SerialNumberAdd.cancel")}
          </button>
          <button
            type="submit"
            className="rounded-md bg-purple-800 px-5 py-2 text-white hover:opacity-90"
          >
            {t("SerialNumberAdd.submit")}
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

export default SerialNumberAdd;
