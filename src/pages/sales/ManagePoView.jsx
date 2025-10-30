// src/pages/sales/ManagePoView.jsx
import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const money0 = (n) =>
  (Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const toEnGB = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

export default function ManagePoView() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();

  // row จากหน้า List
  const row = state?.row ?? null;

  // fallback header เพื่อให้หน้าแสดงได้ถ้าไม่มี state
  const header = {
    customerName: row?.customer ?? "Japansystem Co., Ltd.",
    addressLine1:
      "123 Sukhumvit Road, Klongtoey Subdistrict, Klongtoey District,",
    addressLine2: "Bangkok 10110",
    taxId: "0123456789012",
    poNo: row?.poNo ?? "C-PO-20250429-001",
    approvedDate: row?.date ?? "2025-04-29",
    artist: "Mr. Somsak Jaidee",
  };

  // รายการสินค้า (ตัวอย่าง 3 แถว)
  const items = [
    { no: 1, description: "", qty: 2, unitPrice: 12500 },
    { no: 2, description: "", qty: 5, unitPrice: 2900 },
    { no: 3, description: "", qty: 10, unitPrice: 120 },
  ];

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0),
        0
      ),
    [items]
  );
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  return (
    <div>
      <PageHeader title={t("ManagePoView.pageTitle")} />

      {/* Top-right List button */}
      <div className="px-6 mt-3 flex justify-end">
        <Link
          to="/sales/manage-po"
          className="px-4 h-8 rounded-md bg-blue-100 text-blue-700 border border-blue-200 flex items-center"
        >
          {t("ManagePoView.list")}
        </Link>
      </div>

      <div className="px-6 pb-10">
        {/* Top blocks: Customer (left) / Order info (right) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Customer Data */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-700">
              {t("ManagePoView.customerInfo")}
            </h2>
            <div className="mt-3 text-gray-700 leading-relaxed">
              {header.customerName}
              <br />
              {header.addressLine1}
              <br />
              {header.addressLine2}
              <br />
              {t("ManagePoView.taxId")}: {header.taxId}
            </div>
          </div>

          {/* Order Information */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-700">
              {t("ManagePoView.orderInfo")}
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-y-2 text-gray-700">
              <div className="col-span-1">{t("ManagePoView.orderNo")}：</div>
              <div className="col-span-2 font-medium">{header.poNo}</div>

              <div className="col-span-1">{t("ManagePoView.approvedDate")}：</div>
              <div className="col-span-2">{toEnGB(header.approvedDate)}</div>

              <div className="col-span-1">{t("ManagePoView.handler")}：</div>
              <div className="col-span-2">{header.artist}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border text-left">{t("ManagePoView.th.desc")}</th>
                <th className="px-3 py-2 border text-center">{t("ManagePoView.th.qty")}</th>
                <th className="px-3 py-2 border text-right">{t("ManagePoView.th.unitPrice")}</th>
                <th className="px-3 py-2 border text-right">{t("ManagePoView.th.amount")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const lineTotal =
                  (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
                return (
                  <tr key={it.no}>
                    <td className="px-3 py-2 border text-center">{it.no}</td>
                    <td className="px-3 py-2 border">{it.description}</td>
                    <td className="px-3 py-2 border text-center">{it.qty}</td>
                    <td className="px-3 py-2 border text-right">
                      {money0(it.unitPrice)}
                    </td>
                    <td className="px-3 py-2 border text-right">
                      {money0(lineTotal)}
                    </td>
                  </tr>
                );
              })}

              {/* Summary rows (inside table) */}
              <tr className="bg-white">
                <td className="border px-3 py-2" colSpan={4}>
                  {t("ManagePoView.subtotal")}
                </td>
                <td className="border px-3 py-2 text-right">
                  {money0(subtotal)}
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border px-3 py-2" colSpan={4}>
                  {t("ManagePoView.vat")} 7%
                </td>
                <td className="border px-3 py-2 text-right">
                  {money0(vat)} THB
                </td>
              </tr>
              <tr className="bg-white font-semibold">
                <td className="border px-3 py-2" colSpan={4}>
                  {t("ManagePoView.grand")}
                </td>
                <td className="border px-3 py-2 text-right">
                  {money0(total)} THB
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom buttons */}
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 h-10 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {t("ManagePoView.back")}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("Export to PDF", { header, items });
              // TODO: export PDF logic
            }}
            className="px-4 h-10 rounded-md bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700"
          >
            <FiFileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
