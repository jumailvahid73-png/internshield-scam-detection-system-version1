// Container Solutions — interactive 3D container configurator (Three.js)
window.CSConfigurator = (function () {
  const mount = document.querySelector('.config-canvas');
  if (!mount || typeof THREE === 'undefined') return { update: function () {}, ready: false };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return { update: function () {}, ready: false };
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x12140f, 0.05);

  const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(4.4, 2.4, 5.6);
  camera.lookAt(0, 0, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
  if ('toneMapping' in renderer) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1; }
  mount.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x0d0f0a, 0.6));
  const key = new THREE.DirectionalLight(0xffe4c4, 1.3);
  key.position.set(6, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5; key.shadow.camera.right = 5;
  key.shadow.camera.top = 5; key.shadow.camera.bottom = -5;
  key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  key.shadow.bias = -0.003;
  key.shadow.radius = 3;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x4fae7a, 0.45);
  rim.position.set(-6, 2, -5);
  scene.add(rim);
  const fillLight = new THREE.DirectionalLight(0xbcd4ff, 0.2);
  fillLight.position.set(-2, 1.5, 4);
  scene.add(fillLight);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.45 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const group = new THREE.Group();
  scene.add(group);

  const SIZES = {
    '10ft': { length: 1.6, height: 1.3, depth: 1.3 },
    '20ft': { length: 2.6, height: 1.3, depth: 1.3 },
    '40ft': { length: 4.6, height: 1.3, depth: 1.3 },
    '40hc': { length: 4.6, height: 1.55, depth: 1.3 }
  };
  const COLORS = {
    orange: 0xf26825, green: 0x13733a, slate: 0x3a4048, sandstone: 0xd8c7a1, blue: 0x1f4e8c, red: 0xb3261e
  };

  function addCornerCastings(mesh, L, H, D) {
    const castMat = new THREE.MeshStandardMaterial({ color: 0x15140f, roughness: 0.35, metalness: 0.75 });
    const castGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    [-1, 1].forEach(sx => [-1, 1].forEach(sy => [-1, 1].forEach(sz => {
      const c = new THREE.Mesh(castGeo, castMat);
      c.position.set(sx * (L / 2 - 0.02), sy * (H / 2 - 0.02), sz * (D / 2 - 0.02));
      // No castShadow: 8 per rebuild, shadow map cost with no visible gain.
      // Only the main container mesh casts onto the ground.
      mesh.add(c);
    })));
  }

  function addCorrugation(mesh, L, H, D, colorHex) {
    const ridgeCount = Math.max(6, Math.round(L * 3.4));
    const light = new THREE.Color(colorHex).multiplyScalar(1.14);
    const dark = new THREE.Color(colorHex).multiplyScalar(0.82);
    [1, -1].forEach(faceSign => {
      for (let r = 0; r < ridgeCount; r++) {
        const protrude = r % 2 === 0 ? 0.016 : -0.011;
        const ridgeMat = new THREE.MeshStandardMaterial({ color: r % 2 === 0 ? light : dark, roughness: 0.46, metalness: 0.58 });
        const ridgeGeo = new THREE.BoxGeometry(L / ridgeCount + 0.008, H * 0.9, 0.028);
        const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
        ridge.position.set(-L / 2 + (r + 0.5) * (L / ridgeCount), 0, faceSign * (D / 2 + protrude));
        mesh.add(ridge);
      }
    });
  }

  let bodyMesh = null, addonGroup = null;

  function buildBody(size, color) {
    if (bodyMesh) group.remove(bodyMesh);
    const { length, height, depth } = SIZES[size];
    const colorHex = COLORS[color];

    const geo = new THREE.BoxGeometry(length, height, depth);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.42, metalness: 0.56 });
    bodyMesh = new THREE.Mesh(geo, mat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x0a0b08, transparent: true, opacity: 0.5 }));
    bodyMesh.add(line);

    addCorrugation(bodyMesh, length, height, depth, colorHex);
    addCornerCastings(bodyMesh, length, height, depth);

    // door end detail
    const doorGeo = new THREE.PlaneGeometry(depth * 0.86, height * 0.82);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x0d0f0a, roughness: 0.55, metalness: 0.4, side: THREE.DoubleSide });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.rotation.y = Math.PI / 2;
    door.position.set(length / 2 + 0.006, 0, 0);
    bodyMesh.add(door);

    ground.position.y = -height / 2 - 0.015;

    return { length, height, depth };
  }

  function clearAddons() {
    if (addonGroup) group.remove(addonGroup);
    addonGroup = new THREE.Group();
    group.add(addonGroup);
  }

  function addWindows(dims) {
    const winMat = new THREE.MeshStandardMaterial({ color: 0x9fd8e0, roughness: 0.2, metalness: 0.1, emissive: 0x1a2f33, emissiveIntensity: 0.3 });
    for (let i = 0; i < 2; i++) {
      const geo = new THREE.PlaneGeometry(dims.length * 0.16, dims.height * 0.32);
      const win = new THREE.Mesh(geo, winMat);
      win.position.set(-dims.length * 0.22 + i * dims.length * 0.3, 0.05, dims.depth / 2 + 0.035);
      addonGroup.add(win);
    }
  }

  function addAC(dims) {
    const geo = new THREE.BoxGeometry(dims.length * 0.16, dims.height * 0.14, dims.depth * 0.5);
    const mat = new THREE.MeshStandardMaterial({ color: 0xe9ecef, roughness: 0.4, metalness: 0.5 });
    const ac = new THREE.Mesh(geo, mat);
    ac.position.set(dims.length * 0.32, dims.height / 2 + dims.height * 0.07, 0);
    addonGroup.add(ac);
  }

  function addStaircase(dims) {
    const stepMat = new THREE.MeshStandardMaterial({ color: 0xc7ccc2, roughness: 0.6, metalness: 0.4 });
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BoxGeometry(0.26, 0.05, dims.depth * 0.5);
      const step = new THREE.Mesh(geo, stepMat);
      step.position.set(-dims.length / 2 - 0.15 - i * 0.24, -dims.height / 2 + 0.05 + i * 0.11, 0);
      addonGroup.add(step);
    }
  }

  function addSolar(dims) {
    const geo = new THREE.BoxGeometry(dims.length * 0.7, 0.04, dims.depth * 0.7);
    const mat = new THREE.MeshStandardMaterial({ color: 0x1a2b4a, roughness: 0.25, metalness: 0.6 });
    const panel = new THREE.Mesh(geo, mat);
    panel.position.set(0, dims.height / 2 + 0.03, 0);
    addonGroup.add(panel);
  }

  function addStripe(dims, color) {
    const geo = new THREE.BoxGeometry(dims.length + 0.02, dims.height * 0.12, dims.depth + 0.02);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const stripe = new THREE.Mesh(geo, mat);
    stripe.position.set(0, -dims.height * 0.28, 0);
    addonGroup.add(stripe);
  }

  const ADDON_BUILDERS = { windows: addWindows, ac: addAC, staircase: addStaircase, solar: addSolar, stripe: addStripe };

  const camDir = new THREE.Vector3(4.4, 2.4, 5.6).normalize();

  function update(state) {
    const size = SIZES[state.size] ? state.size : '20ft';
    const color = COLORS[state.color] ? state.color : 'orange';
    const dims = buildBody(size, color);
    clearAddons();
    (state.addons || []).forEach(key => {
      if (ADDON_BUILDERS[key]) ADDON_BUILDERS[key](dims, color);
    });

    // Keep the container comfortably framed regardless of its size: a 10ft
    // and a 40ft box would otherwise look tiny or clipped at a fixed distance.
    const dist = Math.max(5.6, dims.length * 1.15 + 2.7);
    camera.position.copy(camDir).multiplyScalar(dist);
    camera.lookAt(0, -dims.height * 0.05, 0);
  }

  function onResize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // Auto-rotate until the user takes the wheel, then drag to rotate manually
  // (Pointer Events cover mouse, touch and pen with the same handlers).
  let autoRotate = true;
  let isDragging = false;
  let lastX = 0;
  let manualRotationY = 0.3;

  mount.style.touchAction = 'none';
  mount.addEventListener('pointerdown', (e) => {
    autoRotate = false;
    isDragging = true;
    lastX = e.clientX;
    mount.setPointerCapture(e.pointerId);
    mount.style.cursor = 'grabbing';
  });
  mount.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    manualRotationY += dx * 0.012;
    group.rotation.y = manualRotationY;
  });
  const endDrag = () => { isDragging = false; mount.style.cursor = 'grab'; };
  mount.addEventListener('pointerup', endDrag);
  mount.addEventListener('pointercancel', endDrag);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) {
      group.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.5 + 0.3;
    }
    renderer.render(scene, camera);
  }
  animate();

  update({ size: '20ft', color: 'orange', addons: [] });

  return { update, ready: true };
})();
