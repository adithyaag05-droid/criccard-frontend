# ⚡ CricCard Frontend

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-02042B?style=for-the-badge&logo=razorpay)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)

**Generate premium FIFA-style sports cards for cricket, football, and badminton.**  
Upload photo → Enter stats → Pick style → Share or download HD in under 90 seconds.

[🌐 Live Demo](https://criccard-frontend-1.vercel.app) · [🐛 Report Bug](https://github.com/adithyaag05-droid/criccard-frontend/issues) · [✨ Request Feature](https://github.com/adithyaag05-droid/criccard-frontend/issues)

</div>

---

## 📸 Screenshots

| Landing Page | Card Creator | Card Preview |
|---|---|---|
| Hero with animated card carousel | 5-step wizard | Watermarked free preview |

---

## ✨ Features

- 🏏 **Multi-sport support** — Cricket, Football, Badminton, Custom
- 🎨 **3 card themes** — Classic Gold, Dark Pro, Neon Blaze
- 📸 **Photo upload** — Upload your own sports photo
- ⚡ **90-second card creation** — Simple 5-step wizard
- 🔗 **Viral sharing** — Public shareable link for every card
- 💳 **Razorpay payments** — Pay ₹49 to unlock HD watermark-free download
- 👤 **Guest mode** — No signup required to try
- 📱 **Mobile-first** — Fully responsive design
- 🗂️ **Dashboard** — View and manage all your saved cards
- 🔐 **Auth** — Register, login, guest session

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | Auth state management |
| Razorpay.js | Payment checkout |
| React Hot Toast | Notifications |
| Axios | API requests |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see [criccard-backend](https://github.com/adithyaag05-droid/criccard-backend))

### Installation

```bash
# Clone the repo
git clone https://github.com/adithyaag05-droid/criccard-frontend.git
cd criccard-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/page.tsx       # 5-step card creation wizard
│   ├── dashboard/page.tsx    # User's saved cards
│   ├── login/page.tsx        # Sign in
│   ├── register/page.tsx     # Sign up
│   ├── admin/page.tsx        # Admin dashboard
│   ├── card/[token]/page.tsx # Public share page
│   └── privacy/page.tsx      # Privacy policy
├── lib/
│   └── api.ts                # API client + Razorpay helper
└── store/
    └── auth.ts               # Auth state (Zustand)
```

---

## 💳 Payment Flow

```
User clicks "Pay ₹49"
  → POST /api/payments/order  (creates Razorpay order)
  → Razorpay checkout popup
  → User pays
  → POST /api/payments/verify (HMAC SHA256 verification)
  → HD card unlocked ✅
```

---

## 🌐 Deployment

Deployed on **Vercel** with automatic deployments on push to `main`.

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

**Environment variables needed on Vercel:**
- `NEXT_PUBLIC_API_URL` — Your Railway backend URL
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Your Razorpay key ID

---

## 📄 Pages

| Route | Description | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/create` | Card creation wizard | Guest/User |
| `/dashboard` | Saved cards | User |
| `/card/[token]` | Public share page | Public |
| `/login` | Sign in | Public |
| `/register` | Sign up | Public |
| `/admin` | Admin dashboard | Admin only |
| `/privacy` | Privacy policy | Public |

---

## 🔗 Related

- [CricCard Backend](https://github.com/adithyaag05-droid/criccard-backend) — Node.js API + card generation

---

## 👨‍💻 Author

**Adithya AG**  
[![GitHub](https://img.shields.io/badge/GitHub-adithyaag05--droid-181717?style=flat&logo=github)](https://github.com/adithyaag05-droid)
[![Email](https://img.shields.io/badge/Email-adithyaag05%40gmail.com-D14836?style=flat&logo=gmail)](mailto:adithyaag05@gmail.com)

---

## 📝 License

MIT License — feel free to use this project for learning or building upon it.
