import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next"; // ✅ i18n

function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleLang = () => {
    const newLang = i18n.language === "ja" ? "en" : "ja";
    i18n.changeLanguage(newLang);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      Swal.fire({
        icon: "success",
        title: t("loginSuccessTitle"),
        text: t("loginSuccessText", { user: username }),
        confirmButtonColor: "#38bdf8",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/attendance");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: t("loginFailTitle"),
        text: t("loginFailText"),
        confirmButtonColor: "#38bdf8",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-sky-200 relative">
      <button
        onClick={toggleLang}
        className="absolute top-4 right-4 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg text-sm shadow"
      >
        {i18n.language === "en" ? "English" : "日本語"}
      </button>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-sky-200">
        <h1 className="text-2xl font-bold text-sky-800 text-center mb-6">
          {t("login")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-sky-900 mb-2">
              {t("username")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-sky-400">
                <FaUser />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("enterUsername")}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 focus:outline-none bg-white shadow-inner"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sky-900 mb-2">
              {t("password")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-sky-400">
                <FaLock />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("enterPassword")}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-400 focus:outline-none bg-white shadow-inner"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-400 to-blue-400 text-white font-semibold py-3 rounded-xl shadow-md hover:from-sky-500 hover:to-blue-500 transition"
          >
            {t("login")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-sky-800">
          <p className="font-semibold">{t("testAccount")}:</p>
          <p>
            {t("username")}: <span className="font-mono">admin</span>
          </p>
          <p>
            {t("password")}: <span className="font-mono">1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
