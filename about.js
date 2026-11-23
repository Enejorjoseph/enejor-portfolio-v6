(() => {
  const journey = document.querySelector('.about-scroll');
  if (!journey) return;
  const stories = [...document.querySelectorAll('.story-card')];
  const visuals = [...document.querySelectorAll('.about-visual')];
  const progressBar = document.querySelector('.about-progress span');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));

  function update() {
    frame = 0;
    const rect = journey.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const scrollable = Math.max(1, rect.height - viewHeight);
    const progress = reducedMotion.matches ? 1 : clamp(-rect.top / scrollable);
    const count = stories.length;
    stories.forEach((story, i) => {
      const start = i / count;
      const end = (i + 1) / count;
      const entering = clamp((progress - start + .07) / .12);
      const leaving = clamp((end + .07 - progress) / .12);
      const amount = Math.min(entering, leaving);
      story.style.opacity = reducedMotion.matches ? '1' : amount.toFixed(3);
      story.style.transform = reducedMotion.matches ? 'none' : `translateY(${((1 - amount) * 24).toFixed(1)}px)`;
      story.setAttribute('aria-hidden', amount > .1 || reducedMotion.matches ? 'false' : 'true');
    });
    visuals.forEach((visual, i) => {
      const center = (i + .5) / visuals.length;
      const amount = clamp(1 - Math.abs(progress - center) / .3);
      visual.style.opacity = reducedMotion.matches ? (i === 0 ? '1' : '0') : amount.toFixed(3);
      visual.style.transform = reducedMotion.matches ? 'none' : `translateY(${((1 - amount) * 22).toFixed(1)}px) scale(${(.96 + amount * .04).toFixed(3)})`;
    });
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener?.('change', schedule);
  schedule();
})();
