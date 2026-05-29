import DashboardLayout from '../../layouts/DashboardLayout';

const navItems = [
  { to: '/admin/dashboard', label: 'Analytics', icon: 'fa-solid fa-chart-line', end: true },
  { to: '/admin/dashboard/users', label: 'Users', icon: 'fa-solid fa-users' },
  { to: '/admin/dashboard/jobs', label: 'Jobs', icon: 'fa-solid fa-briefcase' },
  { to: '/admin/dashboard/helpdesk', label: 'Helpdesk', icon: 'fa-solid fa-headset' },
];

export default function AdminDashboardLayout() {
  return <DashboardLayout title="Admin Panel" navItems={navItems} role="admin" />;
}
