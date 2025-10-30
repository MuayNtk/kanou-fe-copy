import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { FiEye, FiEdit2, FiXCircle, FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const INITIAL_ROWS = [
  { id: "C001", name: "Somchai Meesuk", email: "somchai@email.com", tel: "0812345678" },
  { id: "C002", name: "Anong Rakdee", email: "Anong@email.com", tel: "0898765432" },
  { id: "C003", name: "Peter Johnson", email: "Peter@email.com", tel: "0923344556" },
  { id: "C004", name: "Suda Tanakul", email: "Suda@email.com", tel: "0855566778" },
  { id: "C005", name: "John Smith", email: "John@email.com", tel: "0801112233" }
];

const baseInput =
  "w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300";
const roInput = "bg-gray-50 text-gray-700 focus:ring-0 cursor-default";

export default function Customers() {
  const { t } = useTranslation();
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [search, setSearch] = useState("");

  // modal state
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "view" | "edit"
  const isView = modalMode === "view";
  const isAdd = modalMode === "add";
  const isEdit = modalMode === "edit";

  const [form, setForm] = useState({
    id: "",
    name: "",
    tax: "",
    fname: "",
    lname: "",
    tel: "",
    email: "",
    address: "",
    province: "",
    zip: ""
  });

  const onChange = (e) => {
    if (isView) return; // view-only
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSearch = () => {
    const q = search.trim().toLowerCase();
    if (!q) return setRows(INITIAL_ROWS);
    setRows(
      INITIAL_ROWS.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.tel.toLowerCase().includes(q)
      )
    );
  };
  const handleClear = () => {
    setSearch("");
    setRows(INITIAL_ROWS);
  };

  const openAdd = () => {
    setForm({
      id: "",
      name: "",
      tax: "",
      fname: "",
      lname: "",
      tel: "",
      email: "",
      address: "",
      province: "",
      zip: ""
    });
    setModalMode("add");
    setOpen(true);
  };

  const openView = (row) => {
    setForm({
      id: row.id,
      name: row.name,
      email: row.email,
      tel: row.tel,
      tax: "",
      fname: "",
      lname: "",
      address: "",
      province: "",
      zip: ""
    });
    setModalMode("view");
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      name: row.name,
      email: row.email,
      tel: row.tel,
      tax: "",
      fname: "",
      lname: "",
      address: "",
      province: "",
      zip: ""
    });
    setModalMode("edit");
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id || !form.name) return; // required: id & name
    if (isAdd) {
      setRows((r) => [...r, { id: form.id, name: form.name, email: form.email, tel: form.tel }]);
    } else if (isEdit) {
      setRows((r) =>
        r.map((x) => (x.id === form.id ? { id: form.id, name: form.name, email: form.email, tel: form.tel } : x))
      );
    }
    setOpen(false);
    if (isAdd) {
      setForm({
        id: "",
        name: "",
        tax: "",
        fname: "",
        lname: "",
        tel: "",
        email: "",
        address: "",
        province: "",
        zip: ""
      });
    }
  };

  const inputCls = `${baseInput} ${isView ? roInput : ""}`;

  return (
    <div className="">
      <PageHeader title={t("Customers.pageTitle")} />

      {/* Search + Add */}
      <div className="flex items-center justify-between mt-5 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("Customers.searchPlaceholder")}
            className="w-[600px] max-w-[80vw] rounded-md border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSearch}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-blue-500 text-white"
            title={t("Customers.search")}
            aria-label={t("Customers.search")}
          >
            🔍
          </button>
          <button
            onClick={handleClear}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-yellow-400 text-white"
            title={t("Customers.clear")}
            aria-label={t("Customers.clear")}
          >
            ✖
          </button>
        </div>

        <button onClick={openAdd} className="bg-purple-700 text-white px-6 py-2 rounded-lg">
          {t("Customers.add")}
        </button>
      </div>

      {/* Table */}
      <div className="border-t-2 border-blue-200" />
      <table className="w-full mt-3 border-collapse">
        <thead>
          <tr className="text-left text-blue-900">
            <th className="p-2 border-b-2 border-blue-200">{t("Customers.th.customerId")}</th>
            <th className="p-2 border-b-2 border-blue-200">{t("Customers.th.customerName")}</th>
            <th className="p-2 border-b-2 border-blue-200">{t("Customers.th.email")}</th>
            <th className="p-2 border-b-2 border-blue-200">{t("Customers.th.phone")}</th>
            <th className="p-2 border-b-2 border-blue-200 flex justify-center">{t("Customers.th.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className={`${i % 2 === 0 ? "bg-blue-50" : "bg-white"} border-b border-blue-200`}>
              <td className="p-2">{r.id}</td>
              <td className="p-2 text-blue-600">{r.name}</td>
              <td className="p-2">{r.email}</td>
              <td className="p-2">{r.tel}</td>
              <td className="p-2">
                <div className="flex items-center justify-center gap-4 text-[18px]">
                  <button
                    className="text-indigo-700"
                    title={t("Customers.icon.view")}
                    aria-label={t("Customers.icon.view")}
                    onClick={() => openView(r)}
                  >
                    <FiEye />
                  </button>
                  <button
                    className="text-amber-600"
                    title={t("Customers.icon.edit")}
                    aria-label={t("Customers.icon.edit")}
                    onClick={() => openEdit(r)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="text-red-600"
                    title={t("Customers.icon.delete")}
                    aria-label={t("Customers.icon.delete")}
                    onClick={() => {}}
                  >
                    <FiXCircle />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                {t("Customers.noData")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination (static demo) */}
      <div className="flex justify-center items-center mt-5 gap-4 text-purple-700">
        <button className="text-2xl" title={t("Customers.pagination.prev")} aria-label={t("Customers.pagination.prev")}>
          «
        </button>
        <span className="border border-purple-700 px-3 py-1 rounded">1</span>
        <button className="text-2xl" title={t("Customers.pagination.next")} aria-label={t("Customers.pagination.next")}>
          »
        </button>
      </div>

      {/* Modal (single modal, add/edit/view) */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="mt-4 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold text-blue-800">
                {t("Customers.modal.titlePrefix")}
                <span className="text-purple-700">
                  {isAdd ? t("Customers.modal.mode.add") : isView ? t("Customers.modal.mode.view") : t("Customers.modal.mode.edit")}
                </span>
              </div>
              <button
                className="text-2xl leading-none text-gray-400 hover:text-gray-600"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Form (readOnly on view) */}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.customerId")}</div>
                  <input name="id" value={form.id} onChange={onChange} className={inputCls} readOnly={isView} />
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.customerName")}</div>
                  <input name="name" value={form.name} onChange={onChange} className={inputCls} readOnly={isView} />
                </div>

                <div className="md:col-span-2">
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.taxId")}</div>
                  <input name="tax" value={form.tax} onChange={onChange} className={inputCls} readOnly={isView} />
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.firstName")}</div>
                  <input name="fname" value={form.fname} onChange={onChange} className={inputCls} readOnly={isView} />
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.lastName")}</div>
                  <input name="lname" value={form.lname} onChange={onChange} className={inputCls} readOnly={isView} />
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.phone")}</div>
                  <input name="tel" value={form.tel} onChange={onChange} className={inputCls} readOnly={isView} />
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.email")}</div>
                  <input name="email" value={form.email} onChange={onChange} className={inputCls} readOnly={isView} />
                </div>

                <div className="md:col-span-2">
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.address")}</div>
                  <textarea
                    name="address"
                    rows={4}
                    value={form.address}
                    onChange={onChange}
                    className={inputCls}
                    readOnly={isView}
                  />
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.province")}</div>
                  <input
                    name="province"
                    value={form.province}
                    onChange={onChange}
                    className={inputCls}
                    readOnly={isView}
                  />
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Customers.form.postal")}</div>
                  <input name="zip" value={form.zip} onChange={onChange} className={inputCls} readOnly={isView} />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-gray-200 px-5 py-2 text-gray-800 hover:opacity-90"
                >
                  {t("Customers.btn.cancel")}
                </button>

                {(isAdd || isEdit) && (
                  <button type="submit" className="rounded-md bg-purple-800 px-5 py-2 text-white hover:opacity-90">
                    {t("Customers.btn.submit")}
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
                    {t("Customers.btn.pdf")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
