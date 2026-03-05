'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AIRPORTS = [
  { code: 'DEL', name: 'Delhi (DEL)' },
  { code: 'BOM', name: 'Mumbai (BOM)' },
  { code: 'BLR', name: 'Bengaluru (BLR)' },
  { code: 'CCU', name: 'Kolkata (CCU)' },
  { code: 'MAA', name: 'Chennai (MAA)' },
  { code: 'HYD', name: 'Hyderabad (HYD)' },
  { code: 'AMD', name: 'Ahmedabad (AMD)' },
  { code: 'PNQ', name: 'Pune (PNQ)' },
  { code: 'GOI', name: 'Goa (GOI)' },
  { code: 'JAI', name: 'Jaipur (JAI)' },
];

export default function SearchForm({ defaultValues = {} }) {
  const router = useRouter();
  const [form, setForm] = useState({
    origin: defaultValues.origin || '',
    destination: defaultValues.destination || '',
    date: defaultValues.date || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.origin) params.set('origin', form.origin);
    if (form.destination) params.set('destination', form.destination);
    if (form.date) params.set('date', form.date);
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">From</label>
          <select
            className="form-input"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
          >
            <option value="">Select origin</option>
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">To</label>
          <select
            className="form-input"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
          >
            <option value="">Select destination</option>
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={form.date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg">
          Search Flights
        </button>
      </div>
    </form>
  );
}
