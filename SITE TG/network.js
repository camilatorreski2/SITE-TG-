/* Rede luminosa em camadas, desenhada localmente sem dependências. */
(() => {
  const canvas = document.getElementById('particles');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let width, height, points, frame = 0, previous = 0;
  function resize() {
    width = innerWidth;
    height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    points = Array.from({length: Math.min(95, Math.max(42, Math.round(width * height / 18000)))}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * 14, vy: (Math.random() - .5) * 14,
      depth: Math.floor(Math.random() * 3), phase: Math.random() * Math.PI * 2
    }));
    if (motion.matches || document.hidden) draw(0);
  }
  function draw(time) {
    const dt = previous ? Math.min((time - previous) / 1000, .05) : 0;
    previous = time;
    ctx.clearRect(0, 0, width, height);
    const reach = Math.min(235, Math.max(150, width * .18));
    points.forEach(p => {
      if (!motion.matches) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 0 || p.x > width) { p.vx *= -1; p.x = Math.max(0, Math.min(width, p.x)); }
        if (p.y < 0 || p.y > height) { p.vy *= -1; p.y = Math.max(0, Math.min(height, p.y)); }
      }
    });
    for (let layer = 0; layer < 3; layer++) {
      const opacity = [.13, .29, .57][layer];
      points.forEach((p, i) => {
        if (p.depth !== layer) return;
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          if (q.depth !== layer) continue;
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance > reach * 1.35) continue;
          ctx.strokeStyle = `rgba(97,159,255,${opacity * (1 - distance / (reach * 1.35))})`;
          ctx.lineWidth = layer === 0 ? 2 : .85;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
        const radius = layer === 0 ? 12 : 8;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        glow.addColorStop(0, `rgba(153,224,255,${opacity})`);
        glow.addColorStop(.2, `rgba(89,169,255,${opacity * .7})`);
        glow.addColorStop(1, 'rgba(50,110,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(189,235,255,${opacity + .12})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, layer === 2 ? 1.9 : 1.2, 0, Math.PI * 2); ctx.fill();
      });
    }
  }
  function tick(time) { draw(time); frame = requestAnimationFrame(tick); }
  function sync() {
    cancelAnimationFrame(frame); previous = 0;
    if (motion.matches || document.hidden) draw(0);
    else frame = requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  resize(); sync();
})();
