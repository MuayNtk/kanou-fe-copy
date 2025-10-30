import React, { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { FiEye, FiEdit2, FiXCircle, FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ALL_PRODUCTS = [
  { id: "P001", name: "Product A", cat: "A", price: 20, qty: 100 },
  { id: "P002", name: "Product B", cat: "B", price: 30, qty: 200 },
  { id: "P003", name: "Product C", cat: "A", price: 20, qty: 700 },
  { id: "P004", name: "Product D", cat: "B", price: 50, qty: 400 },
  { id: "P005", name: "Product E", cat: "B", price: 100, qty: 400 },
  { id: "P006", name: "Product F", cat: "A", price: 15, qty: 120 },
  { id: "P007", name: "Product G", cat: "A", price: 80, qty: 60 },
  { id: "P008", name: "Product H", cat: "B", price: 25, qty: 50 },
  { id: "P009", name: "Product I", cat: "A", price: 40, qty: 90 },
  { id: "P010", name: "Product J", cat: "B", price: 70, qty: 150 },
];

const inputCls =
  "w-full rounded-md border border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300";
const inputRO = `${inputCls} bg-gray-50 text-gray-700 cursor-default focus:ring-0`;

export default function Products() {
  const { t } = useTranslation();

  // table data + search
  const [data, setData] = useState(ALL_PRODUCTS);
  const [search, setSearch] = useState("");

  // pagination (7 rows/page)
  const PAGE_SIZE = 7;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);
  const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const handleSearch = () => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setData(ALL_PRODUCTS);
    } else {
      const f = ALL_PRODUCTS.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q) ||
          String(p.price).includes(q) ||
          String(p.qty).includes(q)
      );
      setData(f);
    }
    setPage(1);
  };
  const handleClear = () => {
    setSearch("");
    setData(ALL_PRODUCTS);
    setPage(1);
  };

  // modal
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "view" | "edit"
  const isAdd = modalMode === "add";
  const isView = modalMode === "view";
  const isEdit = modalMode === "edit";

  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    qty: "",
    cat: "",
    desc: "",
  });

  const onChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const openAdd = () => {
    setForm({ id: "", name: "", price: "", qty: "", cat: "", desc: "" });
    setModalMode("add");
    setOpen(true);
  };
  const openView = (row) => {
    setForm({ ...row, desc: row.desc || "" });
    setModalMode("view");
    setOpen(true);
  };
  const openEdit = (row) => {
    setForm({ ...row, desc: row.desc || "" });
    setModalMode("edit");
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id || !form.name) return;

    const newRow = {
      id: form.id,
      name: form.name,
      price: Number(form.price) || 0,
      qty: Number(form.qty) || 0,
      cat: form.cat || "-",
      desc: form.desc || "",
    };

    if (isAdd) {
      setData((d) => [newRow, ...d]);
    } else if (isEdit) {
      setData((d) => d.map((x) => (x.id === form.id ? newRow : x)));
    }

    setOpen(false);
    setPage(1);
  };

  return (
    <div className="">
      <PageHeader title={t("Products.pageTitle")} />
      {/* Search + Add */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-2 w-full max-w-3xl">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("Products.search.placeholder")}
            className={inputCls}
          />
          <button
            onClick={handleSearch}
            className="h-9 w-9 rounded-md bg-blue-500 text-white text-lg flex items-center justify-center"
            title={t("Products.search.searchBtnTitle")}
          >
            🔍
          </button>
          <button
            onClick={handleClear}
            className="h-9 w-9 rounded-md bg-yellow-400 text-white text-lg flex items-center justify-center"
            title={t("Products.search.clearBtnTitle")}
          >
            ✖
          </button>
        </div>

        <button onClick={openAdd} className="ml-4 bg-purple-700 text-white px-6 py-2 rounded-lg">
          {t("Products.actions.add")}
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 border-t-2 border-blue-200" />
      <div className="mt-3 overflow-x-auto rounded-lg">
        <table className="min-w-[900px] sm:min-w-full w-full border-collapse">
          <thead>
            <tr className="text-left text-blue-900">
              <th className="px-3 py-2 border-b-2 border-blue-200">{t("Products.table.productId")}</th>
              <th className="px-3 py-2 border-b-2 border-blue-200">{t("Products.table.productName")}</th>
              <th className="px-3 py-2 border-b-2 border-blue-200">{t("Products.table.category")}</th>
              <th className="px-3 py-2 border-b-2 border-blue-200">{t("Products.table.price")}</th>
              <th className="px-3 py-2 border-b-2 border-blue-200">{t("Products.table.qty")}</th>
              <th className="px-3 py-2 border-b-2 border-blue-200 flex justify-center">{t("Products.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length ? (
              pageItems.map((p, i) => (
                <tr
                  key={p.id}
                  className={`${i % 2 === 0 ? "bg-blue-50" : "bg-white"} border-b border-blue-200`}
                >
                  <td className="px-3 py-3">{p.id}</td>
                  <td className="px-3 py-3">{p.name}</td>
                  <td className="px-3 py-3">{p.cat}</td>
                  <td className="px-3 py-3">{p.price}</td>
                  <td className="px-3 py-3">{p.qty}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-4 text-[18px]">
                      <button
                        className="text-indigo-700"
                        title={t("Products.rowActions.view")}
                        onClick={() => openView(p)}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-amber-600"
                        title={t("Products.rowActions.edit")}
                        onClick={() => openEdit(p)}
                      >
                        <FiEdit2 />
                      </button>
                      <button className="text-red-600" title={t("Products.rowActions.delete")}>
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  {t("Products.table.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-center gap-3 text-purple-800">
        <button
          onClick={() => goto(page - 1)}
          disabled={page === 1}
          className={`text-2xl ${page === 1 ? "opacity-30 cursor-not-allowed" : ""}`}
          aria-label={t("Products.paging.prev")}
        >
          «
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          return (
            <button
              key={p}
              onClick={() => goto(p)}
              className={`px-3 py-1 rounded border ${
                p === page
                  ? "border-purple-800 bg-purple-800 text-white"
                  : "border-purple-800"
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
          className={`text-2xl ${
            page === totalPages ? "opacity-30 cursor-not-allowed" : ""
          }`}
          aria-label={t("Products.paging.next")}
        >
          »
        </button>
      </div>

      {/* Modal Add/View/Edit */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="mt-6 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold text-blue-800">
                <span className="mr-2">{t("Products.modal.titleEntity")}</span>
                <span className="mx-1 text-blue-500">→</span>
                <span className="font-semibold">
                  {isAdd ? t("Products.modal.mode.add") : isView ? t("Products.modal.mode.view") : t("Products.modal.mode.edit")}
                </span>
              </div>
              <button
                className="text-2xl leading-none text-gray-400 hover:text-gray-600"
                onClick={() => setOpen(false)}
                aria-label={t("Products.modal.close")}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Products.form.productId")}</div>
                  <input
                    name="id"
                    value={form.id}
                    onChange={onChange}
                    className={isView ? inputRO : inputCls}
                    readOnly={isView}
                  />
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Products.form.productName")}</div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className={isView ? inputRO : inputCls}
                    readOnly={isView}
                  />
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Products.form.price")}</div>
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={onChange}
                    className={isView ? inputRO : inputCls}
                    readOnly={isView}
                  />
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">{t("Products.form.qty")}</div>
                  <input
                    type="number"
                    min="0"
                    name="qty"
                    value={form.qty}
                    onChange={onChange}
                    className={isView ? inputRO : inputCls}
                    readOnly={isView}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="text-sm text-blue-700 mb-1">{t("Products.form.category")}</div>
                  <input
                    name="cat"
                    value={form.cat}
                    onChange={onChange}
                    className={isView ? inputRO : inputCls}
                    readOnly={isView}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="text-sm text-blue-700 mb-1">{t("Products.form.desc")}</div>
                  <textarea
                    name="desc"
                    rows={4}
                    value={form.desc}
                    onChange={onChange}
                    className={isView ? inputRO : inputCls}
                    readOnly={isView}
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-gray-200 px-5 py-2 text-gray-800 hover:opacity-90"
                >
                  {t("Products.modal.cancel")}
                </button>
                {(isAdd || isEdit) && (
                  <button
                    type="submit"
                    className="rounded-md bg-purple-800 px-5 py-2 text-white hover:opacity-90"
                  >
                    {t("Products.modal.submit")}
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
                    {t("Products.modal.pdf")}
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
