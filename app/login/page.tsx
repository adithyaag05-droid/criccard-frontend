'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setAuth(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push('/dashboard');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      const data = await api.guest();
      setAuth(data.token, data.user);
      router.push('/create');
    } catch {
      toast.error('Guest login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Link href="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 900, fontSize: 22, marginBottom: 40 }}>⚡ CricCard</Link>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Sign in</h1>
        <p style={{ color: '#8888aa', marginBottom: 28, fontSize: 14 }}>Welcome back. Your cards are waiting.</p>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#2a2a4a' }} />
          <span style={{ color: '#8888aa', fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#2a2a4a' }} />
        </div>
        <button className="btn-outline" style={{ width: '100%' }} onClick={handleGuest} disabled={loading}>
          Continue as guest
        </button>
        <p style={{ textAlign: 'center', color: '#8888aa', fontSize: 13, marginTop: 20 }}>
          No account? <Link href="/register" style={{ color: '#FFD700' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
