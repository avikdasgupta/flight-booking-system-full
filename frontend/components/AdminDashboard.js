'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { flightService, bookingService } from '../services';
import { formatDate, formatPrice } from '../utils/helpers';

const AIRPORTS = ['DEL', 'BOM', 'BLR', 'CCU', 'MAA', 'HYD', 'AMD', 'PNQ', 'GOI', 'JAI'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('flights');
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flightForm, setFlightForm] = useState({
    flightNumber: '', airline: '', origin: '', destination: '',
    departureTime: '', arrivalTime: '', price: '', totalSeats: '',
  });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fr, br] = await Promise.all([
        flightService.getAll({ limit: 50 }),
        bookingService.getAll(),
      ]);
      setFlights(fr.data.data.flights);
      setBookings(br.data.data.bookings);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlight = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFormError('');
    setFormSuccess('');
    try {
      await flightService.create({
        ...flightForm,
        price: parseFloat(flightForm.price),
        totalSeats: parseInt(flightForm.totalSeats),
      });
      setFormSuccess('Flight created successfully!');
      setFlightForm({ flightNumber: '', airline: '', origin: '', destination: '', departureTime: '', arrivalTime: '', price: '', totalSeats: '' });
      await fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create flight.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {['flights', 'bookings', 'add-flight'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t === 'add-flight' ? '+ Add Flight' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'flights' && (
        <div>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>All Flights ({flights.length})</h2>
          {flights.length === 0 ? (
            <div className="card text-center"><p style={{ color: 'var(--gray-500)' }}>No flights yet.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {flights.map((f) => (
                <div key={f._id} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: '600' }}>{f.airline} · {f.flightNumber}</p>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                        {f.origin} → {f.destination} · {formatDate(f.departureTime)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '600', color: 'var(--primary)' }}>{formatPrice(f.price)}</p>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                        {f.availableSeats}/{f.totalSeats} seats
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>All Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <div className="card text-center"><p style={{ color: 'var(--gray-500)' }}>No bookings yet.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {bookings.map((b) => (
                <div key={b._id} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: '600' }}>{b.passengerName || b.userId?.name}</p>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                        {b.flightId?.origin} → {b.flightId?.destination} · Seat {b.seatNumber}
                      </p>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>ID: {b._id}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '600' }}>{formatPrice(b.totalAmount)}</p>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'add-flight' && (
        <div className="card" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontWeight: '600', marginBottom: '1.5rem' }}>Add New Flight</h2>
          {formError && <div className="alert alert-error">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

          <form onSubmit={handleCreateFlight}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Flight Number</label>
                <input className="form-input" value={flightForm.flightNumber} onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value })} placeholder="AI101" required />
              </div>
              <div className="form-group">
                <label className="form-label">Airline</label>
                <input className="form-input" value={flightForm.airline} onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })} placeholder="Air India" required />
              </div>
              <div className="form-group">
                <label className="form-label">Origin</label>
                <select className="form-input" value={flightForm.origin} onChange={(e) => setFlightForm({ ...flightForm, origin: e.target.value })} required>
                  <option value="">Select</option>
                  {AIRPORTS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <select className="form-input" value={flightForm.destination} onChange={(e) => setFlightForm({ ...flightForm, destination: e.target.value })} required>
                  <option value="">Select</option>
                  {AIRPORTS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Departure Time</label>
                <input type="datetime-local" className="form-input" value={flightForm.departureTime} onChange={(e) => setFlightForm({ ...flightForm, departureTime: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Arrival Time</label>
                <input type="datetime-local" className="form-input" value={flightForm.arrivalTime} onChange={(e) => setFlightForm({ ...flightForm, arrivalTime: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" className="form-input" value={flightForm.price} onChange={(e) => setFlightForm({ ...flightForm, price: e.target.value })} placeholder="5000" min="0" required />
              </div>
              <div className="form-group">
                <label className="form-label">Total Seats</label>
                <input type="number" className="form-input" value={flightForm.totalSeats} onChange={(e) => setFlightForm({ ...flightForm, totalSeats: e.target.value })} placeholder="120" min="1" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={creating}>
              {creating ? 'Creating...' : 'Create Flight'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
