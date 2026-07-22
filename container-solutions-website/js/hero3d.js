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
  scene.fog = new THREE.FogExp2(0x12140f, 0.042);

  const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 1.4, 13);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
  if ('toneMapping' in renderer) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08; }
  mount.appendChild(renderer.domElement);

  // ---------- Lights ----------
  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x0d0f0a, 0.65));
  const key = new THREE.DirectionalLight(0xffdcb0, 1.35);
  key.position.set(7, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -9; key.shadow.camera.right = 9;
  key.shadow.camera.top = 9; key.shadow.camera.bottom = -9;
  key.shadow.camera.near = 1; key.shadow.camera.far = 26;
  key.shadow.bias = -0.0025;
  key.shadow.radius = 3;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x4fae7a, 0.55);
  rim.position.set(-8, 3, -5);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xbcd4ff, 0.25);
  fill.position.set(-3, 2, 6);
  scene.add(fill);

  // ---------- Ground shadow-catcher ----------
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.5 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.35;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------- Container builder ----------
  function addCornerCastings(mesh, L, H, D) {
    const castMat = new THREE.MeshStandardMaterial({ color: 0x15140f, roughness: 0.35, metalness: 0.75 });
    const castGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    [-1, 1].forEach(sx => [-1, 1].forEach(sy => [-1, 1].forEach(sz => {
      const c = new THREE.Mesh(castGeo, castMat);
      c.position.set(sx * (L / 2 - 0.02), sy * (H / 2 - 0.02), sz * (D / 2 - 0.02));
      c.castShadow = true;
      mesh.add(c);
    })));
  }

  function addCorrugation(mesh, L, H, D, baseColor) {
    const ridgeCount = Math.max(6, Math.round(L * 3.2));
    const light = new THREE.Color(baseColor).multiplyScalar(1.14);
    const dark = new THREE.Color(baseColor).multiplyScalar(0.82);
    [1, -1].forEach(faceSign => {
      for (let r = 0; r < ridgeCount; r++) {
        const protrude = r % 2 === 0 ? 0.018 : -0.012;
        const ridgeMat = new THREE.MeshStandardMaterial({ color: r % 2 === 0 ? light : dark, roughness: 0.48, metalness: 0.58 });
        const ridgeGeo = new THREE.BoxGeometry(L / ridgeCount + 0.01, H * 0.9, 0.03);
        const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
        ridge.position.set(-L / 2 + (r + 0.5) * (L / ridgeCount), 0, faceSign * (D / 2 + protrude));
        ridge.castShadow = true;
        mesh.add(ridge);
      }
    });
  }

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
  boxDefs.forEach((def) => {
    const [L, H, D] = def.size;
    const geo = new THREE.BoxGeometry(L, H, D);
    const mat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.42, metalness: 0.58 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(...def.pos);
    mesh.rotation.y = def.rot * 10;
    mesh.rotation.x = def.rot * 3;

    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x0a0b08, transparent: true, opacity: 0.5 }));
    mesh.add(line);

    addCorrugation(mesh, L, H, D, def.color);
    addCornerCastings(mesh, L, H, D);

    // door end detail
    const doorGeo = new THREE.PlaneGeometry(D * 0.86, H * 0.82);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x0d0f0a, roughness: 0.55, metalness: 0.4, side: THREE.DoubleSide });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.rotation.y = Math.PI / 2;
    door.position.set(L / 2 + 0.008, 0, 0);
    mesh.add(door);

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

  // Scroll-driven cinematic camera move: dolly in, crane up, containers rotate
  // away and settle as the hero scrolls out of view.
  let scrollT = 0, targetScrollT = 0;
  window.addEventListener('cs:heroscroll', (e) => { targetScrollT = e.detail.progress; }, { passive: true });

  const baseCamZ = camera.position.z, baseCamY = camera.position.y;
  const baseGroupY = group.position.y;

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    scrollT += (targetScrollT - scrollT) * 0.08;

    curRotY += (targetRotY - curRotY) * 0.03;
    curRotX += (targetRotX - curRotX) * 0.03;
    group.rotation.y = curRotY + Math.sin(t * 0.06) * 0.04 + scrollT * 0.75;
    group.rotation.x = curRotX;
    group.position.y = baseGroupY - scrollT * 1.4;

    camera.position.z = baseCamZ - scrollT * 4.5;
    camera.position.y = baseCamY + scrollT * 1.7;

    meshes.forEach(m => {
      m.mesh.position.y = m.base[1] + Math.sin(t * m.speed + m.offset) * 0.18;
    });

    renderer.render(scene, camera);
  }
  animate();
})();
