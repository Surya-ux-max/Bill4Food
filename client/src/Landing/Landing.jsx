import { useState, lazy, Suspense, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  UtensilsCrossed, QrCode, Ticket, ShieldCheck,
  BarChart3, Zap, ChevronRight, CheckCircle2, ArrowRight,
} from 'lucide-react'
import FoodScene3DSection from './FoodScene3D'
const LoginModal = lazy(() => import('./LoginModal'))

const G     = '#16a34a'
const GDARK = '#14532d'
const GLIGHT= '#dcfce7'
const GMID  = '#86efac'
const GMUTE = '#4b7c5e'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

const features = [
  { icon: QrCode,          title: 'Scan & Order',      desc: 'Students scan a QR code or open the web app to browse the live menu instantly.'              },
  { icon: Ticket,          title: 'Token Generation',  desc: 'Every paid order gets a unique FIFO token — no confusion, no duplicate serving.'              },
  { icon: Zap,             title: 'Parallel Billing',  desc: 'Multiple students bill simultaneously across kiosks, eliminating the single-queue bottleneck.' },
  { icon: ShieldCheck,     title: 'Inventory Control', desc: 'Admin sets per-item quantity limits. Orders are auto-rejected when stock runs out.'            },
  { icon: BarChart3,       title: 'Live Monitoring',   desc: 'Canteen managers track item-wise sales and total orders in real time.'                         },
  { icon: UtensilsCrossed, title: 'Counter Verify',    desc: 'Staff enter or scan the token to verify and mark orders as served in one tap.'                 },
]

const steps = [
  { num: '01', role: 'Student',       action: 'Scan QR / Open App', detail: 'No login required for MVP — just open and order.'       },
  { num: '02', role: 'Student',       action: 'Pick Items & Pay',   detail: 'Simulated payment marks the order as Paid instantly.'   },
  { num: '03', role: 'System',        action: 'Token Issued',       detail: 'A unique incremental token is generated for the order.' },
  { num: '04', role: 'Counter Staff', action: 'Verify & Serve',     detail: 'Staff enter the token, confirm the order, and serve.'   },
]

const stats = [
  { value: '< 2s',  label: 'Page Load'        },
  { value: '< 1s',  label: 'Order Processing' },
  { value: '∞',     label: 'Parallel Users'   },
  { value: '100%',  label: 'Queue-Free'        },
]

/* ── Navbar ─────────────────────────────────────────────────── */
function Navbar({ onLogin }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 56px',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${GMID}`,
    }}>
      <span style={{ fontSize: 22, fontWeight: 900, color: GDARK, letterSpacing: '-0.5px' }}>
        Bill<span style={{ color: G }}>4</span>Food
      </span>

      <div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500 }}>
        {[['#features','Features'],['#how','How It Works'],['#stats','Performance']].map(([href, label]) => (
          <a key={href} href={href} style={{ color: GDARK, textDecoration: 'none' }}>{label}</a>
        ))}
      </div>

      <motion.button onClick={onLogin} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
        style={{
          background: G, color: '#fff', fontWeight: 700, fontSize: 14,
          padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
        }}>
        Get Started
      </motion.button>
    </nav>
  )
}

/* ── Hero 3D scene components ───────────────────────────────── */
function HeroParticles({ count = 200 }) {
  const mesh = useRef()
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const c1 = new THREE.Color('#16a34a')
    const c2 = new THREE.Color('#86efac')
    const c3 = new THREE.Color('#dcfce7')
    const palette = [c1, c2, c3]
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.y = clock.getElapsedTime() * 0.03
    mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.08
  })
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

function HeroTorusKnot() {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.x = clock.getElapsedTime() * 0.25
    mesh.current.rotation.y = clock.getElapsedTime() * 0.18
  })
  return (
    <mesh ref={mesh} position={[3.8, 0.5, -1]}>
      <torusKnotGeometry args={[1.1, 0.32, 160, 16]} />
      <meshStandardMaterial color="#16a34a" wireframe transparent opacity={0.22} />
    </mesh>
  )
}

function HeroRing() {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.x = clock.getElapsedTime() * 0.12
    mesh.current.rotation.z = clock.getElapsedTime() * 0.08
  })
  return (
    <mesh ref={mesh} position={[-4, -0.5, -1.5]}>
      <torusGeometry args={[1.4, 0.045, 16, 100]} />
      <meshStandardMaterial color="#86efac" transparent opacity={0.35} />
    </mesh>
  )
}

function HeroIcosahedron() {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.x = clock.getElapsedTime() * 0.2
    mesh.current.rotation.y = clock.getElapsedTime() * 0.3
  })
  return (
    <mesh ref={mesh} position={[-3.2, 2, -2]}>
      <icosahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#dcfce7" wireframe transparent opacity={0.3} />
    </mesh>
  )
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 4]}  intensity={1.2} color="#16a34a" />
      <pointLight position={[-6, -4, 4]} intensity={0.6} color="#86efac" />
      <HeroParticles />
      <HeroTorusKnot />
      <HeroRing />
      <HeroIcosahedron />
    </>
  )
}

/* ── Hero ───────────────────────────────────────────────────── */
function Hero({ onLogin }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      background: '#071a0f',
    }}>
      {/* Three.js canvas — full background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 58 }}>
          <HeroScene />
        </Canvas>
      </div>

      {/* subtle dark gradient overlay so text stays readable */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(7,26,15,0.55) 0%, rgba(7,26,15,0.35) 100%)',
        pointerEvents: 'none',
      }} />

      {/* content */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '120px 24px 80px', textAlign: 'center',
        }}>

        {/* badge */}
        <motion.div variants={fadeUp} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 18px', borderRadius: 999,
          background: 'rgba(22,163,74,0.15)', border: '1px solid #86efac50',
          color: GMID, fontSize: 12, fontWeight: 600, marginBottom: 20,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: G }} />
          Sri Eshwar College of Engineering — Canteen System
        </motion.div>

        {/* headline */}
        <motion.h1 variants={fadeUp} style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', fontWeight: 900,
          lineHeight: 1.08, letterSpacing: '-2px',
          color: '#ffffff', maxWidth: 820, marginBottom: 16,
        }}>
          Bill4Food<br />
          <span style={{ color: GMID }}>for</span>{' '}
          <span style={{ color: 'transparent', WebkitTextStroke: `2px ${G}` }}>Sri Eshwarites</span>
        </motion.h1>

        {/* fancy sub-taglines */}
        <motion.div variants={fadeUp} style={{ marginBottom: 18, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
          {[
            '🍛 Order in Seconds',
            '🎟️ Token. No Drama.',
            '⚡ Zero Queue. Full Plate.',
          ].map(tag => (
            <span key={tag} style={{
              fontSize: 12, fontWeight: 600, padding: '5px 14px',
              borderRadius: 999, border: '1px solid #86efac30',
              background: 'rgba(22,163,74,0.1)', color: GMID,
            }}>{tag}</span>
          ))}
        </motion.div>

        {/* subtext */}
        <motion.p variants={fadeUp} style={{
          fontSize: 17, lineHeight: 1.75,
          color: 'rgba(134,239,172,0.85)',
          maxWidth: 520, marginBottom: 36,
        }}>
          The smartest way to eat at SECE — skip the line, tap to order,
          grab your token & get your food. <span style={{ color: '#fff', fontWeight: 700 }}>That's it.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button onClick={onLogin} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 14, fontWeight: 700,
              background: G, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15,
              boxShadow: '0 4px 24px #16a34a50',
            }}>
            Get Started <ChevronRight size={18} />
          </motion.button>
          <motion.a href="#how" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 14, fontWeight: 600, fontSize: 15,
              background: 'rgba(255,255,255,0.07)',
              color: '#fff', textDecoration: 'none',
              border: '1px solid rgba(134,239,172,0.25)',
            }}>
            How It Works <ArrowRight size={18} />
          </motion.a>
        </motion.div>

        {/* scroll hint */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
          style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: GMID, fontSize: 11, opacity: 0.6 }}>
          <span>scroll</span>
          <div style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${GMID}, transparent)` }} />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ── Features ───────────────────────────────────────────────── */
function Features() {
  return (
    <section id="features" style={{ padding: '64px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <SectionLabel>Core Features</SectionLabel>

        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: GDARK, margin: '8px 0 8px' }}>
          Everything the canteen needs
        </motion.h2>

        <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ color: GMUTE, fontSize: 16, maxWidth: 500, margin: '0 auto 32px' }}>
          From menu management to token verification — all in one lightweight system.
        </motion.p>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp}
              whileHover={{ y: -5, boxShadow: '0 8px 32px #16a34a20' }}
              style={{
                background: '#fff', borderRadius: 20, padding: 28,
                border: `1px solid ${GMID}`, boxShadow: '0 2px 12px #16a34a10',
                textAlign: 'left', cursor: 'default',
              }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: GLIGHT, border: `1px solid ${GMID}`,
              }}>
                <Icon size={22} color={G} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: GDARK, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: GMUTE, lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Stats ──────────────────────────────────────────────────── */
function Stats() {
  return (
    <section id="stats" style={{
      padding: '48px 24px', background: G,
      borderTop: `1px solid ${GMID}`, borderBottom: `1px solid ${GMID}`,
    }}>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32,
        }}>
        {stats.map(({ value, label }) => (
          <motion.div key={label} variants={fadeUp}>
            <div style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff' }}>{value}</div>
            <div style={{ fontSize: 13, marginTop: 8, fontWeight: 500, color: GLIGHT }}>{label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  return (
    <section id="how" style={{ padding: '64px 24px', background: '#f0fdf4' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>

        <SectionLabel>User Flow</SectionLabel>

        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: GDARK, margin: '8px 0 32px' }}>
          Order in 4 simple steps
        </motion.h2>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ position: 'relative' }}>
          {/* vertical line */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 27, width: 2,
            background: `linear-gradient(to bottom, ${G}, ${GMID}, transparent)`,
          }} />

          {steps.map(({ num, role, action, detail }) => (
            <motion.div key={num} variants={fadeUp}
              style={{ display: 'flex', gap: 24, paddingBottom: 28, textAlign: 'left' }}>
              <div style={{
                position: 'relative', zIndex: 1, flexShrink: 0,
                width: 56, height: 56, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 13,
                background: GLIGHT, border: `2px solid ${G}`, color: G,
              }}>
                {num}
              </div>
              <div style={{ paddingTop: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: G }}>{role}</span>
                <h3 style={{ fontWeight: 700, fontSize: 19, color: GDARK, margin: '4px 0 4px' }}>{action}</h3>
                <p style={{ fontSize: 14, color: GMUTE }}>{detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── CTA ────────────────────────────────────────────────────── */
function CTA({ onLogin }) {
  return (
    <section style={{ padding: '64px 24px', background: '#fff' }}>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        style={{ maxWidth: 580, margin: '0 auto' }}>
        <motion.h2 variants={fadeUp}
          style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: GDARK, lineHeight: 1.2 }}>
          Ready to go <span style={{ color: G }}>queue-free</span>?
        </motion.h2>
        <motion.p variants={fadeUp}
          style={{ marginTop: 16, marginBottom: 28, fontSize: 17, color: GMUTE, lineHeight: 1.7 }}>
          Bill4Food is built for Sri Eshwar College of Engineering — fast, lightweight, and parallel.
        </motion.p>
        <motion.div variants={fadeUp}>
          <motion.button onClick={onLogin} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 36px', borderRadius: 14, fontWeight: 700,
              background: G, color: '#fff', border: 'none', fontSize: 15, cursor: 'pointer',
              boxShadow: '0 4px 20px #16a34a30',
            }}>
            <CheckCircle2 size={18} /> Launch App
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      padding: '40px 24px', background: GDARK,
      borderTop: `1px solid ${GMID}`, color: GMID, fontSize: 14,
    }}>
      <div style={{ fontWeight: 900, fontSize: 20, color: '#fff', marginBottom: 8 }}>
        Bill<span style={{ color: GMID }}>4</span>Food
      </div>
      <p>Built for Sri Eshwar College of Engineering — Smart Parallel Billing System</p>
      <p style={{ marginTop: 6, opacity: 0.5 }}>© {new Date().getFullYear()} Bill4Food. All rights reserved.</p>
    </footer>
  )
}

/* ── Section Label ──────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: G,
      marginBottom: 4,
    }}>
      <span style={{ width: 24, height: 1, background: G }} />
      {children}
      <span style={{ width: 24, height: 1, background: G }} />
    </div>
  )
}

/* ── Root ───────────────────────────────────────────────────── */
export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: GDARK, overflowX: 'hidden' }}>
      <Navbar onLogin={() => setLoginOpen(true)} />
      <Hero   onLogin={() => setLoginOpen(true)} />
      <FoodScene3DSection />
      <Features />
      <Stats />
      <HowItWorks />
      <CTA    onLogin={() => setLoginOpen(true)} />
      <Footer />
      {loginOpen && <Suspense fallback={null}><LoginModal onClose={() => setLoginOpen(false)} /></Suspense>}
    </div>
  )
}
