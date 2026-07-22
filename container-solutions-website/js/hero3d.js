// Container Solutions — cinematic 3D hero (Three.js)
(function () {
  const mount = document.querySelector('.hero-canvas');
  if (!mount || typeof THREE === 'undefined') return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return; // keep the static photographic fallback for reduced-motion users

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return; // no WebGL — CSS fallback background stays visible
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x12140f, 0.045);

  const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 1.4, 13);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffd9b8, 1.1);
  key.position.set(6, 8, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x4fae7a, 0.6);
  rim.position.set(-8, 3, -4);
  scene.add(rim);

  // Container group
  const group = new THREE.Group();
  scene.add(group);

  const palette = [0xf26825, 0xd2531a, 0x13733a, 0x0d5029, 0x2a2f26, 0xe8e6de];
  const boxDefs = [
    { pos: [0, 0, 0], size: [3.6, 1.4, 1.4], color: palette[0], rot: 0.02 },
    { pos: [-2.4, -1.5, -1.2], size: [3.6, 1.4, 1.4], color: palette[2], rot: -0.015 },
    { pos: [2.6, -1.4, -0.6], size: [3.0, 1.4, 1.4], color: palette[5], rot: 0.01 },
    { pos: [0.4, 1.5, -1.8], size: [3.2, 1.4, 1.4], color: palette[1], rot: -0.02 },
    { pos: [-2.2, 1.6, 0.6], size: [2.6, 1.4, 1.4], color: palette[3], rot: 0.018 },
    { pos: [3.0, 1.2, 1.4], size: [2.4, 1.2, 1.2], color: palette[4], rot: -0.012 },
    { pos: [-3.2, -0.2, 1.6], size: [2.2, 1.2, 1.2], color: palette[0], rot: 0.014 }
  ];

  const meshes = [];
  boxDefs.forEach((def, i) => {
    const geo = new THREE.BoxGeometry(...def.size, 2, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.55, metalness: 0.35 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...def.pos);
    mesh.rotation.y = def.rot * 10;
    mesh.rotation.x = def.rot * 3;

    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x0a0b08, transparent: true, opacity: 0.45 }));
    mesh.add(line);

    // corrugation-style ridge lines across the long face
    const ridgeCount = Math.floor(def.size[0] * 2.4);
    for (let r = 1; r < ridgeCount; r++) {
      const ridgeGeo = new THREE.BoxGeometry(0.03, def.size[1] * 0.94, def.size[2] * 0.94 + 0.02);
      const ridgeMat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.6, metalness: 0.3, transparent: true, opacity: 0.35 });
      const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
      ridge.position.x = -def.size[0] / 2 + (r * def.size[0]) / ridgeCount;
      mesh.add(ridge);
    }

    group.add(mesh);
    meshes.push({ mesh, base: def.pos.slice(), speed: 0.4 + Math.random() * 0.4, offset: Math.random() * Math.PI * 2 });
  });

  group.position.set(2.6, -0.4, 0);
  group.rotation.y = -0.35;

  // Pointer parallax
  let targetRotY = -0.35, targetRotX = 0;
  let curRotY = targetRotY, curRotX = 0;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      targetRotY = -0.35 + nx * 0.5;
      targetRotX = ny * 0.18;
    }, { passive: true });
  }

  function onResize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    curRotY += (targetRotY - curRotY) * 0.03;
    curRotX += (targetRotX - curRotX) * 0.03;
    group.rotation.y = curRotY + Math.sin(t * 0.06) * 0.04;
    group.rotation.x = curRotX;

    meshes.forEach(m => {
      m.mesh.position.y = m.base[1] + Math.sin(t * m.speed + m.offset) * 0.18;
    });

    renderer.render(scene, camera);
  }
  animate();
})();
