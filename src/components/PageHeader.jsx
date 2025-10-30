// src/components/PageHeader.jsx
import React from "react";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

function PageHeader({ title }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3">
      {/* ไอคอนบ้าน กดกลับไปหน้าแรก */}
      <Link to="/homepage" className="flex items-center">
        <Home className="h-5 w-5 text-black" />
      </Link>
      <span className="font-semibold text-black">{title}</span>
    </div>
  );
}

export default PageHeader;
