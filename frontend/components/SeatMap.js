'use client';

import { useState } from 'react';

export default function SeatMap({ seatMap, flightId, onSeatSelect }) {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    const newSelected = selectedSeat === seat.seatNumber ? null : seat.seatNumber;
    setSelectedSeat(newSelected);
    if (onSeatSelect) onSeatSelect(newSelected);
  };

  const rows = {};
  seatMap.forEach((seat) => {
    const row = seat.seatNumber.replace(/[A-Z]/g, '');
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  const getSeatColor = (seat) => {
    if (seat.isBooked) return { bg: '#fee2e2', border: '#f87171', color: '#991b1b', cursor: 'not-allowed' };
    if (selectedSeat === seat.seatNumber) return { bg: '#1a56db', border: '#1e429f', color: 'white', cursor: 'pointer' };
    return { bg: '#ecfdf5', border: '#6ee7b7', color: '#065f46', cursor: 'pointer' };
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { color: '#ecfdf5', border: '#6ee7b7', label: 'Available' },
          { color: '#1a56db', border: '#1e429f', label: 'Selected' },
          { color: '#fee2e2', border: '#f87171', label: 'Booked' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '4px',
              background: item.color, border: `1px solid ${item.border}`,
            }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--gray-500)', fontSize: '0.75rem' }}>
          ← FRONT OF AIRCRAFT →
        </div>

        {Object.entries(rows).map(([row, seats]) => (
          <div key={row} style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', marginBottom: '0.5rem', alignItems: 'center' }}>
            <span style={{ width: '24px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--gray-500)' }}>{row}</span>
            {seats.map((seat, idx) => {
              const style = getSeatColor(seat);
              return (
                <>
                  {idx === 3 && <div key={`aisle-${row}`} style={{ width: '20px' }} />}
                  <button
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                    title={seat.isBooked ? 'Booked' : `Seat ${seat.seatNumber}`}
                    style={{
                      width: '36px', height: '36px',
                      borderRadius: '4px 4px 2px 2px',
                      background: style.bg,
                      border: `1px solid ${style.border}`,
                      color: style.color,
                      cursor: style.cursor,
                      fontSize: '0.6875rem',
                      fontWeight: '600',
                      transition: 'all 0.15s',
                    }}
                  >
                    {seat.seatNumber.replace(/[0-9]/g, '')}
                  </button>
                </>
              );
            })}
          </div>
        ))}
      </div>

      {selectedSeat && (
        <p style={{ marginTop: '1rem', fontWeight: '600', color: 'var(--primary)' }}>
          Selected: Seat {selectedSeat}
        </p>
      )}
    </div>
  );
}
