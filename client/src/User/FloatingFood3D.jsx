import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/* ── Biryani Bowl ────────────────────────────────────────────── */
function BiryaniItem({ position, scale = 1 }) {
  const bowl = useRef()
  useFrame(({ clock }) => {
    if (bowl.current) bowl.current.rotation.y = clock.getElapsedTime() * 0.3
  })
  return (
    <group position={position} scale={scale}>
      <mesh ref={bowl} castShadow>
        <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#c2410c" roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[(i - 1) * 0.15, 0.52 + Math.sin(i) * 0.04, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Dosa ────────────────────────────────────────────────────── */
function DosaItem({ position, scale = 1 }) {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.12
    }
  })
  return (
    <group position={position} scale={scale}>
      <mesh ref={mesh} rotation={[0.25, 0, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.6, 0.055, 32]} />
        <meshStandardMaterial color="#d97706" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.055, 0.08]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>
    </group>
  )
}

/* ── Parotta Stack ───────────────────────────────────────────── */
function ParottaItem({ position, scale = 1 }) {
  const group = useRef()
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.4
  })
  return (
    <group ref={group} position={position} scale={scale}>
      {[0, 0.065, 0.13].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.5 - i * 0.02, 0.52 - i * 0.02, 0.05, 32]} />
          <meshStandardMaterial color={['#92400e','#b45309','#d97706'][i]} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0.65, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ── Idli Plate ──────────────────────────────────────────────── */
function IdliItem({ position, scale = 1 }) {
  const group = useRef()
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.25
  })
  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} transparent opacity={0.85} />
      </mesh>
      {[[-0.3, 0], [0.3, 0], [0, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]} castShadow>
          <sphereGeometry args={[0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#f5f5f4" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Noodle Swirl ────────────────────────────────────────────── */
function NoodleItem({ position, scale = 1 }) {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * 0.28
      mesh.current.rotation.z = clock.getElapsedTime() * 0.18
    }
  })
  return (
    <group position={position} scale={scale}>
      <mesh ref={mesh} castShadow>
        <torusKnotGeometry args={[0.34, 0.09, 128, 12, 2, 3]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.55} metalness={0.05} />
      </mesh>
    </group>
  )
}

/* ── Rice Bowl ───────────────────────────────────────────────── */
function RiceItem({ position, scale = 1 }) {
  const bowl = useRef()
  const bits = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    x: (Math.random() - 0.5) * 0.55,
    z: (Math.random() - 0.5) * 0.55,
    color: ['#16a34a','#dc2626','#f59e0b','#f97316'][i % 4],
    s: 0.04 + Math.random() * 0.035,
  })), [])
  useFrame(({ clock }) => {
    if (bowl.current) bowl.current.rotation.y = clock.getElapsedTime() * 0.22
  })
  return (
    <group ref={bowl} position={position} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color="#1c1917" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#fef9c3" roughness={0.95} />
      </mesh>
      {bits.map((b, i) => (
        <mesh key={i} position={[b.x, 0.2, b.z]}>
          <sphereGeometry args={[b.s, 8, 8]} />
          <meshStandardMaterial color={b.color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Token Coin ──────────────────────────────────────────────── */
function TokenCoin({ position, scale = 1 }) {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.9
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.3
    }
  })
  return (
    <group position={position} scale={scale}>
      <mesh ref={mesh} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.07, 32]} />
        <meshStandardMaterial color="#16a34a" roughness={0.15} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.01, 32]} />
        <meshStandardMaterial color="#86efac" roughness={0.1} metalness={0.95} />
      </mesh>
    </group>
  )
}

/* ── Ambient Particles ───────────────────────────────────────── */
function Particles() {
  const mesh = useRef()
  const { pos, col } = useMemo(() => {
    const count = 160
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#16a34a'),
      new THREE.Color('#86efac'),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#f97316'),
      new THREE.Color('#dcfce7'),
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      const c = palette[i % palette.length]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { pos, col }
  }, [])
  useFrame(({ clock }) => {
    if (mesh.current) mesh.current.rotation.y = clock.getElapsedTime() * 0.012
  })
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

/* ── Scene ───────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <pointLight position={[8,  8,  5]} intensity={3.0} color="#16a34a" />
      <pointLight position={[-8, -5, 5]} intensity={2.0} color="#86efac" />
      <pointLight position={[0,  -8, 6]} intensity={1.5} color="#fbbf24" />
      <pointLight position={[0,   6, 8]} intensity={2.0} color="#ffffff" />

      <Particles />

      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.2}>
        <BiryaniItem position={[-5.5, 2.2, 1.5]} scale={1.5} />
      </Float>
      <Float speed={1.0} rotationIntensity={0.4} floatIntensity={1.0}>
        <DosaItem position={[5.2, 2.5, 1]} scale={1.4} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.3}>
        <ParottaItem position={[-4.8, -2.5, 1.5]} scale={1.4} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.45} floatIntensity={1.1}>
        <IdliItem position={[4.5, -2.2, 1]} scale={1.4} />
      </Float>
      <Float speed={1.7} rotationIntensity={0.7} floatIntensity={1.5}>
        <NoodleItem position={[0.8, 3.2, 0]} scale={1.5} />
      </Float>
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1.0}>
        <RiceItem position={[-1.5, -3.2, 1.5]} scale={1.4} />
      </Float>
      <Float speed={2.0} rotationIntensity={0.9} floatIntensity={1.8}>
        <TokenCoin position={[2.5, 0.5, 2]} scale={1.6} />
      </Float>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <BiryaniItem position={[6.5, -0.5, 0]} scale={1.1} />
      </Float>
      <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.9}>
        <NoodleItem position={[-6.2, 0.8, 0]} scale={1.1} />
      </Float>
    </>
  )
}

/* ── Export ──────────────────────────────────────────────────── */
export default function FloatingFood3D() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    }}>
      <Canvas camera={{ position: [0, 0, 9], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <Scene />
      </Canvas>
    </div>
  )
}
