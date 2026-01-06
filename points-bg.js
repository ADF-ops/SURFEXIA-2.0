window.addEventListener("DOMContentLoaded", () => {
  console.log("[points-bg] loaded");

  const container = document.getElementById("heroPointsCanvas");
  console.log("[points-bg] canvas container:", container);
  if (!container) return;

  if (typeof THREE === "undefined") {
    console.error("[points-bg] THREE is undefined (three.min.js not loaded)");
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  function resize() {
    const r = container.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  const COUNT = 1200;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 6.5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.022,
    transparent: true,
    opacity: 0.7,
    depthWrite: false
  });

  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  function animate() {
    requestAnimationFrame(animate);
    pts.rotation.y += 0.002;
    renderer.render(scene, camera);
  }
  animate();
});
