import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { FiEye, FiEdit2, FiXCircle, FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const INIT = [
  {
    id: "S001",
    company: "Tech Supply Co",
    contact: "Mr. Narin",
    email: "narin@techsupply.com",
  },
  {
    id: "S002",
    company: "Global Bags Ltd.",
    contact: "Ms. Alice",
    email: "alice@globalbags.com",
  },
  {
    id: "S003",
    company: "Office Deco Corp.",
    contact: "Mr. Hiroshi",
    email: "hiro@officedeco.jp",
  },
];

const inputSm =
  "w-full rounded-md border border-blue-200 px-3 py-1.5 text-[13px] outline-none focus:ring-2 focus:ring-blue-300";

export default function Suppliers() {
  const { t } = useTranslation();

  const [rows, setRows] = useState(INIT);
  const [search, setSearch] = useState("");

  // modal states
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "view" | "edit"
  const isView = modalMode === "view";
  const isAdd = modalMode === "add";
  const isEdit = modalMode === "edit";

  const [form, setForm] = useState({
    id: "",
    company: "",
    fname: "",
    lname: "",
    position: "",
    tel: "",
    email: "",
    address: "",
    province: "",
    zip: "",
  });

  const inputSmRO = `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0`;

  // search
  const doSearch = () => {
    const q = search.trim().toLowerCase();
    if (!q) return setRows(INIT);
    setRows(
      INIT.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.contact.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      )
    );
  };
  const clearSearch = () => {
    setSearch("");
    setRows(INIT);
  };

  // open modal helpers
  const openAdd = () => {
    setForm({
      id: "",
      company: "",
      fname: "",
      lname: "",
      position: "",
      tel: "",
      email: "",
      address: "",
      province: "",
      zip: "",
    });
    setModalMode("add");
    setOpen(true);
  };

  const openView = (row) => {
    setForm({
      id: row.id,
      company: row.company,
      // split contact if needed
      fname: "",
      lname: "",
      position: "",
      tel: "",
      email: row.email || "",
      address: "",
      province: "",
      zip: "",
    });
    setModalMode("view");
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      company: row.company,
      fname: "",
      lname: "",
      position: "",
      tel: "",
      email: row.email || "",
      address: "",
      province: "",
      zip: "",
    });
    setModalMode("edit");
    setOpen(true);
  };

  // form handlers
  const onChange = (e) => {
    if (isView) return; // view-only
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.id || !form.company) return;

    const newRow = {
      id: form.id,
      company: form.company,
      contact: [form.fname, form.lname].filter(Boolean).join(" ").trim() || "-",
      email: form.email || "-",
    };

    if (isAdd) {
      setRows((r) => [...r, newRow]);
    } else if (isEdit) {
      setRows((r) => r.map((x) => (x.id === form.id ? newRow : x)));
    }

    setOpen(false);

    if (isAdd) {
      setForm({
        id: "",
        company: "",
        fname: "",
        lname: "",
        position: "",
        tel: "",
        email: "",
        address: "",
        province: "",
        zip: "",
      });
    }
  };

  return (
    <div className="">
      <PageHeader title={t("Suppliers.pageTitle")} />

      {/* Search + Add */}
      <div className="flex items-center justify-between mt-5 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder={t("Suppliers.search.placeholder")}
            className="w-[600px] max-w-[80vw] rounded-md border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={doSearch}
            title={t("Suppliers.search.searchBtnTitle")}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-blue-500 text-white"
          >
            🔍
          </button>
          <button
            onClick={clearSearch}
            title={t("Suppliers.search.clearBtnTitle")}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-yellow-400 text-white"
          >
            ✖
          </button>
        </div>

        <button onClick={openAdd} className="bg-purple-700 text-white px-6 py-2 rounded-lg">
          {t("Suppliers.actions.add")}
        </button>
      </div>

      {/* Table */}
      <div className="border-t-2 border-blue-200" />
      <table className="w-full mt-3 border-collapse">
        <thead>
          <tr className="text-left text-blue-900">
            <th className="p-2 border-b-2 border-blue-200">{t("Suppliers.table.supplierId")}</th>
            <th className="p-2 border-b-2 border-blue-200">{t("Suppliers.table.companyName")}</th>
            <th className="p-2 border-b-2 border-blue-200">{t("Suppliers.table.contact")}</th>
            <th className="p-2 border-b-2 border-blue-200">{t("Suppliers.table.email")}</th>
            <th className="p-2 border-b-2 border-blue-200 flex justify-center">{t("Suppliers.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id + i}
              className={`${i % 2 === 0 ? "bg-blue-50" : "bg-white"} border-b border-blue-200`}
            >
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.company}</td>
              <td className="p-2">{r.contact}</td>
              <td className="p-2">{r.email}</td>
              <td className="p-2">
                <div className="flex items-center justify-center gap-4 text-[18px]">
                  <button className="text-indigo-700" title={t("Suppliers.rowActions.view")} onClick={() => openView(r)}>
                    <FiEye />
                  </button>
                  <button className="text-amber-600" title={t("Suppliers.rowActions.edit")} onClick={() => openEdit(r)}>
                    <FiEdit2 />
                  </button>
                  <button className="text-red-600" title={t("Suppliers.rowActions.delete")} onClick={() => {}}>
                    <FiXCircle />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                {t("Suppliers.table.noData")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination  */}
      <div className="flex justify-center items-center mt-5 gap-4 text-purple-700">
        <button className="text-2xl" aria-label={t("Suppliers.paging.prev")}>
          «
        </button>
        <span className="border border-purple-700 px-3 py-1 rounded">1</span>
        <button className="text-2xl" aria-label={t("Suppliers.paging.next")}>
          »
        </button>
      </div>

      {/* Modal (Compact) — single modal for add/view/edit */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          {/* コンパクト幅 */}
          <div className="w-[680px] max-w-full rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3">
              <div className="text-[18px] font-semibold text-blue-800">
                <span>{t("Suppliers.modal.titleEntity")}</span>
                <span className="mx-2 text-blue-500">→</span>
                <span className="text-purple-700">
                  {isAdd ? t("Suppliers.modal.mode.add") : isView ? t("Suppliers.modal.mode.view") : t("Suppliers.modal.mode.edit")}
                </span>
              </div>
              <button
                className="text-2xl leading-none text-gray-400 hover:text-gray-600"
                aria-label={t("Suppliers.modal.close")}
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="border-t border-blue-100" />

            {/* Body */}
            <div className="px-6 py-4 text-[13px]">
              <form id="supplierForm" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.supplierId")}</label>
                    <input
                      name="id"
                      value={form.id}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>
                  <div>
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.company")}</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>

                  <div>
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.firstName")}</label>
                    <input
                      name="fname"
                      value={form.fname}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>
                  <div>
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.lastName")}</label>
                    <input
                      name="lname"
                      value={form.lname}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>

                  <div>
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.position")}</label>
                    <input
                      name="position"
                      value={form.position}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>
                  <div>
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.phone")}</label>
                    <input
                      name="tel"
                      value={form.tel}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.email")}</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.address")}</label>
                    <textarea
                      name="address"
                      rows={3}
                      value={form.address}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>

                  <div>
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.prefecture")}</label>
                    <input
                      name="province"
                      value={form.province}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>
                  <div>
                    <label className="block text-blue-700 mb-1">{t("Suppliers.form.postalCode")}</label>
                    <input
                      name="zip"
                      value={form.zip}
                      onChange={onChange}
                      className={isView ? `${inputSm} bg-gray-50 text-gray-700 cursor-default focus:ring-0` : inputSm}
                      readOnly={isView}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="border-t border-blue-100 px-6 py-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:opacity-90 text-[13px]"
              >
                {t("Suppliers.modal.cancel")}
              </button>

              {(isAdd || isEdit) && (
                <button
                  form="supplierForm"
                  type="submit"
                  className="rounded-md bg-purple-800 px-4 py-2 text-white hover:opacity-90 text-[13px]"
                >
                  {t("Suppliers.modal.submit")}
                </button>
              )}

              {(isAdd || isView) && (
                <button
                  type="button"
                  onClick={() => {
                    console.log(`Export to PDF (${isAdd ? "ADD" : "VIEW"})`, { form });
                    // TODO: export PDF logic
                  }}
                  className="px-6 h-10 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
                >
                  <FiFileText className="w-4 h-4" />
                  {t("Suppliers.modal.pdf")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
