import React from "react";
import PageHeader from "../../components/PageHeader";
import { useTranslation } from "react-i18next";

function LinkAccounting() {
  const { t } = useTranslation();

  return (
    <div>
      {/* ใช้คีย์ที่มีคำนำหน้าไฟล์ */}
      <PageHeader title={t("LinkAccounting.title")} />
      <div>{t("LinkAccounting.body")}</div>
    </div>
  );
}

export default LinkAccounting;
