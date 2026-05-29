import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../auth/ProtectedRoute';

import Home from '../pages/Home';
import Start from '../pages/Start';
import Login from '../pages/Login';
import RegisterLabour from '../pages/RegisterLabour';
import RegisterClient from '../pages/RegisterClient';
import LabourProfile from '../pages/LabourProfile';
import Account from '../pages/Account';
import About from '../pages/About';
import ServicesPage from '../pages/ServicesPage';
import Helpdesk from '../pages/Helpdesk';

import LabourDashboardLayout from '../dashboards/labour/LabourDashboardLayout';
import LabourOverview from '../dashboards/labour/LabourOverview';
import LabourRequests from '../dashboards/labour/LabourRequests';
import LabourJobs from '../dashboards/labour/LabourJobs';
import LabourProfileEdit from '../dashboards/labour/LabourProfileEdit';
import LabourNotifications from '../dashboards/labour/LabourNotifications';

import ClientDashboardLayout from '../dashboards/client/ClientDashboardLayout';
import ClientOverview from '../dashboards/client/ClientOverview';
import ClientJobs from '../dashboards/client/ClientJobs';
import ClientFavourites from '../dashboards/client/ClientFavourites';
import ClientProfile from '../dashboards/client/ClientProfile';
import ClientNotifications from '../dashboards/client/ClientNotifications';

import AdminDashboardLayout from '../dashboards/admin/AdminDashboardLayout';
import AdminAnalytics from '../dashboards/admin/AdminAnalytics';
import AdminUsers from '../dashboards/admin/AdminUsers';
import AdminJobs from '../dashboards/admin/AdminJobs';
import AdminHelpdesk from '../dashboards/admin/AdminHelpdesk';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/labour" element={<RegisterLabour />} />
        <Route path="/register/client" element={<RegisterClient />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/helpdesk" element={<Helpdesk />} />
        <Route path="/browse" element={<Navigate to="/#workers" replace />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labour/:id"
          element={
            <ProtectedRoute roles={['client']} loginMessage="Sign in as a client to view worker profiles">
              <LabourProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/labour/dashboard"
        element={
          <ProtectedRoute roles={['labour']}>
            <LabourDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LabourOverview />} />
        <Route path="requests" element={<LabourRequests />} />
        <Route path="jobs" element={<LabourJobs />} />
        <Route path="profile" element={<LabourProfileEdit />} />
        <Route path="notifications" element={<LabourNotifications />} />
      </Route>

      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute roles={['client']}>
            <ClientDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientOverview />} />
        <Route path="jobs" element={<ClientJobs />} />
        <Route path="favourites" element={<ClientFavourites />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="notifications" element={<ClientNotifications />} />
        <Route path="browse" element={<Navigate to="/#workers" replace />} />
      </Route>

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminAnalytics />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="helpdesk" element={<AdminHelpdesk />} />
      </Route>

      <Route path="/client/services" element={<Navigate to="/login" replace />} />
      <Route path="/reviews" element={<Navigate to="/#testimonials" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
