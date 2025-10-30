// src/components/Sidebar.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Factory,
  ShoppingBag,
  Globe2,
  LifeBuoy,
  Wallet,
  Settings,
  ChevronRight,
  X,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  LogOut,
  LayoutDashboard, // ✅ ใช้ไอคอน Dashboard ที่ถูกต้อง
} from "lucide-react";
import { useTranslation } from "react-i18next"; // ✅ เพิ่ม i18n

function Sidebar({ isOpen, onClose, onCollapsedChange }) {
  const { t } = useTranslation(); // ✅ ใช้งานแปล
  const navigate = useNavigate();

  const menuItems = [
    { key: "home", icon: <Home className="h-5 w-5" />, label: t("menu.home"), to: "/homepage" },
    { key: "dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: t("menu.dashboard"), to: "/dashboard" },
    { key: "attendance", icon: <Clock className="h-5 w-5" />, label: t("menu.attendance"), to: "/attendance" },
    { key: "hr", icon: <Clock className="h-5 w-5" />, label: t("menu.hr"), to: "/hr" },
    {
      key: "sales",
      icon: <ShoppingCart className="h-5 w-5" />,
      label: t("menu.sales"),
      to: "/sales",
      children: [
        { label: t("menu.quotation"), to: "/sales/quotation" },
        { label: t("menu.managePo"), to: "/sales/manage-po" },
        { label: t("menu.shippingInstruction"), to: "/sales/shippinginstruction" },
        { label: t("menu.inventoryCheck"), to: "/sales/inventorycheck" },
      ],
    },
    {
      key: "factory",
      icon: <Factory className="h-5 w-5" />,
      label: t("menu.factory"),
      to: "/factory",
      children: [
        { label: t("menu.factoryInventory"), to: "/factory/inventory" },
        { label: t("menu.order"), to: "/factory/order" },
        { label: t("menu.qc"), to: "/factory/qc" },
        { label: t("menu.planproduct"), to: "/factory/planproduct" },
      ],
    },
    {
      key: "purchasing",
      icon: <ShoppingBag className="h-5 w-5" />,
      label: t("menu.purchasing/international"),
      to: "/purchasing",
      children: [
        { label: t("menu.procurement"), to: "/purchasing/procurement" },
        { label: t("menu.inbound"), to: "/purchasing/InboundManagement" },
         { label: t("menu.managePurchase"), to: "/international/manage-purchase" },
        { label: t("menu.internationalSales"), to: "/international/sales" },
        { label: t("menu.productionRegistration"), to: "/international/production-registration" },
      ],
    },
   
    {
      key: "service",
      icon: <LifeBuoy className="h-5 w-5" />,
      label: t("menu.service"),
      to: "/service",
      children: [
        { label: t("menu.serviceCenter"), to: "/service/servicecenter" },
        { label: t("menu.repair"), to: "/service/repair" },
      ],
    },
    {
      key: "accounting",
      icon: <Wallet className="h-5 w-5" />,
      label: t("menu.accounting"),
      to: "/accounting",
      children: [
        { label: t("menu.issueInvoice"), to: "/accounting/issue-invoice" },
        { label: t("menu.linkAccounting"), to: "/accounting/link-accounting" },
      ],
    },
    {
      key: "master",
      icon: <Settings className="h-5 w-5" />,
      label: t("menu.master"),
      to: "/master",
      children: [
        { label: t("menu.products"), to: "/master/products" },
        { label: t("menu.customers"), to: "/master/customers" },
        { label: t("menu.suppliers"), to: "/master/suppliers" },
      ],
    },
    {
      key: "settings",
      icon: <Settings className="h-5 w-5" />,
      label: t("menu.settings"),
      to: "/settings",
      children: [{ label: t("menu.userManagement"), to: "/" }],
    },
  ];

  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
  );
  useEffect(() => {
    const mm = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mm.addEventListener?.("change", handler) ?? mm.addListener(handler);
    return () =>
      mm.removeEventListener?.("change", handler) ?? mm.removeListener(handler);
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const [openKey, setOpenKey] = useState(null);
  const toggleOpen = (key) => setOpenKey((k) => (k === key ? null : key));

  const sidebarWidthClass = useMemo(() => {
    if (!isDesktop) return "w-64";
    return collapsed ? "w-16" : "w-64";
  }, [isDesktop, collapsed]);

  const showLabel = (desktopCollapsed) =>
    !isDesktop ? true : !desktopCollapsed;
  const centerWhenCollapsedClass =
    isDesktop && collapsed ? "justify-center" : "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-[#394a78] text-white shadow-xl transform transition-transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${sidebarWidthClass}`}
      >
        <div
          className={`px-6 py-6 flex items-center ${
            isDesktop && collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`text-center ${
              isDesktop && !collapsed ? "w-full" : "w-auto"
            } text-sm font-bold tracking-wider`}
          >
            {isDesktop && collapsed ? "SK" : "SYSTEM KANOU"}
          </div>
          <button
            className="lg:hidden absolute right-3 top-3 text-white/80 hover:text-white"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="text-[15px] pb-20">
          {menuItems.map((item) => {
            const hasChildren = !!item.children;
            const isOpened = openKey === item.key;

            if (!hasChildren) {
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`px-6 py-3 flex items-center gap-3 hover:bg-[#2f3d66] transition ${centerWhenCollapsedClass}`}
                  onClick={!isDesktop ? onClose : undefined}
                  title={isDesktop && collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {showLabel(collapsed) && <span>{item.label}</span>}
                </Link>
              );
            }

            return (
              <div key={item.key} className="group">
                <div
                  className={`flex items-stretch hover:bg-[#2f3d66] transition ${
                    isDesktop && collapsed ? "justify-center" : ""
                  }`}
                >
                  <Link
                    to={item.to || "#"}
                    className={`flex-1 px-6 py-3 flex items-center gap-3 ${centerWhenCollapsedClass}`}
                    onClick={!isDesktop ? onClose : undefined}
                    title={isDesktop && collapsed ? item.label : undefined}
                  >
                    {item.icon}
                    {showLabel(collapsed) && <span>{item.label}</span>}
                  </Link>

                  {showLabel(collapsed) && (
                    <button
                      className="p-1.5 shrink-0 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleOpen(item.key);
                      }}
                    >
                      <ChevronRight
                        className={`h-5 w-5 text-indigo-200 transition-transform duration-200 ease-in-out
                          ${isOpened ? "rotate-90" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {isOpened && (!isDesktop || (isDesktop && !collapsed)) && (
                  <ul className="pl-10 pr-6 pb-2 space-y-2 text-white/85">
                    {item.children.map((c, i) => (
                      <li key={i}>
                        <Link
                          to={c.to}
                          className="block hover:underline"
                          onClick={!isDesktop ? onClose : undefined}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-6 py-3 bg-[#2f3d66] hover:bg-red-600 text-white transition ${centerWhenCollapsedClass}`}
          >
            <LogOut className="h-5 w-5" />
            {showLabel(collapsed) && <span>{t("menu.logout")}</span>}
          </button>
        </div>

       <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex absolute -right-3 top-4 items-center justify-center w-6 h-6 rounded-full bg-[#394a78] border border-white/30 shadow hover:bg-[#2f3d66]"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
