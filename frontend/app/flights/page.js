import Link from 'next/link';
import { flightService } from '../../services';
import FlightCard from '../../components/FlightCard';
import SearchForm from '../../components/SearchForm';

export const metadata = {
  title: 'Search Flights',
  description: 'Search available flights between Indian cities. Find the best deals for your journey.',
  openGraph: {
    title: 'Search Flights | SkyBook',
    description: 'Search available flights between Indian cities. Find the best deals.',
  },
};

async function fetchFlights(searchParams) {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
  const params = new URLSearchParams();
  if (searchParams.origin) params.set('origin', searchParams.origin);
  if (searchParams.destination) params.set('destination', searchParams.destination);
  if (searchParams.date) params.set('date', searchParams.date);
  if (searchParams.page) params.set('page', searchParams.page);

  const endpoint = params.toString()
    ? `${API_BASE_URL}/api/flights/search?${params.toString()}`
    : `${API_BASE_URL}/api/flights?${params.toString()}`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 60 } });
    if (!res.ok) return { flights: [], total: 0 };
    const data = await res.json();
    return data.data;
  } catch {
    return { flights: [], total: 0 };
  }
}

export default async function FlightsPage({ searchParams }) {
  const data = await fetchFlights(searchParams);
  const { flights = [], total = 0, pages = 1 } = data;
  const currentPage = parseInt(searchParams.page) || 1;

  const origin = searchParams.origin || '';
  const destination = searchParams.destination || '';
  const date = searchParams.date || '';

  return (
    <div className="container section">
      <div className="page-header">
        <h1 className="page-title">
          {origin && destination
            ? `Flights from ${origin} to ${destination}`
            : 'Available Flights'}
        </h1>
        {total > 0 && (
          <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
            {total} flight{total !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      <SearchForm defaultValues={{ origin, destination, date }} />

      <div style={{ marginTop: '2rem' }}>
        {flights.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)' }}>
              No flights found. Try different search criteria.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {flights.map((flight) => (
                <FlightCard key={flight._id} flight={flight} />
              ))}
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                  Page {currentPage} of {pages}
                </span>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/flights?origin=${origin}&destination=${destination}&date=${date}&page=${currentPage - 1}`}
                      className="btn btn-secondary"
                    >
                      Previous
                    </Link>
                  )}
                  {currentPage < pages && (
                    <Link
                      href={`/flights?origin=${origin}&destination=${destination}&date=${date}&page=${currentPage + 1}`}
                      className="btn btn-primary"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
