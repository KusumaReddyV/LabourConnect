import DashboardLayout from '../../layouts/DashboardLayout';

const navItems = [
  { to: '/labour/dashboard', label: 'Overview', icon: 'fa-solid fa-chart-pie', end: true },
  { to: '/labour/dashboard/requests', label: 'Job Requests', icon: 'fa-solid fa-inbox' },
  { to: '/labour/dashboard/jobs', label: 'My Jobs', icon: 'fa-solid fa-briefcase' },
  { to: '/labour/dashboard/profile', label: 'Edit Profile', icon: 'fa-solid fa-user-pen' },
  { to: '/labour/dashboard/notifications', label: 'Notifications', icon: 'fa-solid fa-bell' },
];

export default function LabourDashboardLayout() {
  return <DashboardLayout title="Labour Dashboard" navItems={navItems} role="labour" />;
}
