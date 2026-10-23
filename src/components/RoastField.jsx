import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function beanTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = '#d7b48a';
  ctx.beginPath();
  ctx.ellipse(32, 32, 13, 22, 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5c2e1f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 14);
  ctx.quadraticCurveTo(38, 32, 28, 50);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function RoastField({ drumRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 30);
    camera.position.set(0, 0, 8);

    const count = 160;
    const positions = new Float32Array(count * 3);
    const drift = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      drift[i] = 0.35 + Math.random() * 0.9;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const texture = beanTexture();
    const material = new THREE.PointsMaterial({
      map: texture,
      color: 0xf3e6d0,
      size: 0.16,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      sizeAttenuation: true,
      alphaTest: 0.05
    });
    const beans = new THREE.Points(geometry, material);
    scene.add(beans);

    const dustCount = 280;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustPos[i * 3] = (Math.random() - 0.5) * 16;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc4a574,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    let pointerX = 0;
    let pointerY = 0;
    const onMove = (event) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const resize = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      const time = clock.getElapsedTime();
      const drum = drumRef?.current || 0;
      const beanAttr = geometry.attributes.position;
      const beanArray = beanAttr.array;
      for (let i = 0; i < count; i += 1) {
        const spin = time * (0.55 + drift[i] * 0.12) + i * 0.4;
        const radius = 0.35 + (i % 9) * 0.22;
        beanArray[i * 3] = Math.cos(spin) * radius;
        beanArray[i * 3 + 1] = Math.sin(spin) * radius * 0.7;
        beanArray[i * 3 + 2] = ((i % 6) - 2.5) * 0.28;
      }
      beanAttr.needsUpdate = true;

      const dustAttr = dustGeo.attributes.position;
      const dustArray = dustAttr.array;
      for (let i = 0; i < dustCount; i += 1) {
        const spin = time * 0.35 + i;
        const radius = 1.2 + (i % 5) * 0.45;
        dustArray[i * 3] = Math.cos(spin) * radius;
        dustArray[i * 3 + 1] = Math.sin(spin) * radius * 0.55;
      }
      dustAttr.needsUpdate = true;

      material.color.set('#e2a15a');
      material.size = 0.22;
      material.opacity = drum * 0.92;
      dustMat.color.set('#c4a574');
      dustMat.opacity = drum * 0.35;
      camera.position.x += (pointerX * 0.35 - camera.position.x) * 0.04;
      camera.position.y += (-pointerY * 0.2 - camera.position.y) * 0.04;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      observer.disconnect();
      geometry.dispose();
      dustGeo.dispose();
      material.dispose();
      dustMat.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [drumRef]);

  return <canvas ref={canvasRef} className="hp-roast" aria-hidden="true" />;
}
