'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services';
import { formatPrice } from '../utils/helpers';
import SeatMap from './SeatMap';

export default function BookingForm({ flight }) {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [form, setForm] = useState({
    passengerName: user?.name || '',
    passengerEmail: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!selectedSeat) {
      setError('Please select a seat from the seat map on the left.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await bookingService.create({
        flightId: flight._id,
        seatNumber: selectedSeat,
        passengerName: form.passengerName,
        passengerEmail: form.passengerEmail,
      });
      const bookingId = res.data.data.booking._id;
      router.push(`/booking/confirmation/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Select Seat</h3>
        <SeatMap seatMap={flight.seatMap} flightId={flight._id} onSeatSelect={setSelectedSeat} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Passenger Name</label>
          <input
            type="text"
            className="form-input"
            value={form.passengerName}
            onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
            placeholder="Full name as on ID"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Passenger Email</label>
          <input
            type="email"
            className="form-input"
            value={form.passengerEmail}
            onChange={(e) => setForm({ ...form, passengerEmail: e.target.value })}
            placeholder="email@example.com"
            required
          />
        </div>

        {selectedSeat && (
          <div style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>Seat {selectedSeat}</span>
              <span>{formatPrice(flight.price)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginTop: '0.5rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>{formatPrice(flight.price)}</span>
            </div>
          </div>
        )}

        {!user ? (
          <button
            type="button"
            className="btn btn-primary btn-full btn-lg"
            onClick={() => router.push('/auth/login')}
          >
            Sign In to Book
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading || !selectedSeat}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        )}
      </form>
    </div>
  );
}
