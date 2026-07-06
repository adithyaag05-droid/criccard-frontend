'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const EXAMPLE_CARDS = [
  { name: 'VIRAT K.', sport: 'CRICKET', rating: 94, color: '#FFD700' },
  { name: 'ROHIT S.', sport: 'CRICKET', rating: 91, color: '#C0C0C0' },
  { name: 'ARJUN M.', sport: 'FOOTBALL', rating: 88, color: '#00ff88' },
];

const STATS = [
  { label: 'Cards Created', value: '12,400+' },
  { label: 'Sports Supported', value: '3' },
  { label: 'Avg. Rating', value: '4.9★' },
];

const HOW = [
  { step: '01', title: 'Upload your photo', desc: 'Take a sports photo or pick one from your gallery.' },
  { step: '02', title: 'Enter your stats', desc: 'Add your name, team, position and match performance stats.' },
  { step: '03', title: 'Pick a card style', desc: 'Choose from Classic, Dark, or Neon card themes.' },
  { step: '04', title: 'Share or download', desc: 'Share the free preview or pay ₹49 for HD with no watermark.' },
];

const PLANS = [
  { name: 'Free Preview', price: '₹0', desc: 'Watermarked preview card. Share the link with friends.', cta: 'Try Free', highlight: false },
  { name: 'Single Card HD', price: '₹49', desc: 'One HD card, no watermark. Download and share instantly.', cta: 'Get HD Card', highlight: true },
  { name: 'Monthly Pack', price: '₹199/mo', desc: '10 HD cards per month. Great for regular players.', cta: 'Go Monthly', highlight: false },
  { name: 'Team Pack', price: '₹999', desc: '100 cards. Perfect for academies and turf teams.', cta: 'Get Team Pack', highlight: false },
];

export default function Home() {
  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveCard(p => (p + 1) % EXAMPLE_CARDS.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a' }}>
      {/* Nav */}
      <nav style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a4a', position: 'sticky', top: 0, background: '#0d0d1aee', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#FFD700', letterSpacing: -1 }}>⚡ CricCard</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" style={{ color: '#8888aa', textDecoration: 'none', padding: '8px 16px', fontSize: 14 }}>Sign in</Link>
          <Link href="/create" className="btn-gold" style={{ padding: '8px 20px', fontSize: 14, textDecoration: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#0d0d1a', fontWeight: 700 }}>Create Card</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-block', background: '#FFD70022', border: '1px solid #FFD70055', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#FFD700', fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>
            🏏 CRICKET · FOOTBALL · BADMINTON
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: -1 }}>
            Your stats.<br/>
            <span style={{ color: '#FFD700' }}>Pro card.</span><br/>
            90 seconds.
          </h1>
          <p style={{ fontSize: 17, color: '#8888aa', lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
            Upload your sports photo, enter your match stats, and generate a broadcast-quality player card. Free preview, HD download for ₹49.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/create" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block', padding: '14px 32px', borderRadius: 8, background: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#0d0d1a', fontWeight: 800, fontSize: 16 }}>
              ⚡ Create Your Card
            </Link>
            <Link href="/create" style={{ textDecoration: 'none', display: 'inline-block', padding: '14px 24px', borderRadius: 8, border: '1.5px solid #2a2a4a', color: '#8888aa', fontSize: 15 }}>
              See examples →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#FFD700' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#8888aa', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card preview carousel */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          {EXAMPLE_CARDS.map((card, i) => (
            <div key={i} style={{
              position: i === 0 ? 'relative' : 'absolute',
              opacity: activeCard === i ? 1 : 0,
              transform: activeCard === i ? 'scale(1) rotate(0deg)' : 'scale(0.9) rotate(3deg)',
              transition: 'all 0.5s ease',
              width: 280, height: 420,
              background: 'linear-gradient(160deg, #1a1a2e, #16213e)',
              borderRadius: 20,
              border: `2px solid ${card.color}44`,
              padding: 24,
              boxShadow: `0 20px 60px ${card.color}22`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ background: `${card.color}22`, border: `1px solid ${card.color}66`, borderRadius: 6, padding: '3px 10px', fontSize: 10, color: card.color, fontWeight: 700 }}>{card.sport}</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.rating}</div>
              </div>
              <div style={{ height: 200, background: `${card.color}11`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, marginBottom: 16 }}>⚡</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>{card.name}</div>
                <div style={{ fontSize: 11, color: card.color, opacity: 0.7 }}>TEAM INDIA XI</div>
              </div>
              <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#ffffff44' }}>criccard.app — Free Preview</div>
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: -24, display: 'flex', gap: 6 }}>
            {EXAMPLE_CARDS.map((_, i) => (
              <div key={i} style={{ width: activeCard === i ? 20 : 6, height: 6, borderRadius: 3, background: activeCard === i ? '#FFD700' : '#2a2a4a', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 900, margin: '60px auto', padding: '60px 24px', borderTop: '1px solid #2a2a4a' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-title">How it works</div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Card ready in under 90 seconds</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {HOW.map(h => (
            <div key={h.step} className="card" style={{ borderTop: '2px solid #FFD70033' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#FFD70033', marginBottom: 12 }}>{h.step}</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{h.title}</div>
              <div style={{ color: '#8888aa', fontSize: 13, lineHeight: 1.6 }}>{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px', borderTop: '1px solid #2a2a4a' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-title">Pricing</div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Simple, affordable flex</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {PLANS.map(plan => (
            <div key={plan.name} className="card" style={{
              borderColor: plan.highlight ? '#FFD700' : '#2a2a4a',
              position: 'relative',
              ...(plan.highlight ? { boxShadow: '0 0 30px #FFD70022' } : {})
            }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#FFD700', color: '#0d0d1a', fontSize: 10, fontWeight: 800, padding: '2px 12px', borderRadius: 10, letterSpacing: 1 }}>POPULAR</div>
              )}
              <div style={{ fontSize: 28, fontWeight: 900, color: '#FFD700', marginBottom: 4 }}>{plan.price}</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ color: '#8888aa', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{plan.desc}</div>
              <Link href="/create" style={{
                display: 'block', textAlign: 'center', textDecoration: 'none', padding: '10px', borderRadius: 8, fontWeight: 700, fontSize: 14,
                ...(plan.highlight
                  ? { background: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#0d0d1a' }
                  : { border: '1.5px solid #2a2a4a', color: '#8888aa' })
              }}>{plan.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid #2a2a4a' }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Ready to flex your stats?</h2>
        <p style={{ color: '#8888aa', marginBottom: 32, fontSize: 16 }}>Join 12,000+ players. Free preview in 90 seconds.</p>
        <Link href="/create" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block', padding: '16px 40px', fontSize: 17, borderRadius: 10, background: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#0d0d1a', fontWeight: 800 }}>
          ⚡ Create Your Card Now
        </Link>
      </section>

      <footer style={{ borderTop: '1px solid #2a2a4a', padding: '24px', textAlign: 'center', color: '#8888aa', fontSize: 13 }}>
        © 2025 CricCard · <Link href="/privacy" style={{ color: '#8888aa' }}>Privacy Policy</Link> · <Link href="/admin" style={{ color: '#8888aa' }}>Admin</Link>
      </footer>
    </div>
  );
}
