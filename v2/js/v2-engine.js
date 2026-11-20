/**
 * PTAR Shelfcraft - Version 2 3D Graphics & Physics Engine
 * Three.js WebGL 2, Procedural Books, Dynamic Spine Canvas Stamping, & Tactile Shelf Rails
 */

import * as THREE from './vendor/three.module.js';

export class V2ShelfEngine {
  constructor(containerElement, audio) {
    this.container = containerElement;
    this.audio = audio;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.targetMouse = new THREE.Vector2();

    this.books = [];          // Senarai objek buku 3D di rak
    this.slots = [];          // Koordinat X slot rak
    this.selectedBook = null; // Buku yang sedang diheret
    this.candidateBook = null;// Buku sasaran apabila pointer ditekan
    this.tapSelectedBook = null; // Buku yang dipilih melalui ketikan (Tap-to-Swap)
    this.pointerDownPos = null;  // Kedudukan awal pointer
    this.hoveredBook = null;  // Buku di bawah kursor
    this.inspectedBook = null;// Buku dalam mod 3D Inspection
    this.isDragging = false;
    this.dragPlane = new THREE.Plane();
    this.planeIntersect = new THREE.Vector3();

    this.dustParticles = null;
    this.animFrameId = null;

    this.onBookSwapped = null; // Callback apabila susunan bertukar
    this.onInspectRequested = null;

    this.initScene();
    this.initLighting();
    this.initBookshelfEnvironment();
    this.initDustMotes();
    this.bindEvents();
    this.updateCameraFraming();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x161e2e);
    this.scene.fog = new THREE.Fog(0x161e2e, 8, 30);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50);
    this.camera.position.set(0, 0.08, 4.4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    // Pastikan touch-action: none pada kanvas untuk sentuhan telefon pintar lancar
    this.renderer.domElement.style.touchAction = 'none';

    this.container.appendChild(this.renderer.domElement);
  }

  // Pelarasan Kamera Responsif mengikut nisbah skrin (Portrait, Landscape, Desktop)
  updateCameraFraming() {
    if (!this.renderer || !this.camera || !this.container) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / height;

    this.camera.aspect = aspect;

    const vFovRad = (this.camera.fov * Math.PI) / 180;
    const tanHalfFov = Math.tan(vFovRad / 2);

    let targetWidth = 4.4;
    let targetHeight = 2.8;
    let targetY = 0.08;

    if (aspect < 0.65) {
      // Skrin telefon menegak tinggi (Portrait e.g. 390x844, 412x915)
      targetWidth = 3.75;
      targetHeight = 2.6;
      targetY = -0.06; // Seimbangkan kedudukan buku di tengah antara bar atas & bawah
    } else if (aspect < 1.0) {
      // Skrin tablet menegak (e.g. 3:4 portrait)
      targetWidth = 4.2;
      targetHeight = 2.8;
      targetY = 0.02;
    } else if (height < 520) {
      // Skrin telefon melintang (Phone landscape e.g. 844x390, 740x360)
      targetWidth = 5.0;
      targetHeight = 3.5; // Mengundurkan kamera sedikit supaya buku muat menegak
      targetY = -0.05;
    }

    const zForWidth = targetWidth / (2 * tanHalfFov * aspect);
    const zForHeight = targetHeight / (2 * tanHalfFov);
    const requiredZ = Math.max(zForWidth, zForHeight, 4.4);

    this.baseCameraY = targetY;
    this.camera.position.z = requiredZ;
    this.camera.position.y = targetY;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  initLighting() {
    // 1. Cahaya ambien hangat dan terang untuk menerangi keseluruhan rak
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.8);
    this.scene.add(ambientLight);

    // 2. Lampu utama hadapan yang menerangi terus muka tulang buku (Spines)
    const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
    frontLight.position.set(0, 1.2, 4.2);
    this.scene.add(frontLight);

    // 3. Lampu tumpu atas rak (Warm overhead library lamp)
    const shelfLamp = new THREE.SpotLight(0xffecd1, 3.5);
    shelfLamp.position.set(0, 3.2, 2.5);
    shelfLamp.angle = Math.PI / 2.5;
    shelfLamp.penumbra = 0.5;
    shelfLamp.decay = 1.0;
    shelfLamp.distance = 12;
    shelfLamp.castShadow = true;
    shelfLamp.shadow.mapSize.width = 1024;
    shelfLamp.shadow.mapSize.height = 1024;
    shelfLamp.shadow.bias = -0.0005;
    this.scene.add(shelfLamp);

    // 4. Cahaya pengisi sisi kiri (Sejuk lembut)
    const leftFill = new THREE.DirectionalLight(0x93c5fd, 0.8);
    leftFill.position.set(-3.5, 2, 2);
    this.scene.add(leftFill);

    // 5. Cahaya pengisi sisi kanan (Emas lembut)
    const rightFill = new THREE.DirectionalLight(0xfde68a, 0.8);
    rightFill.position.set(3.5, 2, 2);
    this.scene.add(rightFill);
  }

  initBookshelfEnvironment() {
    // 1. Papan Tapak Rak Kayu (Warm Mahogany Shelf Plank)
    const plankGeo = new THREE.BoxGeometry(4.8, 0.18, 1.8);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x784421,
      roughness: 0.6,
      metalness: 0.05
    });
    const plank = new THREE.Mesh(plankGeo, woodMat);
    plank.position.set(0, -1.05, 0);
    plank.receiveShadow = true;
    plank.castShadow = true;
    this.scene.add(plank);

    // Jalur kemasan tepi papan kayu (Bright Golden Brass Trim)
    const trimGeo = new THREE.BoxGeometry(4.82, 0.03, 0.03);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25
    });
    const trim = new THREE.Mesh(trimGeo, brassMat);
    trim.position.set(0, -0.96, 0.91);
    this.scene.add(trim);

    // 2. Dinding Belakang Rak (Alcove Backplate)
    const backGeo = new THREE.PlaneGeometry(5.2, 3.2);
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x241d1a,
      roughness: 0.85,
      metalness: 0.02
    });
    const backplate = new THREE.Mesh(backGeo, backMat);
    backplate.position.set(0, 0.45, -0.9);
    backplate.receiveShadow = true;
    this.scene.add(backplate);

    // 3. Penahan Buku Tembaga Kiri & Kanan (Brass Bookends)
    const bookendGeo = new THREE.BoxGeometry(0.08, 1.4, 1.2);
    const leftBookend = new THREE.Mesh(bookendGeo, brassMat);
    leftBookend.position.set(-2.0, -0.35, 0);
    leftBookend.castShadow = true;
    this.scene.add(leftBookend);

    const rightBookend = new THREE.Mesh(bookendGeo, brassMat);
    rightBookend.position.set(2.0, -0.35, 0);
    rightBookend.castShadow = true;
    this.scene.add(rightBookend);
  }

  initDustMotes() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3 + 0.5;

      speeds.push({
        y: Math.random() * 0.002 + 0.001,
        osc: Math.random() * Math.PI * 2,
        oscSpeed: Math.random() * 0.02 + 0.01
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dustSpeeds = speeds;

    const material = new THREE.PointsMaterial({
      color: 0xfff7ed,
      size: 0.025,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dustParticles);
  }

  // Muat dan bina barisan 5 buku di rak bagi sesuatu tahap
  loadLevelBooks(booksData) {
    // Bersihkan buku lama jika ada
    this.books.forEach(b => {
      this.scene.remove(b.mesh);
      b.materials.forEach(m => m.dispose());
      if (b.spineTexture) b.spineTexture.dispose();
    });
    this.books = [];
    this.slots = [];
    this.selectedBook = null;
    this.candidateBook = null;
    this.tapSelectedBook = null;
    this.hoveredBook = null;

    const count = booksData.length;
    const spacing = 0.65;
    const startX = -((count - 1) * spacing) / 2;

    booksData.forEach((data, index) => {
      const slotX = startX + index * spacing;
      this.slots.push(slotX);

      const bookObj = this.createProceduralBook(data, slotX, index);
      this.books.push(bookObj);
      this.scene.add(bookObj.mesh);
    });

    this.updateCameraFraming();
  }

  createProceduralBook(data, targetX, slotIndex) {
    // Dimensi buku yang pelbagai (variasi ketinggian & ketebalan)
    const width = 0.38;
    const height = 1.95 + (slotIndex % 3) * 0.12;
    const depth = 1.35;

    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Jana tema warna cerah mengikut nama warna
    const theme = this.getColorTheme(data);

    // Jana tekstur kanvas 2D resolusi tinggi untuk tulang buku (Spine)
    const spineTexture = this.generateSpineTexture(data, height);
    spineTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    // Bahan Kulit Buku (PBR cerah & berkualiti tinggi)
    const coverColor = new THREE.Color(theme.cover);

    // Muka bahan BoxGeometry(width, height, depth):
    // 0: +X (Cover kanan), 1: -X (Cover kiri)
    // 2: +Y (Halaman atas), 3: -Y (Tapak bawah)
    // 4: +Z (Spine/Tulang buku menghadap kamera)
    // 5: -Z (Fore-edge/Halaman menghadap belakang rak)
    const pageMat = new THREE.MeshStandardMaterial({ color: 0xfef9eb, roughness: 0.8, metalness: 0.0 });
    const coverMat = new THREE.MeshStandardMaterial({ color: coverColor, roughness: 0.45, metalness: 0.1 });
    const spineMat = new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.35,
      metalness: 0.1
    });

    const materials = [coverMat, coverMat, pageMat, pageMat, spineMat, pageMat];
    const mesh = new THREE.Mesh(geometry, materials);

    // Kedudukan awal di atas rak kayu
    mesh.position.set(targetX, -0.96 + height / 2, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData = {
      bookData: data,
      slotIndex: slotIndex,
      currentSlot: slotIndex,
      targetX: targetX,
      baseY: -0.96 + height / 2,
      baseZ: 0,
      width: width,
      height: height,
      isInspected: false
    };

    return {
      mesh: mesh,
      materials: materials,
      spineTexture: spineTexture,
      data: data,
      currentSlot: slotIndex,
      targetX: targetX
    };
  }

  getColorTheme(data) {
    const name = (data.color && data.color.name ? data.color.name.toLowerCase() : '');
    const themes = {
      'kuning': { top: '#fef08a', mid: '#f59e0b', bot: '#b45309', cover: '#d97706', text: '#000000' },
      'hijau':  { top: '#86efac', mid: '#22c55e', bot: '#15803d', cover: '#16a34a', text: '#ffffff' },
      'biru':   { top: '#93c5fd', mid: '#3b82f6', bot: '#1d4ed8', cover: '#2563eb', text: '#ffffff' },
      'merah':  { top: '#fca5a5', mid: '#ef4444', bot: '#b91c1c', cover: '#dc2626', text: '#ffffff' },
      'kelabu': { top: '#e2e8f0', mid: '#94a3b8', bot: '#475569', cover: '#64748b', text: '#000000' },
      'ungu':   { top: '#d8b4fe', mid: '#a855f7', bot: '#7e22ce', cover: '#9333ea', text: '#ffffff' },
      'oren':   { top: '#fed7aa', mid: '#f97316', bot: '#c2410c', cover: '#ea580c', text: '#ffffff' }
    };
    return themes[name] || { top: '#93c5fd', mid: '#3b82f6', bot: '#1d4ed8', cover: '#2563eb', text: '#ffffff' };
  }

  generateSpineTexture(data, height) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const theme = this.getColorTheme(data);

    // 1. Latar Belakang Warna Tulang Buku yang Terang & Berseri (Vibrant Vertical Gradient)
    const spineGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    spineGrad.addColorStop(0, theme.top);
    spineGrad.addColorStop(0.35, theme.mid);
    spineGrad.addColorStop(0.85, theme.bot);
    spineGrad.addColorStop(1, theme.mid);
    ctx.fillStyle = spineGrad;
    ctx.fillRect(0, 0, 256, 1024);

    // 2. Kilauan 3D Silinder Tulang yang Lembut (Curved Sheen, bukan gelap pekat)
    const sheen = ctx.createLinearGradient(0, 0, 256, 0);
    sheen.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
    sheen.addColorStop(0.2, 'rgba(255, 255, 255, 0.45)');
    sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    sheen.addColorStop(0.82, 'rgba(0, 0, 0, 0.12)');
    sheen.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, 256, 1024);

    // 3. Jalur Emas Tembaga Klasik (Embossed Gold Ribs)
    [90, 150, 420, 920].forEach(y => {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(16, y, 224, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(16, y, 224, 3);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(16, y + 9, 224, 3);
    });

    // 4. Tipografi Emas Koleksi PTAR
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PTAR COLLECTION', 128, 220);
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('UiTM LIBRARY', 128, 250);
    ctx.restore();

    // 5. Pelekat Putih Nombor Panggilan Rasmi LCC (High Contrast White Sticker)
    const stickerY = 480;
    const stickerH = 380;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 12;
    if (ctx.roundRect) {
      ctx.roundRect(16, stickerY, 224, stickerH, 14);
    } else {
      ctx.fillRect(16, stickerY, 224, stickerH);
    }
    ctx.fill();

    // Sempadan pelekat
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Teks Nombor Panggilan LCC (Font Monospace Hitam Pekat, Besar & Sangat Jelas)
    ctx.fillStyle = '#090d16';
    ctx.font = '900 40px "Courier New", Courier, monospace';
    ctx.textAlign = 'left';

    const lines = (data.lines && data.lines.length) ? data.lines : [data.callNumber];
    const lineSpacing = 52;
    const startTextY = stickerY + 62;

    lines.forEach((line, i) => {
      ctx.fillText(line, 36, startTextY + i * lineSpacing);
    });

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Interaksi Heret & Ketik (Spring Physics, Touch Drag & Tap-to-Swap)
  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.onResize(), 150);
    });

    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => this.onPointerDown(e), { passive: false });
    dom.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
    dom.addEventListener('pointerup', (e) => this.onPointerUp(e));
    dom.addEventListener('pointercancel', (e) => this.onPointerCancel(e));
    dom.addEventListener('dblclick', (e) => this.onDoubleClick(e));
  }

  onResize() {
    this.updateCameraFraming();
  }

  getPointerCoords(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      clientX: e.clientX,
      clientY: e.clientY
    };
  }

  onPointerDown(e) {
    if (this.inspectedBook) return;

    this.pointerDownPos = { x: e.clientX, y: e.clientY };
    this.isDragging = false;
    this.candidateBook = null;

    const coords = this.getPointerCoords(e);
    this.mouse.set(coords.x, coords.y);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshes = this.books.map(b => b.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const hitBook = this.books.find(b => b.mesh === hitMesh);

      if (hitBook) {
        this.candidateBook = hitBook;

        // Kunci penunjuk ke kanvas supaya seretan jari tidak terlepas di skrin sentuh
        try {
          this.renderer.domElement.setPointerCapture(e.pointerId);
        } catch (err) {}

        this.dragPlane.setFromNormalAndCoplanarPoint(
          new THREE.Vector3(0, 0, 1),
          hitMesh.position
        );

        if (e.pointerType === 'touch') {
          e.preventDefault();
        }
      }
    } else {
      // Ketik di kawasan kosong: nyahpilih buku yang sedang dipilih
      if (this.tapSelectedBook) {
        this.audio.playDrop(this.tapSelectedBook.mesh.position.x / 2.5, false);
        this.tapSelectedBook = null;
      }
    }
  }

  onPointerMove(e) {
    const coords = this.getPointerCoords(e);
    this.targetMouse.set(coords.x, coords.y);

    if (this.inspectedBook) {
      if (e.buttons === 1 || e.pointerType === 'touch') {
        this.inspectedBook.mesh.rotation.y += (e.movementX || 0) * 0.01;
        this.inspectedBook.mesh.rotation.x += (e.movementY || 0) * 0.01;
      }
      return;
    }

    // Semak sama ada pergerakan melebihi 7px untuk mengaktifkan mod heret (Drag Mode)
    if (this.candidateBook && !this.isDragging) {
      const startPos = this.pointerDownPos || { x: e.clientX, y: e.clientY };
      const dist = Math.hypot(e.clientX - startPos.x, e.clientY - startPos.y);

      if (dist > 7) {
        this.isDragging = true;
        this.selectedBook = this.candidateBook;
        if (this.tapSelectedBook) {
          this.tapSelectedBook = null;
        }
        this.audio.playPickup(this.selectedBook.mesh.position.x / 2.5);
      }
    }

    if (this.isDragging && this.selectedBook) {
      this.mouse.set(coords.x, coords.y);
      this.raycaster.setFromCamera(this.mouse, this.camera);

      if (this.raycaster.ray.intersectPlane(this.dragPlane, this.planeIntersect)) {
        const clampedX = Math.max(
          this.slots[0] - 0.35,
          Math.min(this.slots[this.slots.length - 1] + 0.35, this.planeIntersect.x)
        );
        this.selectedBook.mesh.position.x = clampedX;
        this.selectedBook.mesh.position.z = 0.38;
        this.selectedBook.mesh.position.y = this.selectedBook.mesh.userData.baseY + 0.16;
        this.selectedBook.mesh.rotation.x = 0.18;

        this.updateNeighborParting(clampedX);
      }
    } else if (e.pointerType !== 'touch') {
      // Hover check untuk tetikus komputer sahaja
      this.mouse.set(coords.x, coords.y);
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const meshes = this.books.map(b => b.mesh);
      const intersects = this.raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitBook = this.books.find(b => b.mesh === intersects[0].object);
        if (this.hoveredBook !== hitBook) {
          this.hoveredBook = hitBook;
          this.renderer.domElement.style.cursor = 'grab';
        }
      } else {
        this.hoveredBook = null;
        this.renderer.domElement.style.cursor = 'default';
      }
    }
  }

  onPointerUp(e) {
    try {
      this.renderer.domElement.releasePointerCapture(e.pointerId);
    } catch (err) {}

    // 1. Jika pengguna selesai mengheret (Drag & Drop)
    if (this.isDragging && this.selectedBook) {
      this.isDragging = false;
      const currentX = this.selectedBook.mesh.position.x;

      let nearestSlotIdx = 0;
      let minDistance = 9999;
      this.slots.forEach((sx, idx) => {
        const dist = Math.abs(currentX - sx);
        if (dist < minDistance) {
          minDistance = dist;
          nearestSlotIdx = idx;
        }
      });

      const oldSlotIdx = this.books.indexOf(this.selectedBook);
      if (oldSlotIdx !== -1 && oldSlotIdx !== nearestSlotIdx) {
        this.swapBookSlots(oldSlotIdx, nearestSlotIdx);
      } else {
        this.audio.playDrop(currentX / 2.5, false);
      }

      this.selectedBook.mesh.rotation.x = 0;
      this.selectedBook = null;
      this.candidateBook = null;
      return;
    }

    // 2. Jika pengguna hanya mengetik (Tap-to-Select & Tap-to-Swap)
    if (this.candidateBook) {
      const clickedBook = this.candidateBook;
      this.candidateBook = null;

      if (!this.tapSelectedBook) {
        // Ketik kali pertama: Angkat dan pilih buku
        this.tapSelectedBook = clickedBook;
        this.audio.playPickup(clickedBook.mesh.position.x / 2.5);
      } else if (this.tapSelectedBook === clickedBook) {
        // Ketik buku yang sama sekali lagi: Nyahpilih
        this.audio.playDrop(clickedBook.mesh.position.x / 2.5, false);
        this.tapSelectedBook = null;
      } else {
        // Ketik buku lain: Tukar kedudukan kedua-dua buah buku serta-merta!
        const idxA = this.books.indexOf(this.tapSelectedBook);
        const idxB = this.books.indexOf(clickedBook);

        if (idxA !== -1 && idxB !== -1) {
          this.swapBookSlots(idxA, idxB);
        }
        this.tapSelectedBook = null;
      }
    }
  }

  onPointerCancel(e) {
    try {
      this.renderer.domElement.releasePointerCapture(e.pointerId);
    } catch (err) {}

    if (this.isDragging && this.selectedBook) {
      this.isDragging = false;
      this.selectedBook.mesh.rotation.x = 0;
      this.selectedBook = null;
    }
    this.candidateBook = null;
  }

  swapBookSlots(fromIdx, toIdx) {
    const bookA = this.books[fromIdx];
    const bookB = this.books[toIdx];

    this.books[fromIdx] = bookB;
    this.books[toIdx] = bookA;

    this.audio.playDrop(this.slots[toIdx] / 2.5, false);

    if (this.onBookSwapped) {
      this.onBookSwapped();
    }
  }

  onDoubleClick(e) {
    const coords = this.getPointerCoords(e);
    this.mouse.set(coords.x, coords.y);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshes = this.books.map(b => b.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitBook = this.books.find(b => b.mesh === intersects[0].object);
      if (hitBook && this.onInspectRequested) {
        this.onInspectRequested(hitBook);
      }
    }
  }

  // Anjakan buku bersebelahan apabila buku diheret berhampiran (Spring Parting)
  updateNeighborParting(dragX) {
    this.books.forEach((book, idx) => {
      if (book === this.selectedBook) return;
      const defaultSlotX = this.slots[idx];
      const dist = dragX - defaultSlotX;

      if (Math.abs(dist) < 0.35) {
        // Tolak ke kiri atau kanan sedikit
        const pushDir = dist > 0 ? -0.1 : 0.1;
        book.targetX = defaultSlotX + pushDir;
      } else {
        book.targetX = defaultSlotX;
      }
    });
  }

  // Masuk Mod Pemeriksaan 3D 360-Darjah (Inspection Mode)
  inspectBook(book) {
    this.inspectedBook = book;
  }

  closeInspection() {
    if (this.inspectedBook) {
      this.inspectedBook.mesh.rotation.set(0, 0, 0);
      this.inspectedBook = null;
    }
  }

  // Gelung Animasi 60 FPS
  animate() {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    // 1. Damped Camera Parallax (Gerakan kamera halus mengikut tetikus)
    if (!this.inspectedBook) {
      const baseCamY = this.baseCameraY !== undefined ? this.baseCameraY : 0.08;
      this.camera.position.x += (this.targetMouse.x * 0.12 - this.camera.position.x) * 0.05;
      this.camera.position.y += (baseCamY + this.targetMouse.y * 0.08 - this.camera.position.y) * 0.05;
      this.camera.lookAt(0, baseCamY - 0.04, 0);
    }

    // 2. Animasi Zarah Debu Melayang (Dust Motes)
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.dustSpeeds.length; i++) {
        const s = this.dustSpeeds[i];
        pos[i * 3 + 1] += s.y;
        pos[i * 3] += Math.sin(s.osc) * 0.0015;
        s.osc += s.oscSpeed;

        if (pos[i * 3 + 1] > 1.8) {
          pos[i * 3 + 1] = -1.2;
        }
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Spring Solver untuk Kedudukan Buku di Rak
    this.books.forEach((book, idx) => {
      const mesh = book.mesh;

      if (book === this.inspectedBook) {
        // Bergerak ke tengah hadapan untuk pemeriksaan
        mesh.position.x += (0 - mesh.position.x) * 0.1;
        mesh.position.y += (0.1 - mesh.position.y) * 0.1;
        mesh.position.z += (2.2 - mesh.position.z) * 0.1;
      } else if (book === this.selectedBook && this.isDragging) {
        // Kedudukan dikawal secara langsung oleh seretan pointer dalam onPointerMove
      } else if (book === this.tapSelectedBook) {
        // Buku yang dipilih melalui ketikan (Tap-to-Swap):
        // Angkat ke hadapan dan condong sedikit supaya jelas aktif
        const targetX = this.slots[idx];
        mesh.position.x += (targetX - mesh.position.x) * 0.14;
        mesh.position.y += (mesh.userData.baseY + 0.22 - mesh.position.y) * 0.14;
        mesh.position.z += (0.45 - mesh.position.z) * 0.14;
        mesh.rotation.x += (0.16 - mesh.rotation.x) * 0.15;
      } else {
        // Kembali ke slot dengan spring damping
        const targetX = this.slots[idx];
        const isHovered = book === this.hoveredBook;

        mesh.position.x += (targetX - mesh.position.x) * 0.14;
        mesh.position.y += (mesh.userData.baseY + (isHovered ? 0.08 : 0) - mesh.position.y) * 0.14;
        mesh.position.z += ((isHovered ? 0.18 : 0) - mesh.position.z) * 0.14;

        mesh.rotation.x += (0 - mesh.rotation.x) * 0.15;
        mesh.rotation.y += (0 - mesh.rotation.y) * 0.15;
        mesh.rotation.z += (0 - mesh.rotation.z) * 0.15;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
