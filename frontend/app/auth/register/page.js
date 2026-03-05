export const metadata = {
  title: 'Create Account',
  description: 'Create a new SkyBook account to start booking flights.',
};

import RegisterForm from '../../../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container section" style={{ maxWidth: '480px' }}>
      <div className="card">
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Create Account</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Join SkyBook today</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
