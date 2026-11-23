(() => {
  const scenes = [...document.querySelectorAll('.skill-scene')];
  if (!scenes.length) return;

  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  scenes.forEach(scene => {
    scene.querySelectorAll('.network-art path').forEach(path => {
      const length = path.getTotalLength();
      path.style.setProperty('--path-length', `${length}px`);
    });
  });

  function update() {
    frame = 0;
    const viewHeight = window.innerHeight;
    scenes.forEach(scene => {
      const rect = scene.getBoundingClientRect();
      // Each illustration and its labels build as its section travels through the viewport.
      // Since progress comes from the live scroll position, scrolling upward rewinds it.
      const scrollable = Math.max(1, rect.height - viewHeight);
      const progress = reducedMotion.matches ? 1 : clamp(-rect.top / scrollable);
      scene.style.setProperty('--p', progress.toFixed(3));
      scene.querySelectorAll('.network-art .node').forEach(node => {
        const delay = Number(getComputedStyle(node).getPropertyValue('--node-delay')) || 0;
        const nodeProgress = clamp((progress - delay) * 5);
        node.style.setProperty('--node-progress', nodeProgress.toFixed(3));
      });
      scene.querySelectorAll('.skill-tags span').forEach((tag, i) => {
        const reveal = clamp((progress - (.32 + i * .055)) / .32);
        tag.style.setProperty('--tag-progress', reveal.toFixed(3));
        tag.style.opacity = reveal.toFixed(3);
        tag.style.transform = `translateY(${((1 - reveal) * 12).toFixed(1)}px)`;
      });
    });
  }
  function queueUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate);
  reducedMotion.addEventListener?.('change', queueUpdate);
  queueUpdate();
})();
