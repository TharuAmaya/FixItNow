// REQUIRED CSS
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import MaintenanceCoordinatorDashboard from './Components/MaintenanceCoordinatorDashboard/MaintenanceCoordinatorDashboard';
import TaskOverview from './Components/TaskOverview/TaskOverview';
import TechnicianManagement from './Components/TechnicianManagement/TechnicianManagement';
import ManualTaskAssignment from './Components/ManualTaskAssignment/ManualTaskAssignment';
import Notifications from './Components/Notifications/Notifications';
import Logout from './Components/Logout/Logout';
import UpdateTask from './Components/UpdateTask/UpdateTask';
import SendPdf from './Components/SendPdf/SendPdf';
import PerformanceReports from './Components/PerformanceReports/PerformanceReports';

import TechnicianDashboard from './Components/TechnicianDashboard/TechnicianDashboard';
import TechTaskOverview from "./Components/TechTaskOverview/TechTaskOverview";
import TaskDetails from "./Components/TaskDetails/TaskDetails";
import TechNotifications from "./Components/TechNotifications/TechNotifications";
import TechLogout from "./Components/Logout/TechLogout";

import Home from "./Components/SitePages/Home";
import AboutUs from "./Components/SitePages/AboutUs";
// import Request from "./Components/SitePages/Request";
// import SpareParts from "./Components/SitePages/SpareParts";
import ContactUs from "./Components/SitePages/ContactUs";
// import SignUp from "./Components/SitePages/SignUp";
// import Login from "./Components/SitePages/Login";

//Thanuja
import SupplierLIst from "./ComponentT/SupplierList/supplierlist";
import PurchaseORders from "./ComponentT/purchaseorderdetails/purchaseorderdetails";
import SupplierREsponse from "./ComponentT/SupplierResponse/AdminSupResponse";
import AddSupplier from "./ComponentT/AddSupplier/AddSupplier";
import UpdateSupplier from "./ComponentT/UpdateSupplier/UpdateSupplier";
import AddOrder from "./ComponentT/AddPurchaseOrder/AddPurchaseOrder";
import UpdateOrders from "./ComponentT/UpdatePurchaseOrder/UpdatePurchaseOrder";
import Nav from "./ComponentT/NavT/navT";  
import SupplierProfile from "./ComponentT/SupplierProfileT/SupplierProfile";
import AddEditProfile from "./ComponentT/SupplierProfile/EditSupplierProfile";
import SupplierOrder from "./ComponentT/SupplierPurchaseOrders/SupplierPurchaseOrders";
import AddResponse from "./ComponentT/AddResponse/AddResponse";
import NavS from "./ComponentT/NavSupplier/NavSupplier";  
import SupplierResponse from "./ComponentT/SupplierResponses/SupplierResponses";
import LOgin from "./ComponentT/Login/Login";
import Admin from "./ComponentT/admin1/admin";
import NotificationBell from "./ComponentT/NotificationBell/NotificationBell";  
import NotificationPart from "./ComponentT/Notifications/notificationpart";
import SIdebar from "./ComponentT/SideBar/Sidebar";

function App() {

  //Thanuja
const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role state from localStorage
  const [role, setRoleState] = useState(() => localStorage.getItem("role") || "");

  // Setter that also updates localStorage
  const setRole = (roleValue) => {
    localStorage.setItem("role", roleValue);
    setRoleState(roleValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    setRoleState("");
  };
const toggleSidebar = () => {
  setSidebarOpen((prev) => !prev);
};



  // Show nav admin
  const showNav =
    role === "admin" &&
    (location.pathname.startsWith("/Supplierlist") ||
      location.pathname.startsWith("/Purchaseorders") ||
      location.pathname === "/add-supplier" ||
      location.pathname.startsWith("/add-order") ||
      location.pathname.startsWith("/Supplierresponse") ||
      
      location.pathname.startsWith("/notifi") ||
      location.pathname.startsWith("/Updateorder")) &&
    // Exclude main application pages that have their own nav
    !location.pathname.startsWith("/notifications") &&
    !location.pathname.startsWith("/overview") &&
    !location.pathname.startsWith("/dashboard") &&
    !location.pathname.startsWith("/technician-management") &&
    !location.pathname.startsWith("/task-assignment") &&
    !location.pathname.startsWith("/send-pdf") &&
    !location.pathname.startsWith("/performance-reports") &&
    !location.pathname.startsWith("/tech-") &&
    !location.pathname.startsWith("/home") &&
    !location.pathname.startsWith("/about-us") &&
    !location.pathname.startsWith("/contact-us") &&
    location.pathname !== "/" &&
    location.pathname !== "/logout";

  // Show nav supplier
  const showNavS =
    role === "supplier" &&
    (location.pathname === "/add" ||
      location.pathname === "/profile" ||
      location.pathname === "/supplierorder" ||
      location.pathname.startsWith("/add-response") ||
      location.pathname === "/responses" ||
      location.pathname.startsWith("/notifica") ||
      location.pathname.startsWith("/edit/"));

  // Only show login for specific ComponentT routes that require authentication
  const requiresAuth = location.pathname.startsWith("/Supplierlist") ||
    location.pathname.startsWith("/Purchaseorders") ||
    location.pathname === "/add-supplier" ||
    location.pathname.startsWith("/add-order") ||
    location.pathname.startsWith("/Supplierresponse") ||
    location.pathname.startsWith("/notifi") ||
    location.pathname.startsWith("/Updateorder") ||
    location.pathname === "/add" ||
    location.pathname === "/profile" ||
    location.pathname === "/supplierorder" ||
    location.pathname.startsWith("/add-response") ||
    location.pathname === "/responses" ||
    location.pathname.startsWith("/notifica") ||
    location.pathname.startsWith("/edit/");

  // Show login only if accessing protected routes without authentication
  if (!role && requiresAuth) return <LOgin setRole={setRole} />;

  return (
    <div>
      {showNav && <Nav handleLogout={handleLogout} toggleSidebar={toggleSidebar} />}
      {showNavS && <NavS handleLogout={handleLogout} />}

      {sidebarOpen && (role === "admin" && (location.pathname.startsWith("/Supplierlist") ||
        location.pathname.startsWith("/Purchaseorders") ||
        location.pathname === "/add-supplier" ||
        location.pathname.startsWith("/add-order") ||
        location.pathname.startsWith("/Supplierresponse") ||
        location.pathname.startsWith("/notifi") ||
        location.pathname.startsWith("/Updateorder") ||
        location.pathname === "/sidebar" ||
        location.pathname.startsWith("/ADmin"))) && <SIdebar closeSidebar={toggleSidebar} />}

      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />

          {role === "coordinator" && (
            <>
              <Route path="/dashboard" element={<MaintenanceCoordinatorDashboard />} />
              <Route path="/overview" element={<TaskOverview />} />
              <Route path="/overview/:id" element={<UpdateTask />} />
              <Route path="/technician-management" element={<TechnicianManagement />} />
              <Route path="/task-assignment" element={<ManualTaskAssignment />} />
              <Route path="/send-pdf" element={<SendPdf />} />
              <Route path="/performance-reports" element={<PerformanceReports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/logout" element={<Logout />} />
            </>
          )}

          {role === "technician" && (
            <>
              {/*<Route path="/" element={<TechnicianDashboard />} />*/}
              <Route path="/tech-dashboard" element={<TechnicianDashboard />} />
              <Route path="/tech-overview" element={<TechTaskOverview />} />
              <Route path="/tech-overview/:id" element={<TaskDetails />} />
              <Route path="/tech-notifications" element={<TechNotifications />} />
              <Route path="/tech-logout" element={<TechLogout />} />
            </>
          )}

          <Route path="/home" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/request" element={<div>Maintenance Request Page (To be implemented)</div>} />
          <Route path="/spare-parts" element={<div>Spare Parts Page (To be implemented)</div>} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/sign-up" element={<div>Sign Up Page (To be implemented)</div>} />
          <Route path="/login" element={<LOgin setRole={setRole} />} />

{/*Thanuja*/}
 {role === "admin" && (
          <>
            <Route path="/sidebar" element={<SIdebar closeSidebar={() => {}} />} />

            <Route path="/Supplierlist" element={<SupplierLIst />} />
            <Route path="/Supplierlist/:id" element={<UpdateSupplier />} />
            <Route path="/Purchaseorders" element={<PurchaseORders />} />
            <Route path="/add-supplier" element={<AddSupplier />} />
            <Route path="/add-order" element={<AddOrder />} />
            <Route path="/Updateorder/:id" element={<UpdateOrders />} />
            <Route path="/Supplierresponse" element={<SupplierREsponse />} />
            <Route path="/notifi" element={<NotificationBell />} />
            <Route path="./ADmin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/Supplierlist" />} />
          </>
        )}

        {role === "supplier" && (
          <>
            <Route path="/add-response/:id" element={<AddResponse />} />
            <Route path="/responses" element={<SupplierResponse />} />
            <Route path="/profile" element={<SupplierProfile />} />
            <Route path="/add" element={<AddEditProfile />} />
            <Route path="/edit/:id" element={<AddEditProfile />} />
            <Route path="/supplierorder" element={<SupplierOrder />} />
            <Route path="/notifica" element={<NotificationPart />} />
            <Route path="*" element={<Navigate to="/profile" />} />
          </>
        )}

         <Route path="/LLogin" element={<LOgin setRole={setRole} />} />

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
