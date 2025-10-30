import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const fmtTHB = (n) =>
  (Number(n) || 0).toLocaleString("th-TH", { maximumFractionDigits: 0 });

export default function InvoiceAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    invoiceNo: "",
    invoiceDate: "",
    dueDate: "",
    poRef: "",
    remark: "",
  });

  const [items, setItems] = useState([
    { no: 1, description: "", qty: 2, price: 12500 },
    { no: 2, description: "", qty: 5, price: 2900 },
    { no: 3, description: "", qty: 10, price: 120 },
    { no: 4, description: "", qty: "", price: "" },
    { no: 5, description: "", qty: "", price: "" },
  ]);

  const totals = useMemo(() => {
    const lines = items
      .map((it) => (Number(it.qty) || 0) * (Number(it.price) || 0))
      .slice(0, 3);
    const sub = lines.reduce((a, b) => a + b, 0);
    const vat = Math.round(sub * 0.07);
    const grand = sub + vat;
    return { sub, vat, grand, lines };
  }, [items]);

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onChangeItem = (idx, key, value) => {
    setItems((arr) => {
      const cp = [...arr];
      cp[idx] = { ...cp[idx], [key]: value };
      return cp;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Invoice payload:", { form, items, totals });
    navigate("/accounting/issue-invoice");
  };

  return (
    <div className="">
      {/* ✅ ใช้ key เจาะจงตามไฟล์ */}
      <PageHeader title={t("invoiceAddTitle")} />

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-5 w-full max-w-6xl rounded-2xl bg-white p-2 sm:p-4"
      >
        {/* Customer / Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xl font-semibold text-blue-700 mb-2">
              {t("customerInfo")}
            </div>
            <div className="text-sm leading-6">
              <div>Japansystem Co., Ltd.</div>
              <div>123 Sukhumvit Road, Klongtoey, Bangkok 10110</div>
              <div>
                <span className="font-semibold text-blue-700">{t("taxNo")}</span> :
                0123456789012
              </div>
            </div>
          </div>

          <div>
            <div className="text-xl font-semibold text-blue-700 mb-2">
              {t("orderInfo")}
            </div>
            <div className="text-sm leading-6">
              <div>Japansystem Co., Ltd.</div>
              <div>123 Sukhumvit Road, Klongtoey, Bangkok 10110</div>
              <div>
                <span className="font-semibold text-blue-700">{t("taxNo")}</span> :
                0123456789012
              </div>
            </div>
          </div>
        </div>

        <div className="my-3 border-t-2 border-blue-200" />

        {/* Invoice No / Dates / PO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-blue-700 mb-1">{t("invoiceNo")}</div>
            <input
              name="invoiceNo"
              value={form.invoiceNo}
              onChange={onChangeForm}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
            />
          </div>
          <div>
            <div className="text-sm text-blue-700 mb-1">{t("invoiceDate")}</div>
            <input
              type="date"
              name="invoiceDate"
              value={form.invoiceDate}
              onChange={onChangeForm}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
            />
          </div>
          <div>
            <div className="text-sm text-blue-700 mb-1">{t("dueDate")}</div>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={onChangeForm}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
            />
          </div>
          <div>
            <div className="text-sm text-blue-700 mb-1">{t("poRef")}</div>
            <input
              name="poRef"
              value={form.poRef}
              onChange={onChangeForm}
              className="w-full rounded-md border border-blue-200 px-3 py-2"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto rounded-lg">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border px-3 py-2 w-16 text-left">No</th>
                <th className="border px-3 py-2 text-left">{t("colDescription")}</th>
                <th className="border px-3 py-2 w-40 text-center">{t("colQty")}</th>
                <th className="border px-3 py-2 w-40 text-right">{t("colPrice")}</th>
                <th className="border px-3 py-2 w-44 text-right">{t("colAmount")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const line = (Number(it.qty) || 0) * (Number(it.price) || 0);
                return (
                  <tr key={idx} className="bg-white">
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">
                      <input
                        value={it.description}
                        onChange={(e) =>
                          onChangeItem(idx, "description", e.target.value)
                        }
                        className="w-full outline-none"
                      />
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={it.qty}
                        onChange={(e) =>
                          onChangeItem(idx, "qty", e.target.value)
                        }
                        className="w-full text-center outline-none"
                      />
                    </td>
                    <td className="border px-3 py-2 text-right">
                      <input
                        type="number"
                        min="0"
                        value={it.price}
                        onChange={(e) =>
                          onChangeItem(idx, "price", e.target.value)
                        }
                        className="w-full text-right outline-none"
                      />
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {fmtTHB(line)}
                    </td>
                  </tr>
                );
              })}

              {/* Totals */}
              <tr className="bg-gray-100 font-medium">
                <td className="border px-3 py-2" colSpan={4}>
                  {t("subtotal")}
                </td>
                <td className="border px-3 py-2 text-right">
                  {fmtTHB(totals.sub)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border px-3 py-2" colSpan={4}>
                  {t("vat")}
                </td>
                <td className="border px-3 py-2 text-right">
                  {fmtTHB(totals.vat)} THB
                </td>
              </tr>
              <tr className="bg-gray-100 font-semibold">
                <td className="border px-3 py-2" colSpan={4}>
                  {t("total")}
                </td>
                <td className="border px-3 py-2 text-right">
                  {fmtTHB(totals.grand)} THB
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remark */}
        <div className="mt-6">
          <div className="text-sm text-blue-700 mb-1">{t("remark")}</div>
          <textarea
            rows={4}
            name="remark"
            value={form.remark}
            onChange={onChangeForm}
            className="w-full rounded-md border border-blue-200 px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/accounting/issue-invoice")}
            className="px-6 h-10 rounded-md bg-gray-200 text-gray-800 hover:opacity-95"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="rounded-md bg-purple-800 px-5 py-2 text-white hover:opacity-90"
          >
            {t("submit")}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Export to PDF", { items });
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
