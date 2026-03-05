export const metadata = {
  title: 'My Bookings',
  description: 'View and manage your flight bookings.',
};

import BookingHistory from '../../../components/BookingHistory';

export default function BookingHistoryPage() {
  return (
    <div className="container section">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
          View and manage your flight bookings
        </p>
      </div>
      <BookingHistory />
    </div>
  );
}
