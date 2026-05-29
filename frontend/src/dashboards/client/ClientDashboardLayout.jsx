import DashboardLayout from '../../layouts/DashboardLayout';

const navItems = [
  { to: '/client/dashboard', label: 'Overview', icon: 'fa-solid fa-chart-pie', end: true },
  { to: '/#workers', label: 'Find Workers', icon: 'fa-solid fa-search' },
  { to: '/client/dashboard/jobs', label: 'My Jobs', icon: 'fa-solid fa-briefcase' },
  { to: '/client/dashboard/favourites', label: 'Favourites', icon: 'fa-solid fa-heart' },
  { to: '/client/dashboard/profile', label: 'Profile', icon: 'fa-solid fa-user' },
  { to: '/client/dashboard/notifications', label: 'Notifications', icon: 'fa-solid fa-bell' },
];

export default function ClientDashboardLayout() {
  return <DashboardLayout title="Client Dashboard" navItems={navItems} role="client" />;
}
