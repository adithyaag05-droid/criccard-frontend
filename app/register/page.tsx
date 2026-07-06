'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.register(email, password, name);
      setAuth(data.token, data.user);
      toast.success('Account created! Let\'s make your first card.');
      router.push('/create');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Link href="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 900, fontSize: 22, marginBottom: 40 }}>⚡ CricCard</Link>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create account</h1>
        <p style={{ color: '#8888aa', marginBottom: 28, fontSize: 14 }}>Free to join. Start generating cards instantly.</p>
        <form onSubmit={handleRegister} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="label">Your name</label>
            <input className="input" placeholder="Virat Kumar" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
          </div>
          <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating...' : 'Create account & start'}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#8888aa', fontSize: 13, marginTop: 20 }}>
          Already have an account? <Link href="/login" style={{ color: '#FFD700' }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', color: '#8888aa', fontSize: 11, marginTop: 12 }}>
          By signing up you agree to our <Link href="/privacy" style={{ color: '#8888aa' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
