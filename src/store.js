import { useSyncExternalStore } from 'react'

const KEY = 'tejamkor_v2'
const day = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10)
export const CATEGORIES = [
  { id: 'non', name: 'Non va qandolat', icon: 'non' },
  { id: 'sut', name: 'Sut mahsulotlari', icon: 'sut' },
  { id: 'gosht', name: "Go'sht va baliq", icon: 'gosht' },
  { id: 'meva', name: 'Meva-sabzavot', icon: 'meva' },
  { id: 'taom', name: 'Tayyor taomlar', icon: 'taom' },
  { id: 'ichimlik', name: 'Ichimliklar', icon: 'ichimlik' },
]
export const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Boshqa'

const seed = () => ({
  sellers: [
    { id: 's1', name: 'Korzinka Chilonzor', phone: '+998901112233' },
    { id: 's2', name: 'Non Markazi', phone: '+998902223344' },
    { id: 's3', name: 'Bahor Kafe', phone: '+998903334455' },
  ],
  products: [
    { id: 'p1', sellerId: 's2', name: 'Yangi patir noni (5 dona)', category: 'non', oldPrice: 15000, price: 7500, qty: 12, expiry: day(1), image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=85' },
    { id: 'p2', sellerId: 's2', name: 'Kruassan to‘plami', category: 'non', oldPrice: 30000, price: 15000, qty: 8, expiry: day(1), image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&auto=format&fit=crop&q=85' },
    { id: 'p3', sellerId: 's1', name: 'Qatiq 1 litr', category: 'sut', oldPrice: 14000, price: 8400, qty: 20, expiry: day(3), image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&auto=format&fit=crop&q=85' },
    { id: 'p4', sellerId: 's1', name: 'Tovuq filesi 1 kg', category: 'gosht', oldPrice: 52000, price: 36000, qty: 6, expiry: day(2), image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=900&auto=format&fit=crop&q=85' },
    { id: 'p5', sellerId: 's1', name: 'Pomidor 2 kg', category: 'meva', oldPrice: 24000, price: 12000, qty: 15, expiry: day(2), image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=900&auto=format&fit=crop&q=85' },
    { id: 'p6', sellerId: 's3', name: 'Osh (porsiya)', category: 'taom', oldPrice: 35000, price: 17500, qty: 10, expiry: day(0), image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&auto=format&fit=crop&q=85' },
    { id: 'p7', sellerId: 's3', name: 'Lag‘mon (porsiya)', category: 'taom', oldPrice: 32000, price: 19200, qty: 7, expiry: day(0), image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=900&auto=format&fit=crop&q=85' },
    { id: 'p8', sellerId: 's1', name: 'Olma sharbati 1 litr', category: 'ichimlik', oldPrice: 18000, price: 10800, qty: 18, expiry: day(10), image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=900&auto=format&fit=crop&q=85' },
    { id: 'p9', sellerId: 's1', name: 'Banan 1 kg', category: 'meva', oldPrice: 20000, price: 11000, qty: 14, expiry: day(2), image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=900&auto=format&fit=crop&q=85' },
    { id: 'p10', sellerId: 's2', name: 'Napoleon torti (bo‘lak)', category: 'non', oldPrice: 12000, price: 6000, qty: 9, expiry: day(1), image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&auto=format&fit=crop&q=85' },
  ],
  orders: [],
  session: null,
  favorites: [],
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (s && Array.isArray(s.products) && Array.isArray(s.orders) && Array.isArray(s.sellers)) return { favorites: [], ...s }
    }
  } catch (e) {}
  return seed()
}

let state = load()
const subs = new Set()
function set(next) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) {}
  subs.forEach((f) => f())
}
export const useStore = () =>
  useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => state)

const GEO = {
  s1: { lat: 41.2753, lng: 69.2036, address: "Chilonzor, Bunyodkor ko'chasi 12" },
  s2: { lat: 41.3265, lng: 69.2285, address: "Yunusobod, Amir Temur ko'chasi 45" },
  s3: { lat: 41.301, lng: 69.268, address: "Mirzo Ulug'bek, Universitet ko'chasi 5" },
}
export const geoOf = (s) => {
  if (!s) return { lat: 41.3111, lng: 69.2797, address: 'Toshkent' }
  if (s.lat) return s
  if (GEO[s.id]) return { ...s, ...GEO[s.id] }
  let h = 0
  for (const c of s.id) h = (h * 31 + c.charCodeAt(0)) % 1000
  return { ...s, lat: 41.27 + (h % 100) / 1000, lng: 69.22 + (h % 90) / 1000, address: 'Toshkent shahri' }
}
export const distKm = (a, b) => {
  const r = (x) => (x * Math.PI) / 180
  const d = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(d))
}
export function eco(orders, products) {
  const live = orders.filter((o) => o.status !== 'bekor')
  const items = live.reduce((a, o) => a + o.qty, 0)
  const saved = live.reduce((a, o) => {
    if (o.saved != null) return a + o.saved
    const p = products.find((x) => x.id === o.productId)
    return a + (p ? (p.oldPrice - p.price) * o.qty : 0)
  }, 0)
  return { items, saved, co2: Math.round(items * 25) / 10, water: items * 120 }
}
export const BASE = { items: 1280, saved: 18400000 }
let toasts = []
const tsubs = new Set()
const emit = () => tsubs.forEach((f) => f())
export function notify(msg, type = 'ok') {
  const t = { id: Math.random(), msg, type }
  toasts = [...toasts, t]
  emit()
  setTimeout(() => { toasts = toasts.filter((x) => x !== t); emit() }, 3200)
}
export const useToasts = () => useSyncExternalStore((f) => { tsubs.add(f); return () => tsubs.delete(f) }, () => toasts)

const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

export const actions = {
  saveProduct(p) {
    const exists = state.products.some((x) => x.id === p.id)
    set({
      ...state,
      products: exists ? state.products.map((x) => (x.id === p.id ? p : x)) : [{ ...p, id: uid('p') }, ...state.products],
    })
    notify(exists ? 'Mahsulot yangilandi' : "Mahsulot qo'shildi")
  },
  deleteProduct(id) { set({ ...state, products: state.products.filter((p) => p.id !== id) }); notify("Mahsulot o'chirildi", 'warn') },
  toggleFav(id) {
    const has = state.favorites.includes(id)
    set({ ...state, favorites: has ? state.favorites.filter((x) => x !== id) : [...state.favorites, id] })
    notify(has ? 'Sevimlilardan olib tashlandi' : 'Sevimlilarga qo‘shildi')
  },
  placeOrder({ productId, name, phone, qty }) {
    const p = state.products.find((x) => x.id === productId)
    if (!p) return { ok: false, error: 'Mahsulot topilmadi' }
    if (qty < 1 || qty > p.qty) return { ok: false, error: `Mavjud miqdor: ${p.qty} ta` }
    const order = {
      id: uid('o'), productId, productName: p.name, sellerId: p.sellerId, qty,
      total: qty * p.price, saved: qty * (p.oldPrice - p.price), name, phone,
      pickupAddress: p.pickupAddress || geoOf(state.sellers.find((s) => s.id === p.sellerId)).address,
      pickupLat: p.pickupLat ?? geoOf(state.sellers.find((s) => s.id === p.sellerId)).lat,
      pickupLng: p.pickupLng ?? geoOf(state.sellers.find((s) => s.id === p.sellerId)).lng,
      status: 'yangi', createdAt: new Date().toISOString(),
    }
    set({
      ...state,
      orders: [order, ...state.orders],
      products: state.products.map((x) => (x.id === productId ? { ...x, qty: x.qty - qty } : x)),
    })
    notify('Buyurtma qabul qilindi')
    return { ok: true, order }
  },
  setOrderStatus(id, status) {
    const o = state.orders.find((x) => x.id === id)
    if (!o) return
    let products = state.products
    if (status === 'bekor' && o.status !== 'bekor')
      products = products.map((p) => (p.id === o.productId ? { ...p, qty: p.qty + o.qty } : p))
    if (o.status === 'bekor' && status !== 'bekor')
      products = products.map((p) => (p.id === o.productId ? { ...p, qty: Math.max(0, p.qty - o.qty) } : p))
    set({ ...state, products, orders: state.orders.map((x) => (x.id === id ? { ...x, status } : x)) })
  },
  deleteOrder(id) { set({ ...state, orders: state.orders.filter((o) => o.id !== id) }) },
  loginSeller(name, phone) {
    let s = state.sellers.find((x) => x.name.toLowerCase() === name.trim().toLowerCase())
    let sellers = state.sellers
    if (!s) { s = { id: uid('s'), name: name.trim(), phone }; sellers = [...sellers, s] }
    set({ ...state, sellers, session: { role: 'seller', sellerId: s.id } })
  },
  loginAdmin() { set({ ...state, session: { role: 'admin' } }); notify('Xush kelibsiz, admin') },
  logout() { set({ ...state, session: null }) },
  reset() { set(seed()) },
}

export const money = (n) => Number(n).toLocaleString('ru-RU') + " so'm"
export const discount = (p) => Math.max(0, Math.round((1 - p.price / p.oldPrice) * 100))
export const fmtDate = (d) => new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
export const isExpired = (d) => d < new Date().toISOString().slice(0, 10)