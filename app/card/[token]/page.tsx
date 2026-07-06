'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ShareCardPage({ params }: { params: { token: string } }) {
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.shareCard(params.token)
      .then(d => setCard(d.card))
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [params.token]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#FFD700', fontSize: 18 }}>⚡ Loading card...</div>
    </div>
  );

  if (!card) return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🃏</div>
      <h2 style={{ fontSize: 24, fontWeight: 800 }}>Card not found</h2>
      <Link href="/" className="btn-gold" style={{ textDecoration: 'none' }}>Create your own card</Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Link href="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 900, fontSize: 18, marginBottom: 32 }}>⚡ CricCard</Link>

      <img src={card.previewUrl} alt={card.player_name} style={{ maxWidth: 300, borderRadius: 20, boxShadow: '0 20px 60px #FFD70033', marginBottom: 24, border: '1px solid #FFD70033' }} />

      <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{card.player_name}</h2>
      <p style={{ color: '#8888aa', marginBottom: 32, textTransform: 'capitalize' }}>{card.sport} {card.team_name ? `· ${card.team_name}` : ''}</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
          className="btn-outline">🔗 Copy link</button>
        <Link href="/create" className="btn-gold" style={{ textDecoration: 'none' }}>⚡ Make my own card</Link>
      </div>

      <p style={{ color: '#8888aa', fontSize: 13 }}>
        Shared via <Link href="/" style={{ color: '#FFD700' }}>criccard.app</Link> · {card.share_count} views
      </p>
    </div>
  );
}
