'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services';
import { formatDate, formatPrice } from '../utils/helpers';

export default function BookingHistory() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState('');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data.data.bookings);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await bookingService.cancel(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling('');
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  if (bookings.length === 0) {
    return (
      <div className="card text-center" style={{ padding: '3rem' }}>
        <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
          You have no bookings yet.
        </p>
        <Link href="/flights" className="btn btn-primary">
          Search Flights
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {bookings.map((booking) => {
        const flight = booking.flightId;
        return (
          <div key={booking._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                {flight && (
                  <>
                    <p style={{ fontWeight: '700', fontSize: '1rem' }}>
                      {flight.airline} {flight.flightNumber}
                    </p>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {flight.origin} → {flight.destination}
                    </p>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                      {formatDate(flight.departureTime)} · Seat {booking.seatNumber}
                    </p>
                  </>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.5rem' }}>
                  ID: {booking._id}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.125rem' }}>
                  {formatPrice(booking.totalAmount)}
                </p>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                  <span className={`badge badge-${booking.paymentStatus}`}>{booking.paymentStatus}</span>
                </div>

                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  {booking.status === 'pending' && (
                    <Link
                      href={`/booking/confirmation/${booking._id}`}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                    >
                      Pay Now
                    </Link>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancelling === booking._id}
                      className="btn btn-danger"
                      style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                    >
                      {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
