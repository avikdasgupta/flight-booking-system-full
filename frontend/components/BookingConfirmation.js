'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services';
import { formatDate, formatPrice } from '../utils/helpers';

export default function BookingConfirmation({ bookingId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    fetchBooking();
  }, [user]);

  const fetchBooking = async () => {
    try {
      const res = await bookingService.getById(bookingId);
      setBooking(res.data.data.booking);
    } catch (err) {
      setError('Booking not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const res = await bookingService.confirm(bookingId);
      setBooking(res.data.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!booking) return null;

  const flight = booking.flightId;

  return (
    <div className="card">
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        {booking.status === 'confirmed' ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
              Booking Confirmed!
            </h1>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Booking Summary</h1>
          </>
        )}
        <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Booking ID: {booking._id}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem' }}>
        <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>Flight Details</h2>
        {flight && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div>
              <p style={{ color: 'var(--gray-500)' }}>Flight</p>
              <p style={{ fontWeight: '600' }}>{flight.airline} {flight.flightNumber}</p>
            </div>
            <div>
              <p style={{ color: 'var(--gray-500)' }}>Route</p>
              <p style={{ fontWeight: '600' }}>{flight.origin} → {flight.destination}</p>
            </div>
            <div>
              <p style={{ color: 'var(--gray-500)' }}>Departure</p>
              <p style={{ fontWeight: '600' }}>{formatDate(flight.departureTime)}</p>
            </div>
            <div>
              <p style={{ color: 'var(--gray-500)' }}>Seat</p>
              <p style={{ fontWeight: '600' }}>{booking.seatNumber}</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
        <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>Passenger Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
          <div>
            <p style={{ color: 'var(--gray-500)' }}>Name</p>
            <p style={{ fontWeight: '600' }}>{booking.passengerName}</p>
          </div>
          <div>
            <p style={{ color: 'var(--gray-500)' }}>Email</p>
            <p style={{ fontWeight: '600' }}>{booking.passengerEmail}</p>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Status</p>
            <span className={`badge badge-${booking.status}`}>{booking.status}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Total Amount</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              {formatPrice(booking.totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {booking.status === 'pending' && (
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={handleConfirm}
            className="btn btn-success btn-full btn-lg"
            disabled={confirming}
          >
            {confirming ? 'Processing Payment...' : 'Complete Payment & Confirm'}
          </button>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.5rem' }}>
            Secure payment simulation
          </p>
        </div>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => router.push('/booking/history')}
          className="btn btn-secondary"
          style={{ flex: 1 }}
        >
          My Bookings
        </button>
        <button
          onClick={() => router.push('/flights')}
          className="btn btn-primary"
          style={{ flex: 1 }}
        >
          Book Another
        </button>
      </div>
    </div>
  );
}
