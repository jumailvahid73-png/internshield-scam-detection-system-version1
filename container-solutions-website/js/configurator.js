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
  const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(4.4, 2.4, 5.6);
  camera.lookAt(0, 0, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffe4c4, 1.15);
  key.position.set(6, 9, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x4fae7a, 0.5);
  rim.position.set(-6, 2, -5);
  scene.add(rim);

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

  let bodyMesh = null, ridgeGroup = null, addonGroup = null;

  function buildBody(size, color) {
    if (bodyMesh) { group.remove(bodyMesh); }
    if (ridgeGroup) { group.remove(ridgeGroup); }
    const { length, height, depth } = SIZES[size];

    const geo = new THREE.BoxGeometry(length, height, depth);
    const mat = new THREE.MeshStandardMaterial({ color: COLORS[color], roughness: 0.5, metalness: 0.4 });
    bodyMesh = new THREE.Mesh(geo, mat);
    group.add(bodyMesh);

    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x0a0b08, transparent: true, opacity: 0.5 }));
    bodyMesh.add(line);

    ridgeGroup = new THREE.Group();
    const ridgeCount = Math.max(4, Math.floor(length * 6));
    for (let r = 1; r < ridgeCount; r++) {
      const ridgeGeo = new THREE.BoxGeometry(0.025, height * 0.92, depth + 0.01);
      const ridgeMat = new THREE.MeshStandardMaterial({ color: COLORS[color], roughness: 0.6, metalness: 0.3, transparent: true, opacity: 0.35 });
      const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
      ridge.position.x = -length / 2 + (r * length) / ridgeCount;
      ridgeGroup.add(ridge);
    }
    group.add(ridgeGroup);

    // door lines (end face)
    const doorGeo = new THREE.BoxGeometry(0.02, height * 0.86, depth * 0.9);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x14170f, roughness: 0.6 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.x = length / 2 + 0.01;
    bodyMesh.add(door);

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
      win.position.set(-dims.length * 0.22 + i * dims.length * 0.3, 0.05, dims.depth / 2 + 0.005);
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

  function update(state) {
    const size = SIZES[state.size] ? state.size : '20ft';
    const color = COLORS[state.color] ? state.color : 'orange';
    const dims = buildBody(size, color);
    clearAddons();
    (state.addons || []).forEach(key => {
      if (ADDON_BUILDERS[key]) ADDON_BUILDERS[key](dims, color);
    });
  }

  function onResize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let autoRotate = true;
  mount.addEventListener('pointerdown', () => { autoRotate = false; });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) group.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.5 + 0.3;
    renderer.render(scene, camera);
  }
  animate();

  update({ size: '20ft', color: 'orange', addons: [] });

  return { update, ready: true };
})();
