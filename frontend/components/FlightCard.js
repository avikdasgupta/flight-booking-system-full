import Link from 'next/link';
import { formatDate, formatPrice, getDuration, cityNameFromCode } from '../utils/helpers';

export default function FlightCard({ flight }) {
  const origin = cityNameFromCode(flight.origin);
  const destination = cityNameFromCode(flight.destination);
  const duration = getDuration(flight.departureTime, flight.arrivalTime);

  return (
    <div className="card" style={{ transition: 'box-shadow 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--gray-900)' }}>
            {flight.airline} · {flight.flightNumber}
          </p>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
            {duration} · Economy
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{flight.origin}</p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{origin}</p>
            <p style={{ fontWeight: '500', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {formatDate(flight.departureTime)}
            </p>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--gray-400)' }}>
            <div style={{ width: '80px', borderTop: '1px dashed var(--gray-300)', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '1rem' }}>
                ✈️
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>{duration}</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{flight.destination}</p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{destination}</p>
            <p style={{ fontWeight: '500', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {formatDate(flight.arrivalTime)}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              {formatPrice(flight.price)}
            </p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
              {flight.availableSeats} seats left
            </p>
            <Link
              href={`/flight/${flight._id}`}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', display: 'inline-block' }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
