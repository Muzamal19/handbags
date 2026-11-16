/* ============================================================
   THREE.JS — real-time 3D handbag hero scene
   ============================================================ */

import * as THREE from 'three';

const canvas = document.getElementById('heroCanvas');
const shell  = canvas?.parentElement;
const loader = document.getElementById('canvasLoader');
const hint   = document.getElementById('canvasHint');

if (canvas && shell) init();

function init() {
  /* ---------------- RENDERER ---------------- */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  /* ---------------- SCENE ---------------- */
  const scene = new THREE.Scene();

  /* ---------------- CAMERA ---------------- */
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.5, 7.6);
  camera.lookAt(0, 0, 0);

  /* ---------------- LIGHTS ---------------- */
  const ambient = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(4, 6, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 30;
  scene.add(keyLight);

  const pinkLight = new THREE.PointLight(0xff3d8b, 55, 22);
  pinkLight.position.set(-5, 2.5, 4);
  scene.add(pinkLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 55, 22);
  purpleLight.position.set(5, -1.5, 3);
  scene.add(purpleLight);

  const rimLight = new THREE.PointLight(0x4cc9f0, 40, 20);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  /* ---------------- MATERIALS ---------------- */
  const leatherMat = new THREE.MeshPhysicalMaterial({
    color: 0xff8fab,
    roughness: 0.42,
    metalness: 0.05,
    clearcoat: 0.55,
    clearcoatRoughness: 0.32,
    sheen: 0.5,
    sheenColor: new THREE.Color(0xffd6e2),
    side: THREE.DoubleSide
  });

  const flapMat = new THREE.MeshPhysicalMaterial({
    color: 0xff6f96,
    roughness: 0.38,
    metalness: 0.06,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffd93d,
    roughness: 0.16,
    metalness: 1,
    emissive: 0x4a3800,
    emissiveIntensity: 0.35
  });

  const strapMat = new THREE.MeshPhysicalMaterial({
    color: 0xe05c7e,
    roughness: 0.5,
    metalness: 0.05,
    clearcoat: 0.4
  });

  /* ---------------- BAG GROUP ---------------- */
  const bag = new THREE.Group();
  scene.add(bag);

  /* --- rounded box helper --- */
  function roundedBoxShape(w, h, r) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return s;
  }

  function roundedBox(w, h, depth, radius, mat) {
    const shape = roundedBoxShape(w, h, radius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 6,
      curveSegments: 18
    });
    geo.center();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  /* --- body --- */
  const body = roundedBox(2.9, 2.2, 1.15, 0.42, leatherMat);
  body.position.y = -0.15;
  bag.add(body);

  /* --- flap --- */
  const flap = roundedBox(2.95, 1.05, 1.2, 0.36, flapMat);
  flap.position.set(0, 0.78, 0.02);
  bag.add(flap);

  /* --- clasp --- */
  const clasp = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 32, 32),
    goldMat
  );
  clasp.position.set(0, 0.22, 0.66);
  clasp.castShadow = true;
  bag.add(clasp);

  const claspRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.045, 16, 40),
    goldMat
  );
  claspRing.position.set(0, 0.22, 0.62);
  bag.add(claspRing);

  /* --- handle (torus arc) --- */
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.085, 20, 70, Math.PI),
    strapMat
  );
  handle.position.set(0, 1.02, 0);
  handle.rotation.z = 0;
  handle.castShadow = true;
  bag.add(handle);

  /* --- side straps --- */
  [-1, 1].forEach(side => {
    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.5, 0.1),
      strapMat
    );
    strap.position.set(side * 1.32, 0.35, 0);
    strap.castShadow = true;
    bag.add(strap);
  });

  /* --- metal feet --- */
  [-0.9, 0.9].forEach(x => {
    [-0.45, 0.45].forEach(z => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.08, 20),
        goldMat
      );
      foot.position.set(x, -1.28, z);
      bag.add(foot);
    });
  });

  /* --- inner glow plane (subtle depth) --- */
  const innerGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.6),
    new THREE.MeshBasicMaterial({
      color: 0xffd6e2,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    })
  );
  innerGlow.position.set(0, -0.15, 0.62);
  bag.add(innerGlow);

  /* --- initial pose --- */
  bag.rotation.set(-0.12, -0.55, 0.04);
  bag.position.y = 0.05;
  bag.scale.setScalar(0.92);

  /* ---------------- PARTICLES ---------------- */
  const PARTICLE_COUNT = 140;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const palette = [
    new THREE.Color(0xff3d8b),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0x4cc9f0),
    new THREE.Color(0xffd93d),
    new THREE.Color(0x06d6a0)
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.075,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ---------------- INTERACTION ---------------- */
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velX = 0;
  let velY = 0;
  let autoSpin = 0.0035;
  let idleTimer = 0;
  let pointerX = 0;
  let pointerY = 0;

  function onPointerDown(e) {
    dragging = true;
    idleTimer = 0;
    const p = e.touches ? e.touches[0] : e;
    lastX = p.clientX;
    lastY = p.clientY;
    hint?.classList.add('hide');
    canvas.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    const p = e.touches ? e.touches[0] : e;
    const rect = shell.getBoundingClientRect();
    pointerX = ((p.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((p.clientY - rect.top) / rect.height - 0.5) * 2;

    if (!dragging) return;
    const dx = p.clientX - lastX;
    const dy = p.clientY - lastY;
    lastX = p.clientX;
    lastY = p.clientY;

    velY = dx * 0.006;
    velX = dy * 0.004;

    bag.rotation.y += velY;
    bag.rotation.x += velX;
    bag.rotation.x = Math.max(-0.9, Math.min(0.9, bag.rotation.x));
  }

  function onPointerUp() {
    dragging = false;
    idleTimer = 0;
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);

  /* ---------------- REPLAY 3D ---------------- */
  window.addEventListener('bb:replay3d', () => {
    bag.rotation.set(-0.12, -0.55, 0.04);
    bag.scale.setScalar(0.92);
    velX = 0;
    velY = 0;
    autoSpin = 0.0035;
    idleTimer = 0;
    hint?.classList.remove('hide');
    setTimeout(() => hint?.classList.add('hide'), 2600);
  });

  /* ---------------- RESIZE ---------------- */
  function resize() {
    const w = shell.clientWidth;
    const h = shell.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(shell);
  resize();

  /* ---------------- ANIMATE ---------------- */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    /* idle auto-spin */
    if (!dragging) {
      idleTimer += dt;
      if (idleTimer > 1.2) {
        bag.rotation.y += autoSpin * 60 * dt;
      }
      /* inertia */
      velX *= 0.94;
      velY *= 0.94;
      bag.rotation.y += velY;
      bag.rotation.x += velX;
      bag.rotation.x += (0 - bag.rotation.x) * 0.02;
    }

    /* gentle float */
    bag.position.y = 0.05 + Math.sin(t * 1.1) * 0.09;

    /* mouse parallax */
    bag.rotation.z += (pointerX * 0.06 - bag.rotation.z) * 0.05;
    bag.rotation.x += (pointerY * 0.05 - bag.rotation.x) * 0.02;

    /* lights orbit subtly */
    pinkLight.position.x = -5 + Math.sin(t * 0.5) * 1.6;
    pinkLight.position.y = 2.5 + Math.cos(t * 0.4) * 1.2;
    purpleLight.position.x = 5 + Math.cos(t * 0.45) * 1.6;
    purpleLight.position.y = -1.5 + Math.sin(t * 0.6) * 1.2;
    rimLight.intensity = 36 + Math.sin(t * 1.4) * 10;

    /* particles drift */
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] += 0.0035;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
    }
    pGeo.attributes.position.needsUpdate = true;
    particles.rotation.y = t * 0.03;

    /* pulse clasp */
    clasp.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);

    renderer.render(scene, camera);
  }

  /* ---------------- BOOT ---------------- */
  renderer.compile(scene, camera);
  animate();

  setTimeout(() => loader?.classList.add('hide'), 700);
  setTimeout(() => hint?.classList.add('hide'), 5200);
}