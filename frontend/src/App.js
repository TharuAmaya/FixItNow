// REQUIRED CSS
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { Routes, Route } from 'react-router-dom';
import React from 'react';
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

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          {/*<Route path="/" element={<MaintenanceCoordinatorDashboard />} />*/}
          <Route path="/dashboard" element={<MaintenanceCoordinatorDashboard />} />
          <Route path="/overview" element={<TaskOverview />} />
          <Route path="/overview/:id" element={<UpdateTask />} />
          <Route path="/technician-management" element={<TechnicianManagement />} />
          <Route path="/task-assignment" element={<ManualTaskAssignment />} />
          <Route path="/send-pdf" element={<SendPdf />} />
          <Route path="/performance-reports" element={<PerformanceReports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/" element={<TechnicianDashboard />} />
          <Route path="/tech-dashboard" element={<TechnicianDashboard />} />
          <Route path="/tech-overview" element={<TechTaskOverview />} />
          <Route path="/tech-overview/:id" element={<TaskDetails />} />
          <Route path="/tech-notifications" element={<TechNotifications />} />
          <Route path="/tech-logout" element={<TechLogout />} />

          {/*<Route path="/" element={<Home />} />*/}
          <Route path="/home" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/request" element={<div>Maintenance Request Page (To be implemented)</div>} />
          <Route path="/spare-parts" element={<div>Spare Parts Page (To be implemented)</div>} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/sign-up" element={<div>Sign Up Page (To be implemented)</div>} />
          <Route path="/login" element={<div>Log In Page (To be implemented)</div>} />

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
