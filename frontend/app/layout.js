import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

export const metadata = {
  title: {
    default: 'SkyBook - Flight Booking System',
    template: '%s | SkyBook',
  },
  description: 'Book domestic flights across India with ease. Search, compare and book flights at the best prices.',
  keywords: ['flights', 'booking', 'travel', 'India', 'domestic flights'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'SkyBook',
    title: 'SkyBook - Flight Booking System',
    description: 'Book domestic flights across India with ease.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyBook - Flight Booking System',
    description: 'Book domestic flights across India with ease.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer style={{ background: '#111827', color: '#9ca3af', padding: '2rem 0', marginTop: '4rem' }}>
            <div className="container text-center">
              <p>&copy; {new Date().getFullYear()} SkyBook. All rights reserved.</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                Book flights easily with real-time availability.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
