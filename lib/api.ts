const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('criccard_token');
}

async function request(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...opts.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  register: (email: string, password: string, name: string) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  login: (email: string, password: string) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  guest: () => request('/api/auth/guest', { method: 'POST' }),
  me: () => request('/api/auth/me'),

  // Cards
  templates: () => request('/api/cards/templates'),
  generateCard: (formData: FormData) =>
    request('/api/cards/generate', { method: 'POST', body: formData }),
  myCards: () => request('/api/cards/my'),
  shareCard: (token: string) => request(`/api/cards/share/${token}`),

  // Payments
  plans: () => request('/api/payments/plans'),
  createOrder: (plan: string, cardId?: string) =>
    request('/api/payments/order', { method: 'POST', body: JSON.stringify({ plan, cardId }) }),
  verifyPayment: (data: object) =>
    request('/api/payments/verify', { method: 'POST', body: JSON.stringify(data) }),
};

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiatePayment({
  plan, cardId, userEmail, userName, onSuccess, onError,
}: {
  plan: string; cardId?: string; userEmail: string; userName: string;
  onSuccess: (data: any) => void; onError: (e: string) => void;
}) {
  const loaded = await loadRazorpay();
  if (!loaded) return onError('Failed to load payment gateway');

  const order = await api.createOrder(plan, cardId);

  const rzp = new (window as any).Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'CricCard',
    description: order.plan,
    order_id: order.orderId,
    prefill: { email: userEmail, name: userName },
    theme: { color: '#FFD700' },
    handler: async (response: any) => {
      try {
        await api.verifyPayment({ ...response, cardId, plan });
        onSuccess(response);
      } catch (e: any) {
        onError(e.message);
      }
    },
    modal: { ondismiss: () => onError('Payment cancelled') },
  });
  rzp.open();
}
