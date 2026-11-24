import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useStore, actions, useToasts, geoOf, distKm } from './store.js'


function Icon({ name, size = 18 }) {
  const d = {
    heart: <path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />,
    leaf: <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z" /><path d="M4 21c3-5 7-8 13-12" /></>,
    cart: <><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    store: <><path d="M3 10.5 4.5 4h15L21 10.5" /><path d="M4 10.5v9h16v-9M9 19.5v-6h6v6" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d[name] || d.leaf}</svg>
}

const fmt = (n) => Math.round(n).toLocaleString('ru-RU')

export function useLoading(ms = 500) {
  const [l, setL] = useState(true)
  useEffect(() => { const t = setTimeout(() => setL(false), ms); return () => clearTimeout(t) }, [ms])
  return l
}

export function Skeletons({ n = 4 }) {
  return (
    <div className="grid">
      {Array.from({ length: n }, (_, i) => (
        <div className="card sk" key={i}><div className="img shimmer" /><div className="cb"><i className="shimmer w40" /><i className="shimmer w80" /><i className="shimmer w60" /></div></div>
      ))}
    </div>
  )
}

export function Toasts() {
  const t = useToasts()
  return <div className="toasts">{t.map((x) => <div key={x.id} className={'toast ' + x.type}>{x.msg}</div>)}</div>
}

export function Heart({ id }) {
  const { favorites } = useStore()
  const on = favorites.includes(id)
  return (
    <button className={'heart' + (on ? ' on' : '')} aria-label="Sevimli" onClick={(e) => { e.preventDefault(); e.stopPropagation(); actions.toggleFav(id) }}>
      <Icon name="heart" size={18} />
    </button>
  )
}

function useCountdown() {
  const calc = () => { const end = new Date(); end.setHours(23, 59, 59, 999); return Math.max(0, end - new Date()) }
  const [ms, setMs] = useState(calc)
  useEffect(() => { const t = setInterval(() => setMs(calc()), 1000); return () => clearInterval(t) }, [])
  const p = (n) => String(n).padStart(2, '0')
  return [p(Math.floor(ms / 36e5)), p(Math.floor(ms / 6e4) % 60), p(Math.floor(ms / 1000) % 60)]
}

export function FlashBanner({ max }) {
  const [h, m, s] = useCountdown()
  return (
    <div className="flash">
      <div><span className="pill lime">FLASH SALE</span><h2>Bugungi chegirmalar <em>{max}% gacha</em></h2><p>Taklif kun oxirigacha amal qiladi — ulgurib qoling!</p></div>
      <div className="cd">{[[h, 'soat'], [m, 'daqiqa'], [s, 'soniya']].map(([v, l]) => <div key={l}><b>{v}</b><small>{l}</small></div>)}</div>
    </div>
  )
}

export function EcoPanel({ stats, dark }) {
  const items = [
    ['cart', fmt(stats.items), 'qutqarilgan mahsulot'],
    ['leaf', fmt(stats.saved) + " so'm", 'tejalgan pul'],
    ['leaf', fmt(stats.co2) + ' kg', 'CO₂ kamaygan (taxminan)'],
    ['leaf', fmt(stats.water) + ' L', 'suv tejalgan (taxminan)'],
  ]
  return (
    <div className={'eco' + (dark ? ' dark' : '')}>
      {items.map(([i, v, l]) => <div key={l}><span className="eco-icon"><Icon name={i} size={21} /></span><b>{v}</b><small>{l}</small></div>)}
    </div>
  )
}

export function StoresMap() {
  const { sellers, products } = useStore()
  const box = useRef(null)
  const map = useRef(null)
  const markers = useRef({})
  const [me, setMe] = useState({ lat: 41.3111, lng: 69.2797, demo: true })
  const stores = sellers
    .map((s) => { const g = geoOf(s); return { ...g, km: distKm(me, g), count: products.filter((p) => p.sellerId === s.id && p.qty > 0).length } })
    .sort((a, b) => a.km - b.km)
  useEffect(() => {
    const m = L.map(box.current).setView([41.3111, 69.2797], 12)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m)
    map.current = m
    return () => { m.remove(); map.current = null; markers.current = {} }
  }, [])
  useEffect(() => {
    const m = map.current
    if (!m) return
    Object.values(markers.current).forEach((x) => x.remove())
    markers.current = {}
    stores.forEach((s) => {
      const mk = L.marker([s.lat, s.lng], { icon: L.divIcon({ className: '', html: '<div class="pin"></div>', iconSize: [38, 38], iconAnchor: [19, 38] }) }).addTo(m)
      mk.bindPopup(`<b>${s.name.replace(/</g, '&lt;')}</b><br>${s.address}<br>${s.km.toFixed(1)} km · ${s.count} ta mahsulot`)
      markers.current[s.id] = mk
    })
    const you = L.circleMarker([me.lat, me.lng], { radius: 8, color: '#fff', weight: 3, fillColor: '#00A878', fillOpacity: 1 }).addTo(m).bindPopup('Siz shu yerdasiz' + (me.demo ? ' (demo)' : ''))
    return () => you.remove()
  }, [sellers, products, me])
  const locate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (p) => { setMe({ lat: p.coords.latitude, lng: p.coords.longitude }); map.current && map.current.setView([p.coords.latitude, p.coords.longitude], 13) },
      () => {}
    )
  }
  const pick = (s) => { map.current.flyTo([s.lat, s.lng], 15); markers.current[s.id] && markers.current[s.id].openPopup() }
  return (
    <div className="stores">
      <div className="mapbox" ref={box} />
      <div className="slist">
        <button className="btn ghost sm" onClick={locate}><Icon name="pin" size={15} /> Mening joylashuvim</button>
        {stores.map((s) => (
          <div className="store" key={s.id} onClick={() => pick(s)}>
            <b><Icon name="store" size={15} /> {s.name}</b><small>{s.address}</small>
            <div className="meta"><span>{s.km.toFixed(1)} km</span><span>{s.count} ta mahsulot</span></div>
            <a className="more" href="#/products" onClick={(e) => e.stopPropagation()}>Mahsulotlarni ko‘rish →</a>
          </div>
        ))}
      </div>
    </div>
  )
}
