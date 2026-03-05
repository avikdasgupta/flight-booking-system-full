'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav style={{
      background: '#1a56db',
      color: 'white',
      padding: '0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link href="/" style={{ color: 'white', fontWeight: '800', fontSize: '1.25rem', textDecoration: 'none' }}>
          ✈️ SkyBook
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/flights" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
            Flights
          </Link>

          {user ? (
            <>
              <Link href="/booking/history" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                My Bookings
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                  Admin
                </Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    padding: '0.375rem 0.875rem',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/auth/login" style={{
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '0.375rem 0.875rem',
              }}>
                Sign In
              </Link>
              <Link href="/auth/register" style={{
                background: 'white',
                color: 'var(--primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
                padding: '0.375rem 0.875rem',
                borderRadius: '6px',
              }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
