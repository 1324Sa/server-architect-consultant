'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Server3DView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 400;

    // إنشاء المشهد والكاميرا
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2.5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // كابينة السيرفر (Server Rack)
    const rackGroup = new THREE.Group();

    const rackGeo = new THREE.BoxGeometry(1.6, 3.2, 1.2);
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      metalness: 0.8,
      roughness: 0.2,
    });
    const rackFrame = new THREE.Mesh(rackGeo, rackMat);
    rackGroup.add(rackFrame);

    // السيرفرات ولمبات الـ LED
    const leds: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const serverGeo = new THREE.BoxGeometry(1.4, 0.35, 1.1);
      const serverMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.1 });
      const serverMesh = new THREE.Mesh(serverGeo, serverMat);
      serverMesh.position.set(0, -1.2 + i * 0.48, 0.05);

      const ledGeo = new THREE.SphereGeometry(0.03, 16, 16);
      const ledMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ff88 : 0x00bfff });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(-0.5 + (i % 3) * 0.2, -1.2 + i * 0.48, 0.61);

      rackGroup.add(serverMesh);
      rackGroup.add(ledMesh);
      leds.push(ledMesh);
    }

    scene.add(rackGroup);

    // التحريك والتفاعل
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      rackGroup.rotation.y += 0.005;

      const time = Date.now() * 0.003;
      leds.forEach((led, idx) => {
        (led.material as THREE.MeshBasicMaterial).color.setHSL((time + idx * 0.2) % 1, 1, 0.5);
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-cyan-500/30 relative">
      <div className="absolute top-3 right-3 z-10 bg-slate-800/80 backdrop-blur px-3 py-1 rounded text-xs text-cyan-400 border border-cyan-500/30">
        🟢 نموذج 3D تفاعلي للسيرفر (Live Rack)
      </div>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default Server3DView;