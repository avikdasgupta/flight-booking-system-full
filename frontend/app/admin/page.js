export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing flights and bookings.',
};

import AdminDashboard from '../../components/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="container section">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>
      <AdminDashboard />
    </div>
  );
}
