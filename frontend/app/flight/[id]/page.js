import { notFound } from 'next/navigation';
import SeatMap from '../../../components/SeatMap';
import BookingForm from '../../../components/BookingForm';
import { formatDate, formatPrice, getDuration, cityNameFromCode } from '../../../utils/helpers';

async function fetchFlight(id) {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${API_BASE_URL}/api/flights/${id}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data.flight;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const flight = await fetchFlight(params.id);
  if (!flight) return { title: 'Flight Not Found' };

  const origin = cityNameFromCode(flight.origin);
  const destination = cityNameFromCode(flight.destination);

  return {
    title: `${flight.airline} ${flight.flightNumber}: ${origin} to ${destination}`,
    description: `Book ${flight.airline} flight ${flight.flightNumber} from ${origin} to ${destination}. Departure: ${formatDate(flight.departureTime)}. Price from ${formatPrice(flight.price)}.`,
    openGraph: {
      title: `${flight.airline} ${flight.flightNumber}: ${origin} → ${destination}`,
      description: `${formatDate(flight.departureTime)} · ${formatPrice(flight.price)} per seat`,
    },
    alternates: {
      canonical: `/flight/${params.id}`,
    },
  };
}

export default async function FlightDetailPage({ params }) {
  const flight = await fetchFlight(params.id);
  if (!flight) notFound();

  const origin = cityNameFromCode(flight.origin);
  const destination = cityNameFromCode(flight.destination);
  const duration = getDuration(flight.departureTime, flight.arrivalTime);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Flight',
    name: `${flight.airline} ${flight.flightNumber}`,
    departureAirport: { '@type': 'Airport', iataCode: flight.origin, name: origin },
    arrivalAirport: { '@type': 'Airport', iataCode: flight.destination, name: destination },
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    airline: { '@type': 'Airline', name: flight.airline },
  };

  return (
    <div className="container section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              {flight.airline} · {flight.flightNumber}
            </h1>
            <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>
              Economy Class · {duration}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
              {formatPrice(flight.price)}
            </p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>per person</p>
          </div>
        </div>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ fontSize: '2rem', fontWeight: '700' }}>{flight.origin}</p>
            <p style={{ color: 'var(--gray-500)' }}>{origin}</p>
            <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>{formatDate(flight.departureTime)}</p>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            <div style={{ borderTop: '2px solid var(--gray-300)', width: '100px', margin: '0 auto 0.5rem' }} />
            <p>{duration}</p>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ fontSize: '2rem', fontWeight: '700' }}>{flight.destination}</p>
            <p style={{ color: 'var(--gray-500)' }}>{destination}</p>
            <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>{formatDate(flight.arrivalTime)}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1rem' }}>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            {flight.availableSeats} seat{flight.availableSeats !== 1 ? 's' : ''} available out of {flight.totalSeats}
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Select a Seat</h2>
          <SeatMap seatMap={flight.seatMap} flightId={flight._id} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Passenger Details</h2>
          <BookingForm flight={flight} />
        </div>
      </div>
    </div>
  );
}
