'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [tab, setTab] = useState<'stats'|'users'|'payments'|'templates'>('stats');
  const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const authFetch = (path: string) => fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    authFetch('/api/admin/stats').then(d => setStats(d)).catch(() => {});
    authFetch('/api/admin/users').then(d => setUsers(d.users || [])).catch(() => {});
    authFetch('/api/admin/payments').then(d => setPayments(d.payments || [])).catch(() => {});
    authFetch('/api/admin/templates').then(d => setTemplates(d.templates || [])).catch(() => {});
  }, [token]);

  const toggleTemplate = async (id: string, is_active: boolean) => {
    await fetch(`${BASE}/api/admin/templates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_active: !is_active }),
    });
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_active: !is_active } : t));
  };

  const tabs: {id: typeof tab; label: string}[] = [
    { id: 'stats', label: '📊 Overview' },
    { id: 'users', label: '👥 Users' },
    { id: 'payments', label: '💳 Payments' },
    { id: 'templates', label: '🎨 Templates' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a' }}>
      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a4a' }}>
        <Link href="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 900, fontSize: 18 }}>⚡ CricCard</Link>
        <span style={{ color: '#8888aa', fontSize: 13 }}>Admin Panel</span>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Admin Dashboard</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid #2a2a4a', paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 18px', background: 'none', border: 'none', color: tab === t.id ? '#FFD700' : '#8888aa', fontWeight: tab === t.id ? 700 : 400, cursor: 'pointer', borderBottom: tab === t.id ? '2px solid #FFD700' : '2px solid transparent', fontSize: 14 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        {tab === 'stats' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Total users', value: stats.totalUsers?.toLocaleString() },
                { label: 'Total cards', value: stats.totalCards?.toLocaleString() },
                { label: 'Revenue (INR)', value: `₹${stats.revenueInr?.toLocaleString()}` },
                { label: 'Cards today', value: stats.cardsToday?.toLocaleString() },
              ].map(s => (
                <div key={s.label} className="card">
                  <div style={{ fontSize: 30, fontWeight: 900, color: '#FFD700', marginBottom: 4 }}>{s.value || '—'}</div>
                  <div style={{ color: '#8888aa', fontSize: 13 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a4a' }}>
                  {['Name', 'Email', 'Plan', 'Cards Used', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#8888aa', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                    <td style={{ padding: '10px 12px' }}>{u.name || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#8888aa' }}>{u.email}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ color: u.plan !== 'free' ? '#FFD700' : '#8888aa', textTransform: 'capitalize' }}>{u.plan}</span></td>
                    <td style={{ padding: '10px 12px', color: '#8888aa' }}>{u.cards_used}</td>
                    <td style={{ padding: '10px 12px', color: '#8888aa' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments */}
        {tab === 'payments' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a4a' }}>
                  {['User', 'Plan', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#8888aa', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                    <td style={{ padding: '10px 12px' }}>{p.name || p.email}</td>
                    <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{p.plan}</td>
                    <td style={{ padding: '10px 12px', color: '#FFD700' }}>₹{(p.amount_inr / 100).toFixed(0)}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ color: p.status === 'paid' ? '#00ff88' : '#ff6666', fontWeight: 600 }}>{p.status}</span></td>
                    <td style={{ padding: '10px 12px', color: '#8888aa' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Templates */}
        {tab === 'templates' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {templates.map(t => (
              <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#8888aa', textTransform: 'capitalize' }}>{t.sport} · {t.style} · ₹{t.price_inr / 100 || 'Free'}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: t.is_premium ? '#FFD700' : '#8888aa' }}>{t.is_premium ? '⭐ Premium' : 'Free'}</span>
                  <button onClick={() => toggleTemplate(t.id, t.is_active)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, background: t.is_active ? '#00ff8822' : '#ff666622', color: t.is_active ? '#00ff88' : '#ff6666' }}>
                    {t.is_active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
