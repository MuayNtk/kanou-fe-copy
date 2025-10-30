// src/pages/Enterwork.jsx
import React, { useState, useEffect, useRef } from "react";
import { LogIn, LogOut, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Enterwork() {
  const { t } = useTranslation();

  const [time, setTime] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [searchDate, setSearchDate] = useState(""); // YYYY-MM-DD
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();

  const processedNoncesRef = useRef(new Set());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const payload = location.state?.leavePayload;
    if (!payload) return;

    const nonce = payload.nonce ?? JSON.stringify(payload);
    if (processedNoncesRef.current.has(nonce)) {
      if (location.state) navigate(location.pathname, { replace: true, state: {} });
      return;
    }
    processedNoncesRef.current.add(nonce);

    const now = new Date();
    const dateText = now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

    setRecords((prev) => [
      ...prev,
      { ts: now.getTime(), date: dateText, in: "-", out: "-", leave: payload.type, note: payload.reason?.trim() || "-" }
    ]);
    setPage(1);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.key, location.pathname, location.state, navigate]);

  const formatDateTime = (date) =>
    date.toLocaleString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const isoToDDMMYYYY = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const hasOpenCheckIn = records.some((r) => r.in !== "-" && r.out === "-");

  // === Actions ===
  const handleCheckIn = () => {
    if (hasOpenCheckIn) {
      Swal.fire(t("alreadyCheckedInTitle"), t("alreadyCheckedInText"), "info");
      return;
    }

    Swal.fire({
      title: t("confirmTitle"),
      text: t("confirmCheckIn"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("confirmCheckInBtn"),
      cancelButtonText: t("cancelBtn"),
    }).then((res) => {
      if (!res.isConfirmed) return;

      const now = new Date();
      setRecords((prev) => [
        ...prev,
        { ts: now.getTime(), date: formatDate(now), in: formatTime(now), out: "-", leave: "-", note: "-" },
      ]);
      setPage(1);
      Swal.fire(t("checkInSuccessTitle"), t("checkInSuccessText"), "success");
    });
  };

  const handleCheckOut = () => {
    if (!hasOpenCheckIn) return;

    Swal.fire({
      title: t("confirmTitle"),
      text: t("confirmCheckOut"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("confirmCheckOutBtn"),
      cancelButtonText: t("cancelBtn"),
    }).then((res) => {
      if (!res.isConfirmed) return;

      let didUpdate = false;
      const nowStr = formatTime(new Date());

      setRecords((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].in !== "-" && updated[i].out === "-") {
            updated[i] = { ...updated[i], out: nowStr };
            didUpdate = true;
            break;
          }
        }
        return updated;
      });

      setTimeout(() => {
        if (didUpdate) {
          Swal.fire(t("checkOutSuccessTitle"), t("checkOutSuccessText"), "success");
        } else {
          Swal.fire(t("noRecordTitle"), t("noRecordText"), "info");
        }
      }, 0);
    });
  };

  const handleLeave = () => navigate("/leave");

  const selectedDate = isoToDDMMYYYY(searchDate);
  const filteredRecords = records
    .filter((rec) => (!selectedDate ? true : rec.date === selectedDate))
    .sort((a, b) => b.ts - a.ts);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className=" h-full flex flex-col bg-white overflow-x-hidden">
      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h1>
        <p className="text-xl font-semibold text-sky-700">{formatDateTime(time)}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={handleCheckIn}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-green-500 text-white font-semibold text-lg shadow hover:bg-green-600 transition"
          >
            <LogIn className="h-6 w-6" />
            {t("checkInBtn")}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!hasOpenCheckIn}
            title={!hasOpenCheckIn ? t("mustCheckInFirst") : t("checkOutBtn")}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-red-500 text-white font-semibold text-lg shadow hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="h-6 w-6" />
            {t("checkOutBtn")}
          </button>

          <button
            onClick={handleLeave}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-yellow-400 text-white font-semibold text-lg shadow hover:bg-yellow-500 transition"
          >
            <Calendar className="h-6 w-6" />
            {t("leaveBtn")}
          </button>
        </div>
      </div>

      {/* Date filter */}
      <div className="px-4 sm:px-8 mb-3 flex items-center justify-end gap-2">
        <label className="text-sm text-gray-600">{t("dateLabel")}</label>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => {
            setSearchDate(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        {searchDate && (
          <button
            onClick={() => {
              setSearchDate("");
              setPage(1);
            }}
            className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
            title={t("clear")}
          >
            {t("clear")}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="w-full px-4 sm:px-8">
        <div className="mx-auto w-full max-w-[340px] sm:max-w-none">
          <div className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="overflow-x-auto overflow-y-auto max-h-[420px] rounded-lg sm:overflow-visible sm:max-h-none" role="region" aria-label="Attendance table">
              <table className="table-auto min-w-[560px] sm:min-w-0 sm:w-full text-xs sm:text-sm text-center whitespace-nowrap border border-gray-200 rounded-lg">
                <thead className="bg-gray-100 text-gray-700 uppercase text-[10px] sm:text-xs sticky top-0">
                  <tr>
                    <th className="px-3 py-2">{t("colDate")}</th>
                    <th className="px-3 py-2">{t("colIn")}</th>
                    <th className="px-3 py-2">{t("colOut")}</th>
                    <th className="px-3 py-2">{t("colLeave")}</th>
                    <th className="px-3 py-2">{t("colNote")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-6 text-center text-gray-400">
                        {t("noData")}
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{rec.date}</td>
                        <td className="px-3 py-2">{rec.in}</td>
                        <td className="px-3 py-2">{rec.out}</td>
                        <td className="px-3 py-2">{rec.leave}</td>
                        <td className="px-3 py-2">{rec.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded border border-gray-300 bg-gray-100 text-sm disabled:opacity-50"
                aria-label={t("prevPage")}
                title={t("prevPage")}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-700">
                {t("page")} {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded border border-gray-300 bg-gray-100 text-sm disabled:opacity-50"
                aria-label={t("nextPage")}
                title={t("nextPage")}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Enterwork;
