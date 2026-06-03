import { MeshDistortMaterial, PointMaterial } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function FluidOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.11;
    mesh.current.rotation.y += delta * 0.16;
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, pointer.x * 0.32, 0.045);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, pointer.y * 0.22, 0.045);
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.018;
    mesh.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={mesh} scale={[1.12, 0.92, 1]}>
      <icosahedronGeometry args={[1.78, 6]} />
      <MeshDistortMaterial
        color="#6366f1"
        emissive="#32105e"
        emissiveIntensity={0.78}
        transparent
        opacity={0.22}
        depthWrite={false}
        roughness={0.34}
        metalness={0.18}
        distort={0.5}
        speed={1.25}
      />
    </mesh>
  );
}

function ParticleRing({ color, offset = 0 }: { color: string; offset?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1400;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const band = (Math.random() - 0.5) * 1.2;
      const radius = 2.85 + Math.sin(theta * 3 + offset) * 0.22 + Math.random() * 0.42;
      data[i * 3] = Math.cos(theta) * radius;
      data[i * 3 + 1] = Math.sin(theta) * radius * 0.62 + band * 0.22;
      data[i * 3 + 2] = band + Math.cos(theta * 2) * 0.25;
    }
    return data;
  }, [offset]);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * (0.025 + offset * 0.003);
    points.current.rotation.z += delta * 0.018;
  });

  return (
    <points ref={points} rotation={[0.2, offset, -0.08]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <PointMaterial color={color} size={0.018} sizeAttenuation transparent opacity={0.72} />
    </points>
  );
}

export default function HeroBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 仅在支持 WebGL 且用户未要求减少动效时挂载 3D；否则露出 HeroFallback 静态渐变球。
    setReady(hasWebGL() && !prefersReducedMotion());
  }, []);

  if (!ready) return null;

  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.4], fov: 44 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 3, 5]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={2.4} color="#22d3ee" />
      <pointLight position={[3, 2, 1]} intensity={2.2} color="#8b5cf6" />
      <ParticleRing color="#22d3ee" offset={0.4} />
      <ParticleRing color="#8b5cf6" offset={1.7} />
      <FluidOrb />
    </Canvas>
  );
}
