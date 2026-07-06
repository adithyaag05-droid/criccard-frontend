'use client';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api, initiatePayment } from '@/lib/api';
import { useAuth } from '@/store/auth';
import Link from 'next/link';

const SPORTS = [
  { id: 'cricket', label: 'Cricket', emoji: '🏏' },
  { id: 'football', label: 'Football', emoji: '⚽' },
  { id: 'badminton', label: 'Badminton', emoji: '🏸' },
  { id: 'custom', label: 'Custom', emoji: '⚡' },
];

const SPORT_STATS: Record<string, string[]> = {
  cricket:  ['Batting Avg', 'Strike Rate', 'Runs', 'Wickets', 'Economy'],
  football: ['Goals', 'Assists', 'Pass Acc%', 'Tackles', 'Rating'],
  badminton:['Matches', 'Wins', 'Smash Speed', 'Win Rate%', 'Ranking'],
  custom:   ['Stat 1', 'Stat 2', 'Stat 3', 'Stat 4', 'Stat 5'],
};

const THEMES = [
  { id: 'classic', label: 'Classic Gold', bg: '#1a1a2e', accent: '#FFD700' },
  { id: 'dark',    label: 'Dark Pro',     bg: '#0a0a0a', accent: '#00ff88' },
  { id: 'neon',    label: 'Neon Blaze',   bg: '#0d0221', accent: '#ff00ff' },
];

const STEPS = ['Sport', 'Photo', 'Stats', 'Style', 'Preview'];

export default function CreatePage() {
  const { user, token, setAuth, refresh } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [sport, setSport] = useState('cricket');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [position, setPosition] = useState('');
  const [rating, setRating] = useState('75');
  const [stats, setStats] = useState<Record<string, string>>({});
  const [style, setStyle] = useState('classic');

  useEffect(() => { if (token) refresh(); }, []);

  const ensureAuth = async () => {
    if (token && user) return;
    const data = await api.guest();
    setAuth(data.token, data.user);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!playerName.trim()) return toast.error('Enter your name first');
    setLoading(true);
    try {
      await ensureAuth();
      const formData = new FormData();
      formData.append('playerName', playerName);
      formData.append('teamName', teamName);
      formData.append('position', position);
      formData.append('sport', sport);
      formData.append('rating', rating);
      formData.append('style', style);
      formData.append('stats', JSON.stringify(stats));
      if (photo) formData.append('photo', photo);
      const data = await api.generateCard(formData);
      setGeneratedCard(data);
      setStep(4);
      toast.success('Card generated! 🎉');
    } catch (e: any) {
      toast.error(e.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (plan: string) => {
    const currentUser = useAuth.getState().user;
    if (!currentUser) return toast.error('Please sign in');
    setLoading(true);
    await initiatePayment({
      plan,
      cardId: generatedCard?.card?.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      onSuccess: () => { toast.success('HD card unlocked! 🎉'); setLoading(false); refresh(); },
      onError: (e) => { toast.error(e); setLoading(false); }
    });
  };

  const sportStats = SPORT_STATS[sport] || SPORT_STATS.custom;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a' }}>
      {/* Nav */}
      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a4a' }}>
        <Link href="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 900, fontSize: 18 }}>⚡ CricCard</Link>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} title={s} style={{ width: step === i ? 24 : 8, height: 8, borderRadius: 4, background: step > i ? '#00ff88' : step === i ? '#FFD700' : '#2a2a4a', transition: 'all 0.3s' }} />
          ))}
        </div>
        <span style={{ color: '#8888aa', fontSize: 12 }}>Step {step + 1} of {STEPS.length}</span>
      </nav>

      <div style={{ maxWidth: 460, margin: '0 auto', padding: '40px 24px' }}>

        {/* Step 0: Sport */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Pick your sport</h2>
            <p style={{ color: '#8888aa', marginBottom: 28 }}>We'll customise the stats layout for you.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {SPORTS.map(s => (
                <button key={s.id} className={`sport-btn${sport === s.id ? ' active' : ''}`} onClick={() => setSport(s.id)}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.emoji}</div>
                  <div>{s.label}</div>
                </button>
              ))}
            </div>
            <button className="btn-gold" style={{ width: '100%' }} onClick={() => setStep(1)}>Continue →</button>
          </div>
        )}

        {/* Step 1: Photo */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Upload your photo</h2>
            <p style={{ color: '#8888aa', marginBottom: 28 }}>A clear sports action shot works best.</p>
            <div
              style={{ border: '2px dashed #2a2a4a', borderRadius: 16, padding: 40, textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}
              onClick={() => fileRef.current?.click()}
            >
              {photoPreview
                ? <img src={photoPreview} alt="Preview" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12, margin: '0 auto' }} />
                : <>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
                    <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 4 }}>Tap to upload photo</div>
                    <div style={{ color: '#8888aa', fontSize: 13 }}>JPG, PNG up to 10MB</div>
                  </>
              }
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </div>
            <p style={{ color: '#8888aa', fontSize: 11, marginBottom: 24, textAlign: 'center' }}>
              By uploading you confirm you have rights to this photo. Used only to generate your card.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setStep(0)}>← Back</button>
              <button className="btn-gold" style={{ flex: 2 }} onClick={() => setStep(2)}>{photo ? 'Continue →' : 'Skip →'}</button>
            </div>
          </div>
        )}

        {/* Step 2: Stats */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Your details & stats</h2>
            <p style={{ color: '#8888aa', marginBottom: 24 }}>Fill in what you know. Blanks show as dashes.</p>
            <div style={{ display: 'grid', gap: 14, marginBottom: 24 }}>
              <div>
                <label className="label">Player name *</label>
                <input className="input" placeholder="Virat Kumar" value={playerName} onChange={e => setPlayerName(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Team</label>
                  <input className="input" placeholder="Mumbai XI" value={teamName} onChange={e => setTeamName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Position</label>
                  <input className="input" placeholder="All-rounder" value={position} onChange={e => setPosition(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Overall rating — {rating}</label>
                <input type="range" min="50" max="99" value={rating} onChange={e => setRating(e.target.value)} style={{ width: '100%', accentColor: '#FFD700', marginTop: 8 }} />
              </div>
              <div>
                <label className="label" style={{ marginBottom: 10 }}>Match stats</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {sportStats.map(s => (
                    <div key={s}>
                      <label style={{ fontSize: 11, color: '#8888aa', display: 'block', marginBottom: 4 }}>{s}</label>
                      <input className="input" style={{ padding: '8px 10px', fontSize: 14 }} placeholder="—" value={stats[s] || ''} onChange={e => setStats(prev => ({ ...prev, [s]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-gold" style={{ flex: 2 }} onClick={() => setStep(3)} disabled={!playerName.trim()}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3: Style */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Choose your style</h2>
            <p style={{ color: '#8888aa', marginBottom: 28 }}>Pick the vibe for your card.</p>
            <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setStyle(t.id)} style={{ border: `2px solid ${style === t.id ? '#FFD700' : '#2a2a4a'}`, background: '#111128', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
                  <div style={{ width: 50, height: 70, borderRadius: 8, background: t.bg, border: `2px solid ${t.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 20, color: t.accent }}>⚡</span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, color: style === t.id ? '#FFD700' : '#fff', marginBottom: 4 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: '#8888aa' }}>Accent: <span style={{ color: t.accent }}>{t.accent}</span></div>
                  </div>
                  {style === t.id && <div style={{ marginLeft: 'auto', color: '#FFD700', fontSize: 20 }}>✓</div>}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn-gold" style={{ flex: 2 }} onClick={handleGenerate} disabled={loading}>
                {loading ? '⚡ Generating...' : '⚡ Generate My Card'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && generatedCard && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Your card is ready! 🎉</h2>
            <p style={{ color: '#8888aa', marginBottom: 24 }}>Share the free preview or unlock HD for ₹49.</p>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img src={generatedCard.previewUrl} alt="Your card" style={{ maxWidth: 260, borderRadius: 16, boxShadow: '0 20px 60px #FFD70033', border: '1px solid #FFD70033' }} />
            </div>
            <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
              <a href={generatedCard.previewUrl} download="criccard-preview.png" className="btn-outline" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                📥 Download Free Preview (with watermark)
              </a>
              <button className="btn-gold" style={{ width: '100%', fontSize: 15, padding: '14px' }} onClick={() => handlePay('single')} disabled={loading}>
                {loading ? 'Processing...' : '⚡ Remove Watermark — ₹49 HD Download'}
              </button>
            </div>
            <div style={{ background: '#111128', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#8888aa', marginBottom: 8 }}>🔗 Share link</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" value={generatedCard.shareUrl} readOnly style={{ flex: 1, fontSize: 12 }} />
                <button className="btn-outline" style={{ padding: '8px 12px', fontSize: 12, whiteSpace: 'nowrap' }}
                  onClick={() => { navigator.clipboard.writeText(generatedCard.shareUrl); toast.success('Copied!'); }}>
                  Copy
                </button>
              </div>
            </div>
            <button className="btn-outline" style={{ width: '100%', fontSize: 13 }} onClick={() => { setStep(3); setGeneratedCard(null); }}>
              🔄 Regenerate with different style
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
