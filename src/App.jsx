// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Inoutwork from "./pages/Enterwork";
import Leave from "./pages/Leave";
import Hr from "./pages/Hr";
import Dashbord from "./pages/Dashbord";
import Workload from "./pages/Workload";

// Accounting
import Accounting from "./pages/accounting/Account";
import IssueInvoice from "./pages/accounting/IssueInvoice";
import InvoiceAdd from "./pages/accounting/InvoiceAdd";
import LinkAccounting from "./pages/accounting/LinkAccounting";

// Factory
import Factory from "./pages/factory/Factory";
import InventoryManagement from "./pages/factory/InventoryManagement";
import SerialNumber from "./pages/factory/SerialNumber";
import SerialNumberAdd from "./pages/factory/SerialNumberAdd";
import Qc from "./pages/factory/Qc";
import QcAdd from "./pages/factory/QcAdd";
import Planproduct from "./pages/factory/Planproduct";

// International
import International from "./pages/international/International";
import IntlSales from "./pages/international/IntlSales";
import ManagePurchase from "./pages/international/ManagePurchase";
import ProductionRegistration from "./pages/international/ProductionRegistration";
import DashboardInter from "./pages/international/DashboardInter";

// Purchasing
import Procurement from "./pages/purchasing/Procurement";
import Purchasing from "./pages/purchasing/Purchasing";
import InboundManagement from "./pages/purchasing/InboundManagement";
import DashboardPurchasing from "./pages/purchasing/DashboardPurchasing";

// Sales
import ManagePo from "./pages/sales/ManagePo";
import Quotation from "./pages/sales/Quotation";
import QuotationAdd from "./pages/sales/QuotationAdd";
import Sales from "./pages/sales/Sales";
import DashboardSales from "./pages/sales/DashboardSales";

// Service
import Repair from "./pages/service/Repair";
import Service from "./pages/service/Service";
import DashboardService from "./pages/service/DashboardService";

// Master
import Master from "./pages/master/Master";
import Customers from "./pages/master/Customers";
import Products from "./pages/master/Products";
import Suppliers from "./pages/master/Suppliers";

// Settings
import Settings from "./pages/settings/Settings";
import ManagePoAdd from "./pages/sales/ManagePoAdd";
import ManagePoView from "./pages/sales/ManagePoView";
import ShippingInstruction from "./pages/sales/ShippingInstruction";
import ShippingInstructionAdd from "./pages/sales/ShippingInstructionAdd";
import InventoryCheck from "./pages/sales/InventoryCheck";
import InventoryCheckAdd from "./pages/sales/InventoryCheckAdd";
import ProcurementAdd from "./pages/purchasing/ProcurementAdd";
import ServiceCenter from "./pages/service/ServiceCenter";
import ServiceCenterAdd from "./pages/service/ServiceCenterAdd";

function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ไม่ต้องแสดง Navbar/Sidebar ในหน้า Login
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCollapsedChange={setCollapsed}
      />
      <div
        className={`flex-1 flex flex-col transition-[margin] duration-200 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Login เป็นหน้าแรก */}
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/" element={<Login />} />
          <Route path="/attendance" element={<Inoutwork />} />
          <Route path="/hr" element={<Hr />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/dashboard" element={<Dashbord />} />
          <Route path="/workload" element={<Workload />} />

          {/* Home */}
          <Route path="/homepage" element={<Homepage />} />

          {/* Accounting */}
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/accounting/issue-invoice" element={<IssueInvoice />} />
          <Route
            path="/accounting/issue-invoice/add"
            element={<InvoiceAdd />}
          />
          <Route
            path="/accounting/link-accounting"
            element={<LinkAccounting />}
          />

          {/* Factory */}
          <Route path="/factory" element={<Factory />} />
          <Route path="/factory/inventory" element={<InventoryManagement />} />
          <Route path="/factory/order" element={<SerialNumber />} />
          <Route path="/factory/order/add" element={<SerialNumberAdd />} />
          <Route path="/factory/qc" element={<Qc />} />
          <Route path="/factory/qc/add" element={<QcAdd />} />
          <Route path="/factory/planproduct" element={<Planproduct />} />
          {/* <Route path="/factory/dashboard" element={<DashboardFactory />} /> */}

          {/* International */}
          <Route path="/international" element={<International />} />
          <Route path="/international/sales" element={<IntlSales />} />
          <Route
            path="/international/manage-purchase"
            element={<ManagePurchase />}
          />
          <Route
            path="/international/production-registration"
            element={<ProductionRegistration />}
          />
          <Route path="/international/dashboard" element={<DashboardInter />} />

          {/* Purchasing */}
          <Route path="/purchasing" element={<Purchasing />} />
          <Route path="/purchasing/procurement" element={<Procurement />} />
          <Route
            path="/purchasing/procurement/add"
            element={<ProcurementAdd />}
          />
          <Route
            path="/purchasing/inboundmanagement"
            element={<InboundManagement />}
          />
          {/* <Route
            path="/purchasing/dashboard"
            element={<DashboardPurchasing />}
          /> */}

          {/* Sales */}
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/quotation" element={<Quotation />} />
          <Route path="/sales/quotation/add" element={<QuotationAdd />} />
          <Route path="/sales/manage-po" element={<ManagePo />} />
          <Route path="/sales/manage-po/add" element={<ManagePoAdd />} />
          <Route path="/sales/manage-po/view" element={<ManagePoView />} />
          <Route
            path="/sales/shippinginstruction"
            element={<ShippingInstruction />}
          />
          <Route
            path="/sales/shippinginstruction/add"
            element={<ShippingInstructionAdd />}
          />
          <Route path="/sales/inventorycheck" element={<InventoryCheck />} />
          <Route
            path="/sales/inventorycheck/add"
            element={<InventoryCheckAdd />}
          />
          {/* <Route path="/sales/dashboard" element={<DashboardSales />} /> */}

          {/* Service */}
          <Route path="/service" element={<Service />} />
          <Route path="/service/repair" element={<Repair />} />
          <Route path="/service/servicecenter" element={<ServiceCenter />} />
          <Route
            path="/service/servicecenter/add"
            element={<ServiceCenterAdd />}
          />
          {/* <Route path="/service/dashboard" element={<DashboardService />} /> */}

          {/* Master */}
          <Route path="/master" element={<Master />} />
          <Route path="/master/suppliers" element={<Suppliers />} />
          <Route path="/master/customers" element={<Customers />} />
          <Route path="/master/products" element={<Products />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
