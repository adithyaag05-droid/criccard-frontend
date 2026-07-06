'use client';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid #2a2a4a' }}>
        <Link href="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 900, fontSize: 18 }}>⚡ CricCard</Link>
      </nav>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: '#8888aa', marginBottom: 40 }}>Last updated: January 2025</p>

        {[
          { title: 'What we collect', body: 'We collect your email address when you register, and the sports photo you upload when creating a card. We also collect the stats and player details you enter.' },
          { title: 'How we use your data', body: 'Your photo is used solely to generate your sports card image. We do not use it for any other purpose, share it with third parties, or train AI models with it.' },
          { title: 'Photo storage', body: 'Generated card images are stored on our servers. You can request deletion of your cards and account data at any time by emailing support@criccard.app.' },
          { title: 'Payments', body: 'Payments are processed by Razorpay. We do not store your card or bank details. Razorpay\'s privacy policy applies to payment processing.' },
          { title: 'Cookies', body: 'We use a JWT token stored in your browser\'s localStorage for authentication. We do not use third-party tracking cookies.' },
          { title: 'Data retention', body: 'Guest accounts and their cards are deleted after 30 days. Registered accounts retain data until you request deletion.' },
          { title: 'Contact', body: 'For privacy requests or questions, contact us at support@criccard.app.' },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#FFD700' }}>{s.title}</h2>
            <p style={{ color: '#8888aa', lineHeight: 1.7 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
