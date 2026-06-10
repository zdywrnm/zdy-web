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

/* 墨玉球：深色玻璃质感，靠高光与酸性点光源勾边 */
function InkOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.1;
    mesh.current.rotation.y += delta * 0.15;
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, 1.1 + pointer.x * 0.3, 0.045);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, 0.4 + pointer.y * 0.22, 0.045);
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.02;
    mesh.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={mesh} position={[1.1, 0.4, 0]} scale={[1.1, 0.94, 1]}>
      <icosahedronGeometry args={[1.7, 6]} />
      <MeshDistortMaterial
        color="#2c2c22"
        emissive="#3a3d18"
        emissiveIntensity={0.5}
        transparent
        opacity={0.34}
        depthWrite={false}
        roughness={0.24}
        metalness={0.55}
        distort={0.52}
        speed={1.15}
      />
    </mesh>
  );
}

function ParticleRing({ color, opacity, offset = 0 }: { color: string; opacity: number; offset?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1400;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const band = (Math.random() - 0.5) * 1.2;
      const radius = 2.9 + Math.sin(theta * 3 + offset) * 0.22 + Math.random() * 0.42;
      data[i * 3] = Math.cos(theta) * radius;
      data[i * 3 + 1] = Math.sin(theta) * radius * 0.58 + band * 0.22;
      data[i * 3 + 2] = band + Math.cos(theta * 2) * 0.25;
    }
    return data;
  }, [offset]);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * (0.025 + offset * 0.003);
    points.current.rotation.z += delta * 0.016;
  });

  return (
    <points ref={points} rotation={[0.2, offset, -0.1]} position={[1.1, 0.3, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <PointMaterial color={color} size={0.018} sizeAttenuation transparent opacity={opacity} />
    </points>
  );
}

export default function HeroBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 仅在支持 WebGL 且用户未要求减少动效时挂载 3D；否则露出 HeroFallback 静态渐变。
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
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 3, 5]} intensity={1.4} color="#f4f1e4" />
      <pointLight position={[-4, -2, 2]} intensity={2.2} color="#d9f95a" />
      <pointLight position={[3, 2, 1]} intensity={1.4} color="#fffdf2" />
      <ParticleRing color="#d9f95a" opacity={0.5} offset={0.4} />
      <ParticleRing color="#e8e5d6" opacity={0.3} offset={1.7} />
      <InkOrb />
    </Canvas>
  );
}
