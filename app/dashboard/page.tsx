'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api, initiatePayment } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout, refresh } = useAuth();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    refresh();
    loadCards();
  }, [token]);

  const loadCards = async () => {
    try {
      const data = await api.myCards();
      setCards(data.cards);
    } catch { toast.error('Failed to load cards'); }
    finally { setLoading(false); }
  };

  const handleUnlock = async (card: any) => {
    if (!user) return;
    await initiatePayment({
      plan: 'single', cardId: card.id,
      userEmail: user.email, userName: user.name,
      onSuccess: () => { toast.success('HD unlocked!'); loadCards(); },
      onError: (e) => toast.error(e),
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a' }}>
      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a4a' }}>
        <Link href="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 900, fontSize: 18 }}>⚡ CricCard</Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#8888aa', fontSize: 13 }}>{user?.email}</span>
          <button onClick={() => { logout(); router.push('/'); }} style={{ background: 'none', border: '1px solid #2a2a4a', color: '#8888aa', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>My Cards</h1>
            <p style={{ color: '#8888aa' }}>Plan: <span style={{ color: '#FFD700', textTransform: 'capitalize' }}>{user?.plan || 'Free'}</span></p>
          </div>
          <Link href="/create" className="btn-gold" style={{ textDecoration: 'none', padding: '12px 24px' }}>+ New Card</Link>
        </div>

        {loading && <div style={{ textAlign: 'center', color: '#8888aa', padding: 60 }}>Loading your cards...</div>}

        {!loading && cards.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', border: '2px dashed #2a2a4a', borderRadius: 20 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>⚡</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No cards yet</h3>
            <p style={{ color: '#8888aa', marginBottom: 24 }}>Create your first sports card in 90 seconds.</p>
            <Link href="/create" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block' }}>Create My First Card</Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {cards.map(card => (
            <div key={card.id} className="card" style={{ padding: 16 }}>
              <img src={card.previewUrl} alt={card.player_name} style={{ width: '100%', borderRadius: 12, marginBottom: 12, border: '1px solid #2a2a4a' }} />
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{card.player_name}</div>
              <div style={{ fontSize: 12, color: '#8888aa', marginBottom: 12, textTransform: 'capitalize' }}>{card.sport} · {card.team_name || 'No team'}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/card/${card.share_token}`); toast.success('Share link copied!'); }}
                  style={{ flex: 1, background: '#111128', border: '1px solid #2a2a4a', color: '#8888aa', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', fontSize: 12 }}>
                  🔗 Share
                </button>
                {card.is_paid
                  ? <a href={card.hdUrl} download style={{ flex: 1, background: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#0d0d1a', borderRadius: 6, padding: '6px 8px', textDecoration: 'none', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                      📥 HD
                    </a>
                  : <button onClick={() => handleUnlock(card)} style={{ flex: 1, border: '1px solid #FFD700', color: '#FFD700', background: 'transparent', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', fontSize: 12 }}>
                      ⚡ ₹49
                    </button>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
