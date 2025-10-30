import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ i18n

const LEAVE_TYPES = [
  "sickLeave",
  "personalLeave",
  "paidLeave",
  "emergencyLeave",
  "otherLeave",
];

function Leave() {
  const { t } = useTranslation();
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    if (!type) return alert(t("mustSelectLeaveType"));

    const leavePayload = { type: t(type), reason, nonce: Date.now() };

    navigate("/attendance", { state: { leavePayload } });
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="flex justify-center items-start bg-white px-4 py-8 md:py-12">
      <form
        onSubmit={handleSave}
        className="w-full max-w-3xl md:max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          {t("leavetitle")}
        </h2>
        <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">
          {t("description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Leave type */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-800 mb-3">
              {t("leaveTypeLabel")} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEAVE_TYPES.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="leaveType"
                    value={key}
                    checked={type === key}
                    onChange={(e) => setType(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="text-sm md:text-base text-gray-900">
                    {t(key)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-800 mb-3">
              {t("reasonLabel")}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder={t("reasonPlaceholder")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-3 rounded-xl border border-gray-300 bg-gray-100 hover:bg-gray-200 text-sm md:text-base"
          >
            {t("cancelBtn")}
          </button>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm md:text-base"
          >
            {t("saveBtn")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Leave;
