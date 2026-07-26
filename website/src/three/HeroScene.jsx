import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  Sparkles,
  OrbitControls,
  Environment,
  Lightformer,
} from '@react-three/drei'
import * as THREE from 'three'

function EnergyLine({ position, length = 1.6, rotation = [0, 0, 0], color = '#00d4ff' }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.material.emissiveIntensity = 1.6 + Math.sin(t * 2 + position[0]) * 0.8
  })
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={[length, 0.02, 0.02]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.6}
        toneMapped={false}
      />
    </mesh>
  )
}

function HoloRing({ radius, speed, tilt, color = '#6fd8ff' }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * speed
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} toneMapped={false} />
    </mesh>
  )
}

function Container() {
  const group = useRef()

  useFrame(({ pointer, clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.rotation.y = t * 0.12 + pointer.x * 0.5
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.15, 0.05)
  })

  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 1, 1)), [])

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
        {/* Main container body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 1, 1]} />
          <meshStandardMaterial
            color="#eef3f7"
            metalness={0.75}
            roughness={0.25}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Matte black base trim */}
        <mesh position={[0, -0.53, 0]}>
          <boxGeometry args={[2.44, 0.08, 1.04]} />
          <meshStandardMaterial color="#0f1115" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Corrugated panel lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[-1.08 + i * 0.24, 0, 0.501]}>
            <boxGeometry args={[0.02, 0.94, 0.004]} />
            <meshStandardMaterial color="#c9d3dc" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}

        {/* Glass / holographic display panel */}
        <mesh position={[0.9, 0.05, 0.505]}>
          <planeGeometry args={[0.6, 0.5]} />
          <meshPhysicalMaterial
            color="#00d4ff"
            transparent
            opacity={0.25}
            emissive="#00bfff"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0}
            transmission={0.4}
          />
        </mesh>

        {/* Carbon fibre accent strip */}
        <mesh position={[0, 0.35, 0.502]}>
          <boxGeometry args={[2.3, 0.08, 0.005]} />
          <meshStandardMaterial color="#1a1c22" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Wireframe edges */}
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#00bfff" transparent opacity={0.35} />
        </lineSegments>

        <EnergyLine position={[-1.22, 0.2, 0.3]} rotation={[0, 0, Math.PI / 2]} length={0.4} />
        <EnergyLine position={[1.22, -0.15, -0.2]} rotation={[0, 0, Math.PI / 2]} length={0.5} />
        <EnergyLine position={[0.3, -0.51, 0.52]} length={1.2} />
      </Float>
    </group>
  )
}

function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]} receiveShadow>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial
          color="#eef4f8"
          metalness={0.6}
          roughness={0.28}
          envMapIntensity={1.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.845, 0]}>
        <ringGeometry args={[1.7, 1.72, 80]} />
        <meshBasicMaterial color="#00bfff" transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} color="#ffffff" castShadow />
      <pointLight position={[-4, 1, -3]} intensity={6} color="#00bfff" />
      <pointLight position={[3, -1, 2]} intensity={4} color="#6fd8ff" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 3, -3]} scale={[6, 4, 1]} color="#e6f7ff" />
        <Lightformer form="rect" intensity={1.4} position={[-4, 1, 2]} scale={[3, 3, 1]} color="#00bfff" />
        <Lightformer form="rect" intensity={1.2} position={[4, 1, 2]} scale={[3, 3, 1]} color="#ffffff" />
      </Environment>
    </>
  )
}

export default function HeroScene({ className }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [3.6, 1.35, 4.1], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#00000000']} />
        <fog attach="fog" args={['#eef8ff', 9, 17]} />
        <Suspense fallback={null}>
          <Lights />
          <group position={[0, -0.85, 0]} scale={0.85}>
            <Container />
            <HoloRing radius={2.1} speed={0.08} tilt={0} color="#00bfff" />
            <HoloRing radius={2.5} speed={-0.05} tilt={0.15} color="#6fd8ff" />
            <Sparkles count={90} scale={[6, 3, 6]} size={2.5} speed={0.3} color="#00d4ff" opacity={0.6} />
            <Floor />
          </group>
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, -0.85, 0]}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 2.4}
          maxPolarAngle={Math.PI / 2.05}
          minAzimuthAngle={-Math.PI / 5}
          maxAzimuthAngle={Math.PI / 5}
        />
      </Canvas>
    </div>
  )
}
