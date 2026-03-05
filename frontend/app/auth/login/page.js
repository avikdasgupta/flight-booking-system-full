export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your SkyBook account to manage your flight bookings.',
};

import LoginForm from '../../../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="container section" style={{ maxWidth: '480px' }}>
      <div className="card">
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Welcome Back</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
