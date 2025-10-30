import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";

function DashboardInter() {
  return (
    <div className="">
      <PageHeader title="国際部門 / ダッシュボード" />

      {/* 最新の見積もり */}
      <div className="mt-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold pr-3 bg-white">
            国際部門ダッシュボード
          </span>
          <div className="flex-1 border-b-4 border-indigo-500"></div>
        </div>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">見積番号</th>
              <th className="p-2 border">会社名</th>
              <th className="p-2 border">ステータス</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">QT-20250427-001</td>
              <td className="p-2 border">Company A</td>
              <td className="p-2 border text-indigo-700">送信済み</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2 border">QT-20250427-005</td>
              <td className="p-2 border">Company C</td>
              <td className="p-2 border text-red-600">却下</td>
            </tr>
            <tr>
              <td className="p-2 border">QT-20250427-007</td>
              <td className="p-2 border">Company B</td>
              <td className="p-2 border text-green-600">承認済み</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardInter;
