import { useEffect, useState } from 'react'
import { useStore, actions, CATEGORIES, catName, money, discount, fmtDate, isExpired, eco, BASE, geoOf } from './store.js'
import { useLoading, Skeletons, Toasts, Heart, FlashBanner, EcoPanel, StoresMap } from './extra.jsx'


function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    heart: <path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />,
    store: <><path d="M3 10.5 4.5 4h15L21 10.5" /><path d="M4 10.5v9h16v-9M9 19.5v-6h6v6" /><path d="M3 10.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" /></>,
    leaf: <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z" /><path d="M4 21c3-5 7-8 13-12" /></>,
    non: <><path d="M4 13c0-4 3-7 8-7s8 3 8 7v6H4v-6Z" /><path d="M8 7c-.5-2 1-3 2-3M14 7c-.5-2 1-3 2-3" /></>,
    sut: <><path d="M8 3h8l2 4v14H6V7l2-4Z" /><path d="M6 7h12M9 3v4" /></>,
    gosht: <><path d="M7 5c3-3 9-2 12 2s2 9-2 12-10 2-13-2-1-9 3-12Z" /><circle cx="14" cy="11" r="2" /></>,
    meva: <><path d="M12 21c-5 0-8-4-8-9 0-4 3-6 8-6s8 2 8 6c0 5-3 9-8 9Z" /><path d="M12 6c0-2 2-4 5-4M12 7c-2-2-4-2-6-2" /></>,
    taom: <><path d="M3 12h18M5 12a7 7 0 0 0 14 0M12 5v2M7 4l1 2M17 4l-1 2" /></>,
    ichimlik: <><path d="M7 3h10l-1 18H8L7 3Z" /><path d="M8 8h8M12 3V1" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" /></>,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.box}</svg>
}

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

function useHash() {
  const [h, setH] = useState(location.hash.slice(1) || '/')
  useEffect(() => {
    const f = () => { setH(location.hash.slice(1) || '/'); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return h
}
const go = (to) => { location.hash = to }
const Link = ({ to, children, ...r }) => <a href={'#' + to} {...r}>{children}</a>

function Navbar({ path }) {
  const { session, favorites } = useStore()
  const [open, setOpen] = useState(false)
  const links = [['/', 'Bosh sahifa'], ['/products', 'Mahsulotlar'], ['/stores', 'Do‘konlar'], ['/favorites', 'Sevimlilar' + (favorites.length ? ' (' + favorites.length + ')' : '')], ['/seller', 'Sotuvchi'], ['/admin', 'Admin']]
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link to="/" className="logo"><span className="brand-mark"><Icon name="leaf" size={19} /></span>Tejamkor<b>.uz</b></Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menyu"><Icon name="menu" size={22} /></button>
        <nav className={open ? 'open' : ''} onClick={() => setOpen(false)}>
          {links.map(([to, t]) => (
            <Link key={to} to={to} className={path === to || (to !== '/' && path.startsWith(to)) ? 'on' : ''}>{t}</Link>
          ))}
          {session && <button className="btn sm ghost" onClick={() => { actions.logout(); go('/') }}>Chiqish</button>}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div>
          <div className="logo light"><span className="brand-mark"><Icon name="leaf" size={19} /></span>Tejamkor<b>.uz</b></div>
          <p>Sotilmay qolgan, lekin yaroqli oziq-ovqatni chegirma bilan sotib oling. Pulni tejang, isrofgarchilikni kamaytiring.</p>
        </div>
        <div><h4>Sahifalar</h4><Link to="/">Bosh sahifa</Link><Link to="/products">Mahsulotlar</Link><Link to="/seller">Sotuvchilar uchun</Link></div>
        <div><h4>Aloqa</h4><span>+998 71 000 00 00</span><span>info@tejamkor.uz</span><div className="soc">{[['Telegram', 'https://t.me/'], ['Instagram', 'https://instagram.com/'], ['Facebook', 'https://facebook.com/'], ['YouTube', 'https://youtube.com/']].map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer">{n}</a>)}</div><span>Toshkent, O‘zbekiston</span></div>
      </div>
      <div className="copy">© {new Date().getFullYear()} Tejamkor.uz — Barcha huquqlar himoyalangan</div>
    </footer>
  )
}

function Card({ p, sellers }) {
  const s = sellers.find((x) => x.id === p.sellerId)
  return (
    <Link to={'/product/' + p.id} className="card">
      <div className="img"><img src={p.image} alt={p.name} loading="lazy" /><span className="badge">-{discount(p)}%</span><Heart id={p.id} /></div>
      <div className="cb">
        <small className="shop"><Icon name="store" size={14} /> {s ? s.name : "Do'kon"}</small>
        <h3>{p.name}</h3>
        <div className="pr"><b>{money(p.price)}</b><s>{money(p.oldPrice)}</s></div>
        <div className="meta"><span className={p.qty <= 5 ? 'low' : ''}>{p.qty <= 5 ? 'Oz qoldi: ' : 'Qoldi: '}{p.qty} ta</span><span><Icon name="clock" size={13} /> {fmtDate(p.expiry)}</span></div>
        <div className="pickup-mini"><Icon name="pin" size={13} /> {p.pickupAddress || geoOf(s).address}</div>
      </div>
    </Link>
  )
}

function Grid({ items, sellers }) {
  if (!items.length) return <div className="empty">Hech narsa topilmadi. Boshqa so‘z yoki kategoriyani sinab ko‘ring.</div>
  return <div className="grid">{items.map((p) => <Card key={p.id} p={p} sellers={sellers} />)}</div>
}

const available = (products) => products.filter((p) => p.qty > 0 && !isExpired(p.expiry))

function Home() {
  const { products, sellers, orders } = useStore()
  const [q, setQ] = useState('')
  const loading = useLoading(500)
  const list = available(products)
  const top = [...list].sort((a, b) => discount(b) - discount(a))
  const sug = q.trim() ? list.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 5) : []
  const e = eco(orders, products)
  const total = { items: BASE.items + e.items, saved: BASE.saved + e.saved, co2: Math.round((BASE.items + e.items) * 25) / 10, water: (BASE.items + e.items) * 120 }
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-l">
            <span className="pill"><Icon name="leaf" size={14} /> ISROFGARCHILIKKA QARSHI PLATFORMA</span>
            <h1>Oziq-ovqatni tejang, <em>pulingizni asrang</em></h1>
            <p>Supermarket, nonvoyxona, kafe va restoranlardagi yaroqli mahsulotlar — 70% gacha chegirma bilan. Yaxshi taom isrof bo‘lmasin.</p>
            <form className="search" onSubmit={(ev) => { ev.preventDefault(); go('/products?q=' + encodeURIComponent(q)) }}>
              <input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Mahsulot qidiring: non, qatiq, osh..." />
              <button className="btn"><Icon name="search" size={16} /> Qidirish</button>
              {sug.length > 0 && <div className="sug">{sug.map((p) => <Link key={p.id} to={'/product/' + p.id}><img src={p.image} alt="" /><span>{p.name}</span><b>{money(p.price)}</b></Link>)}</div>}
            </form>
            <div className="cta"><Link to="/products" className="btn lime">Mahsulotlarni ko‘rish</Link><Link to="/seller" className="btn outline">Do‘kon sifatida qo‘shilish</Link></div>
            <div className="stats"><div><b>{list.length}</b>mahsulot</div><div><b>{sellers.length}</b>hamkor do‘kon</div><div><b>70%</b>gacha chegirma</div></div>
          </div>
          <div className="hero-r">
            {top.slice(0, 3).map((p, i) => (
              <Link key={p.id} to={'/product/' + p.id} className={'float f' + i}><img src={p.image} alt="" /><div><b>{p.name}</b><span>{money(p.price)} <em>-{discount(p)}%</em></span></div></Link>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap sec"><FlashBanner max={top.length ? discount(top[0]) : 0} />
        {loading ? <Skeletons n={4} /> : <Grid items={top.slice(0, 4)} sellers={sellers} />}</section>
      <section className="wrap sec">
        <h2>Kategoriyalar</h2>
        <div className="cats">{CATEGORIES.map((c) => <Link key={c.id} to={'/products?cat=' + c.id} className="cat"><span className="cat-icon"><Icon name={c.id} size={24} /></span>{c.name}</Link>)}</div>
      </section>
      <section className="wrap sec">
        <div className="sec-h"><h2>Eng yaxshi takliflar</h2><Link to="/products" className="more">Hammasi →</Link></div>
        {loading ? <Skeletons n={4} /> : <Grid items={top.slice(4, 12)} sellers={sellers} />}
      </section>
      <section className="wrap sec">
        <h2>Platforma qanday ishlaydi?</h2>
        <div className="how">{[['1', 'Tanlang', 'Chegirmadagi mahsulotni toping'], ['2', 'Band qiling', 'Ism va telefon raqamingizni kiriting'], ['3', 'Oling', 'Do‘kondan o‘zingiz olib keting']].map(([n, t, d]) => <div key={n} className="step"><i>{n}</i><h3>{t}</h3><p>{d}</p></div>)}</div>
      </section>
      <section className="ecosec"><div className="wrap">
        <span className="pill lime"><Icon name="leaf" size={14} /> ECO IMPACT</span><h2>Birgalikda yaratgan ta’sirimiz</h2>
        <p>Har bir qutqarilgan mahsulot — isrof bo‘lmagan taom va tejalgan pul. Ko‘rsatkichlar demo va taxminiy hisob.</p>
        <EcoPanel stats={total} dark />
      </div></section>
      <section className="wrap sec">
        <div className="sec-h"><h2>Hamkor do‘konlar</h2><Link to="/stores" className="more">Xaritada ko‘rish →</Link></div>
        <div className="partners">{sellers.map((s) => <Link key={s.id} to="/stores" className="partner"><i><Icon name="store" size={22} /></i><b>{s.name}</b><small>{geoOf(s).address}</small></Link>)}</div>
      </section>
      <section className="wrap sec"><div className="band"><h2>Do‘koningiz mahsulotini isrof qilmang</h2><p>Bepul ro‘yxatdan o‘ting va sotilmay qolgan mahsulotlarni daromadga aylantiring.</p><Link to="/seller" className="btn lime">Sotuvchi bo‘lish</Link></div></section>
    </>
  )
}

function Favorites() {
  const { products, sellers, favorites } = useStore()
  const list = products.filter((p) => favorites.includes(p.id))
  return (
    <div className="wrap sec"><h2>Sevimli mahsulotlar</h2>
      {list.length ? <Grid items={list} sellers={sellers} /> : <div className="empty">Hali sevimlilar yo‘q. Mahsulot kartochkasidagi sevimli tugmasini bosing.<Link to="/products" className="btn">Mahsulotlarni ko‘rish</Link></div>}
    </div>
  )
}

function StoresPage() {
  return <div className="wrap sec"><h2>Yaqin atrofdagi do‘konlar</h2><StoresMap /></div>
}

function Products({ query }) {
  const { products, sellers } = useStore()
  const params = new URLSearchParams(query)
  const [q, setQ] = useState(params.get('q') || '')
  const [cat, setCat] = useState(params.get('cat') || 'all')
  const [sort, setSort] = useState('new')
  const [maxP, setMaxP] = useState('')
  const loading = useLoading(450)
  useEffect(() => { setQ(params.get('q') || ''); setCat(params.get('cat') || 'all') }, [query])
  let list = available(products).filter(
    (p) => (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()) && (!maxP || p.price <= Number(maxP))
  )
  if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price)
  if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sort === 'disc') list = [...list].sort((a, b) => discount(b) - discount(a))
  return (
    <div className="wrap sec">
      <h2>Barcha mahsulotlar</h2>
      <div className="filters">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mahsulot nomi..." />
        <select value={maxP} onChange={(e) => setMaxP(e.target.value)}><option value="">Narx: hammasi</option><option value="10000">10 000 gacha</option><option value="20000">20 000 gacha</option><option value="40000">40 000 gacha</option></select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Saralash: yangilari</option>
          <option value="asc">Narx: arzondan qimmatga</option>
          <option value="desc">Narx: qimmatdan arzonga</option>
          <option value="disc">Eng katta chegirmalar</option>
        </select>
      </div>
      <div className="chips">
        <button className={cat === 'all' ? 'on' : ''} onClick={() => setCat('all')}>Hammasi</button>
        {CATEGORIES.map((c) => <button key={c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}><Icon name={c.id} size={15} /> {c.name}</button>)}
      </div>
      <p className="count">{list.length} ta mahsulot topildi</p>
      {loading ? <Skeletons n={8} /> : <Grid items={list} sellers={sellers} />}
    </div>
  )
}

function Detail({ id }) {
  const { products, sellers } = useStore()
  const p = products.find((x) => x.id === id)
  const [qty, setQty] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(null)
  if (!p) return <div className="wrap sec"><div className="empty">Mahsulot topilmadi.<br /><Link to="/products" className="btn">Mahsulotlarga qaytish</Link></div></div>
  const s = sellers.find((x) => x.id === p.sellerId)
  const sellerGeo = geoOf(s)
  const pickup = {
    address: p.pickupAddress || sellerGeo.address,
    lat: Number(p.pickupLat ?? sellerGeo.lat),
    lng: Number(p.pickupLng ?? sellerGeo.lng),
  }
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(Number.isFinite(pickup.lat) && Number.isFinite(pickup.lng) ? `${pickup.lat},${pickup.lng}` : pickup.address)}`
  const can = p.qty > 0 && !isExpired(p.expiry)
  const submit = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) return setErr('Ismingizni kiriting')
    if (phone.replace(/\D/g, '').length < 9) return setErr('Telefon raqamini to‘g‘ri kiriting')
    const r = actions.placeOrder({ productId: p.id, name: name.trim(), phone: phone.trim(), qty: Number(qty) })
    if (!r.ok) return setErr(r.error)
    setErr(''); setDone(r.order); setQty(1)
  }
  return (
    <div className="wrap sec">
      <Link to="/products" className="back">← Orqaga</Link>
      <div className="detail">
        <div className="dimg"><img src={p.image} alt={p.name} /><span className="badge">-{discount(p)}%</span><Heart id={p.id} /></div>
        <div>
          <small className="shop"><Icon name="store" size={14} /> {s ? s.name : "Do'kon"} · {catName(p.category)}</small>
          <h1>{p.name}</h1>
          <div className="pr big"><b>{money(p.price)}</b><s>{money(p.oldPrice)}</s></div>
          <ul className="info">
            <li><Icon name="clock" size={16} /> Yaroqlilik muddati: <b>{fmtDate(p.expiry)}</b></li>
            <li><Icon name="box" size={16} /> Mavjud miqdor: <b>{p.qty} ta</b></li>
            <li><Icon name="leaf" size={16} /> Tejaysiz: <b>{money(p.oldPrice - p.price)}</b> (dona uchun)</li>
          </ul>
          <div className="pickup-panel">
            <div className="pickup-heading"><Icon name="pin" size={18} /><b>Olib ketish manzili</b></div>
            <p>{pickup.address}</p>
            <a className="btn ghost sm directions" href={directionsUrl} target="_blank" rel="noreferrer"><Icon name="pin" size={15} /> Xaritada yo‘lni ko‘rish</a>
            <small>Buyurtmani tasdiqlagach, mahsulotni shu manzildan olib ketasiz.</small>
          </div>
          {done ? (
            <div className="ok"><Icon name="check" size={18} /> Buyurtma qabul qilindi!<br />{done.productName} × {done.qty} — {money(done.total)}<br />Do‘kon siz bilan tez orada bog‘lanadi.
              <div className="done-location"><b>Olib ketish manzili:</b> {done.pickupAddress || pickup.address}</div>
              <a className="btn sm" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(done.pickupLat != null && done.pickupLng != null ? `${done.pickupLat},${done.pickupLng}` : (done.pickupAddress || pickup.address))}`} target="_blank" rel="noreferrer">Xaritada yo‘lni ochish</a>
              <div><Link to="/products" className="btn sm ghost">Yana xarid qilish</Link></div></div>
          ) : can ? (
            <form className="form" onSubmit={submit}>
              <h3>Band qilish</h3>
              <label>Miqdori<input type="number" min="1" max={p.qty} value={qty} onChange={(e) => setQty(e.target.value)} /></label>
              <label>Ismingiz<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism" /></label>
              <label>Telefon raqami<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" inputMode="tel" /></label>
              <div className="total">Jami: <b>{money((Number(qty) || 0) * p.price)}</b></div>
              {err && <div className="err">{err}</div>}
              <button className="btn">Buyurtmani tasdiqlash</button>
            </form>
          ) : <div className="err">Bu mahsulot hozir mavjud emas.</div>}
        </div>
      </div>
    </div>
  )
}

function Login({ title, children }) {
  return <div className="wrap sec"><div className="login"><h2>{title}</h2>{children}</div></div>
}

const empty = { name: '', category: 'non', oldPrice: '', price: '', qty: '', expiry: '', image: '', pickupAddress: '', pickupLat: '', pickupLng: '' }

function resize(file, cb) {
  const r = new FileReader()
  r.onload = () => {
    const im = new Image()
    im.onload = () => {
      const k = Math.min(1, 600 / im.width)
      const c = document.createElement('canvas')
      c.width = im.width * k; c.height = im.height * k
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
      cb(c.toDataURL('image/jpeg', 0.75))
    }
    im.src = r.result
  }
  r.readAsDataURL(file)
}

function OrdersTable({ orders, admin }) {
  if (!orders.length) return <div className="empty">Hozircha buyurtmalar yo‘q.</div>
  return (
    <div className="tw"><table>
      <thead><tr><th>Sana</th><th>Mahsulot</th><th>Soni</th><th>Summa</th><th>Mijoz</th><th>Olib ketish joyi</th><th>Holat</th>{admin && <th></th>}</tr></thead>
      <tbody>{orders.map((o) => (
        <tr key={o.id}>
          <td>{fmtDate(o.createdAt)}</td><td>{o.productName}</td><td>{o.qty}</td><td>{money(o.total)}</td>
          <td>{o.name}<br /><small>{o.phone}</small></td>
          <td><a className="more" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.pickupLat != null && o.pickupLng != null ? `${o.pickupLat},${o.pickupLng}` : (o.pickupAddress || 'Toshkent'))}`} target="_blank" rel="noreferrer">{o.pickupAddress || 'Xaritada ochish'} →</a></td>
          <td><select value={o.status} onChange={(e) => actions.setOrderStatus(o.id, e.target.value)}>
            <option value="yangi">Yangi</option><option value="tasdiqlangan">Tasdiqlangan</option><option value="topshirilgan">Topshirilgan</option><option value="bekor">Bekor qilingan</option>
          </select></td>
          {admin && <td><button className="btn sm danger" aria-label="O‘chirish" onClick={() => window.confirm("Buyurtma o'chirilsinmi?") && actions.deleteOrder(o.id)}><Icon name="trash" size={16} /></button></td>}
        </tr>))}</tbody>
    </table></div>
  )
}

function Seller() {
  const { session, sellers, products, orders } = useStore()
  const [n, setN] = useState('')
  const [ph, setPh] = useState('')
  const [tab, setTab] = useState('products')
  const [f, setF] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [err, setErr] = useState('')
  const [locationMsg, setLocationMsg] = useState('')
  if (session?.role !== 'seller')
    return (
      <Login title="Sotuvchi kabineti">
        <p>Do‘koningiz nomini kiriting. Yangi bo‘lsa, avtomatik ro‘yxatdan o‘tasiz. Demo: <b>Non Markazi</b></p>
        <form className="form" onSubmit={(e) => { e.preventDefault(); if (n.trim().length < 2) return setErr('Do‘kon nomini kiriting'); actions.loginSeller(n, ph) }}>
          <label>Do‘kon nomi<input value={n} onChange={(e) => setN(e.target.value)} /></label>
          <label>Telefon<input value={ph} onChange={(e) => setPh(e.target.value)} placeholder="+998..." /></label>
          {err && <div className="err">{err}</div>}
          <button className="btn">Kirish</button>
        </form>
      </Login>
    )
  const me = sellers.find((s) => s.id === session.sellerId)
  const mine = products.filter((p) => p.sellerId === session.sellerId)
  const myOrders = orders.filter((o) => o.sellerId === session.sellerId)
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const capturePickupLocation = () => {
    if (!navigator.geolocation) return setErr('Brauzer joylashuvni aniqlashni qo‘llab-quvvatlamaydi')
    setErr('')
    setLocationMsg('Joylashuv aniqlanmoqda...')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setF((current) => ({ ...current, pickupLat: coords.latitude.toFixed(6), pickupLng: coords.longitude.toFixed(6) }))
        setLocationMsg('Koordinatalar olindi. Manzil satriga do‘konning to‘liq manzilini ham yozing.')
      },
      () => { setLocationMsg(''); setErr('Joylashuv olinmadi. Brauzer ruxsatini tekshiring yoki koordinatalarni qo‘lda kiriting.') },
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }
  const save = (e) => {
    e.preventDefault()
    const oldPrice = Number(f.oldPrice), price = Number(f.price), qty = Number(f.qty)
    if (f.name.trim().length < 2) return setErr('Mahsulot nomini kiriting')
    if (!(oldPrice > 0) || !(price > 0)) return setErr('Narxlarni to‘g‘ri kiriting')
    if (price >= oldPrice) return setErr('Chegirmali narx eski narxdan kichik bo‘lishi kerak')
    if (!(qty >= 1)) return setErr('Miqdorni kiriting')
    if (!f.expiry) return setErr('Yaroqlilik muddatini tanlang')
    if (!f.image) return setErr('Rasm yuklang')
    if (f.pickupAddress.trim().length < 5) return setErr('Mahsulotni olib ketish uchun to‘liq manzil kiriting')
    const pickupLat = Number(f.pickupLat), pickupLng = Number(f.pickupLng)
    if (!String(f.pickupLat).trim() || !String(f.pickupLng).trim() || !Number.isFinite(pickupLat) || pickupLat < -90 || pickupLat > 90 || !Number.isFinite(pickupLng) || pickupLng < -180 || pickupLng > 180) return setErr('Xaritadagi joylashuvni aniqlang yoki koordinatalarni to‘g‘ri kiriting')
    actions.saveProduct({ ...f, id: editId, sellerId: session.sellerId, name: f.name.trim(), oldPrice, price, qty, pickupAddress: f.pickupAddress.trim(), pickupLat, pickupLng })
    setF(empty); setEditId(null); setErr(''); setLocationMsg('')
  }
  return (
    <div className="wrap sec">
      <div className="sec-h"><h2>{me?.name}</h2></div>
      {(() => { const st = eco(myOrders, products); return <div className="kpis"><div><b>{mine.length}</b>Mahsulotlarim</div><div><b>{myOrders.length}</b>Buyurtmalar</div><div><b>{money(myOrders.filter((o) => o.status !== 'bekor').reduce((a, o) => a + o.total, 0))}</b>Daromad</div><div><b>{myOrders.filter((o) => o.status !== 'bekor').reduce((a, o) => a + o.qty, 0)}</b>Qutqarilgan mahsulot</div></div> })()}
      <div className="chips"><button className={tab === 'products' ? 'on' : ''} onClick={() => setTab('products')}>Mahsulotlarim ({mine.length})</button>
        <button className={tab === 'orders' ? 'on' : ''} onClick={() => setTab('orders')}>Buyurtmalar ({myOrders.length})</button></div>
      {tab === 'orders' ? <OrdersTable orders={myOrders} /> : (
        <div className="two">
          <form className="form box" onSubmit={save}>
            <h3>{editId ? 'Mahsulotni tahrirlash' : "Mahsulot qo'shish"}</h3>
            <label>Nomi<input value={f.name} onChange={up('name')} /></label>
            <label>Kategoriya<select value={f.category} onChange={up('category')}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <div className="row2"><label>Eski narx<input type="number" min="0" value={f.oldPrice} onChange={up('oldPrice')} /></label>
              <label>Chegirmali narx<input type="number" min="0" value={f.price} onChange={up('price')} /></label></div>
            <div className="row2"><label>Miqdori<input type="number" min="1" value={f.qty} onChange={up('qty')} /></label>
              <label>Yaroqlilik muddati<input type="date" value={f.expiry} onChange={up('expiry')} /></label></div>
            <div className="pickup-form-section">
              <div className="pickup-form-title"><span><Icon name="pin" size={17} /> Olib ketish joylashuvi</span><small>Xaridor mahsulotni aynan shu joydan oladi</small></div>
              <label>To‘liq manzil<input value={f.pickupAddress || ''} onChange={up('pickupAddress')} placeholder="Masalan: Chilonzor 5-mavze, 12-uy, do‘kon nomi" /></label>
              <button type="button" className="btn ghost sm geo-btn" onClick={capturePickupLocation}><Icon name="pin" size={15} /> Joriy joylashuvimni aniqlash</button>
              <div className="row2"><label>Kenglik (latitude)<input type="number" step="any" value={f.pickupLat || ''} onChange={up('pickupLat')} placeholder="41.3111" /></label>
                <label>Uzunlik (longitude)<input type="number" step="any" value={f.pickupLng || ''} onChange={up('pickupLng')} placeholder="69.2797" /></label></div>
              <small className="field-hint">{locationMsg || 'Joylashuvni aniqlash tugmasini do‘kon turgan joyda bosing. Xaridor xaritada shu nuqtaga yo‘l oladi. Sayt HTTPS yoki localhost orqali ochilgan bo‘lishi kerak.'}</small>
            </div>
            <label>Rasm<input type="file" accept="image/*" onChange={(e) => e.target.files[0] && resize(e.target.files[0], (d) => setF((x) => ({ ...x, image: d })))} /></label>
            {f.image && <img className="prev" src={f.image} alt="" />}
            {err && <div className="err">{err}</div>}
            <button className="btn">{editId ? 'Saqlash' : "Qo'shish"}</button>
            {editId && <button type="button" className="btn ghost" onClick={() => { setF(empty); setEditId(null); setErr('') }}>Bekor qilish</button>}
          </form>
          <div className="list">
            {!mine.length && <div className="empty">Hali mahsulot qo‘shmadingiz.</div>}
            {mine.map((p) => (
              <div className="li" key={p.id}>
                <img src={p.image} alt="" />
                <div><b>{p.name}</b><small>{money(p.price)} · {p.qty} ta · {fmtDate(p.expiry)}</small></div>
                <button className="btn sm ghost" aria-label="Tahrirlash" onClick={() => { setF({ ...empty, ...p, pickupAddress: p.pickupAddress || geoOf(me).address, pickupLat: p.pickupLat ?? geoOf(me).lat, pickupLng: p.pickupLng ?? geoOf(me).lng }); setEditId(p.id); window.scrollTo(0, 0) }}><Icon name="edit" size={16} /></button>
                <button className="btn sm danger" aria-label="O‘chirish" onClick={() => window.confirm("Mahsulot o'chirilsinmi?") && actions.deleteProduct(p.id)}><Icon name="trash" size={16} /></button>
              </div>))}
          </div>
        </div>
      )}
    </div>
  )
}

function Admin() {
  const { session, products, orders, sellers } = useStore()
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('dash')
  if (session?.role !== 'admin')
    return (
      <Login title="Admin panel">
        <form className="form" onSubmit={(e) => { e.preventDefault(); pw === ADMIN_PASS ? actions.loginAdmin() : setErr('Parol noto‘g‘ri') }}>
          <label>Parol<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
          {err && <div className="err">{err}</div>}
          <button className="btn">Kirish</button>
          <small>Demo parol: admin123 (Vercel'da VITE_ADMIN_PASSWORD orqali o‘zgartiring)</small>
        </form>
      </Login>
    )
  const sName = (id) => sellers.find((s) => s.id === id)?.name || '—'
  const tabs = [['dash', 'Dashboard'], ['products', 'Mahsulotlar'], ['orders', 'Buyurtmalar']]
  return (
    <div className="wrap sec">
      <h2>Admin panel</h2>
      <div className="chips">{tabs.map(([k, t]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{t}</button>)}</div>
      {tab === 'dash' && (
        <>
          <div className="kpis">
            <div><b>{products.length}</b>Jami mahsulotlar</div><div><b>{orders.length}</b>Jami buyurtmalar</div>
            <div><b>{sellers.length}</b>Sotuvchilar soni</div><div><b>{money(orders.filter((o) => o.status !== 'bekor').reduce((a, o) => a + o.total, 0))}</b>Buyurtmalar summasi</div>
          </div>
          <h3 className="subh">Eco Impact</h3><EcoPanel stats={eco(orders, products)} />
          <button className="btn ghost" onClick={() => window.confirm("Barcha ma'lumotlar demo holatiga qaytarilsinmi?") && actions.reset()}>Demo ma‘lumotlarni tiklash</button>
        </>
      )}
      {tab === 'products' && (
        <div className="tw"><table>
          <thead><tr><th></th><th>Nomi</th><th>Do‘kon</th><th>Narx</th><th>Soni</th><th>Muddat</th><th></th></tr></thead>
          <tbody>{products.map((p) => (
            <tr key={p.id}><td><img className="th" src={p.image} alt="" /></td><td>{p.name}</td><td>{sName(p.sellerId)}</td><td>{money(p.price)}</td><td>{p.qty}</td><td>{fmtDate(p.expiry)}</td>
              <td><button className="btn sm danger" aria-label="O‘chirish" onClick={() => window.confirm("Mahsulot o'chirilsinmi?") && actions.deleteProduct(p.id)}><Icon name="trash" size={16} /></button></td></tr>))}</tbody>
        </table></div>
      )}
      {tab === 'orders' && <OrdersTable orders={orders} admin />}
    </div>
  )
}

export default function App() {
  const h = useHash()
  const [path, query = ''] = h.split('?')
  let page
  if (path.startsWith('/product/')) page = <Detail id={path.split('/')[2]} key={path} />
  else if (path === '/products') page = <Products query={query} />
  else if (path === '/favorites') page = <Favorites />
  else if (path === '/stores') page = <StoresPage />
  else if (path === '/seller') page = <Seller />
  else if (path === '/admin') page = <Admin />
  else page = <Home />
  return (
    <>
      <Navbar path={path} />
      <main key={path} className="page">{page}</main>
      <Footer />
      <Toasts />
    </>
  )
}
