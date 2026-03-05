export const metadata = {
  title: 'SkyBook - Fast, Affordable Domestic Flights',
  description: 'Book domestic flights across India. Compare prices, check availability, and book tickets instantly.',
};

import Link from 'next/link';
import SearchForm from '../components/SearchForm';

const popularRoutes = [
  { from: 'DEL', to: 'BOM', label: 'Delhi → Mumbai' },
  { from: 'BOM', to: 'BLR', label: 'Mumbai → Bengaluru' },
  { from: 'CCU', to: 'DEL', label: 'Kolkata → Delhi' },
  { from: 'MAA', to: 'DEL', label: 'Chennai → Delhi' },
  { from: 'HYD', to: 'BOM', label: 'Hyderabad → Mumbai' },
  { from: 'BLR', to: 'CCU', label: 'Bengaluru → Kolkata' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #1e429f 100%)',
        color: 'white',
        padding: '4rem 0 6rem',
      }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
              ✈️ Book Your Flight Today
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
              Fast, affordable domestic flights across India. Best prices guaranteed.
            </p>
          </div>
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="container section">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          Popular Routes
        </h2>
        <div className="grid-3">
          {popularRoutes.map((route) => (
            <Link
              key={`${route.from}-${route.to}`}
              href={`/flights?origin=${route.from}&destination=${route.to}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': { transform: 'translateY(-2px)' },
              }}>
                <p style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--gray-900)' }}>
                  {route.label}
                </p>
                <p style={{ color: 'var(--primary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Search flights →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--gray-100)', padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
            Why Choose SkyBook?
          </h2>
          <div className="grid-3">
            {[
              { icon: '🔒', title: 'Secure Booking', desc: 'Your data is protected with industry-standard encryption.' },
              { icon: '💺', title: 'Seat Selection', desc: 'Choose your preferred seat with real-time availability.' },
              { icon: '⚡', title: 'Instant Confirmation', desc: 'Get your booking confirmed instantly after payment.' },
            ].map((f) => (
              <div key={f.title} className="card text-center">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
