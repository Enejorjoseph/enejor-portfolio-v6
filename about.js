(() => {
  const journey = document.querySelector('.about-scroll');
  if (!journey) return;
  const stories = [...document.querySelectorAll('.story-card')];
  const visuals = [...document.querySelectorAll('.about-visual')];
  const progressBar = document.querySelector('.about-progress span');
  const sticky = document.querySelector('.about-sticky');
  const heading = document.querySelector('.about-scroll-heading h1');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
  const colorMix = (a, b, amount) => {
    const channel = (hex, i) => parseInt(hex.slice(i, i + 2), 16);
    const t = clamp(amount);
    const rgb = [1, 3, 5].map(i => Math.round(channel(a, i) + (channel(b, i) - channel(a, i)) * t));
    return `rgb(${rgb.join(',')})`;
  };

  function update() {
    frame = 0;
    const rect = journey.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const scrollable = Math.max(1, rect.height - viewHeight);
    const progress = reducedMotion.matches ? 1 : clamp(-rect.top / scrollable);
    const darken = clamp((progress - .47) / .48);
    if (sticky && !reducedMotion.matches) sticky.style.backgroundColor = colorMix('#eee8dc', '#101b2a', darken);
    if (heading && !reducedMotion.matches) heading.style.color = colorMix('#20251f', '#f1eee7', darken);
    document.querySelectorAll('.story-card h2').forEach(el => { if (!reducedMotion.matches) el.style.color = colorMix('#202a32', '#f1eee7', darken); });
    document.querySelectorAll('.story-card p').forEach(el => { if (!reducedMotion.matches) el.style.color = colorMix('#59636a', '#c1ccd3', darken); });
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
    const note = document.querySelector('.paper-note');
    if (note && !reducedMotion.matches) note.style.transform = `rotate(${(-10 + progress * 20).toFixed(1)}deg) translateY(${(14 * (1 - visuals[0].style.opacity)).toFixed(1)}px)`;
    const browser = document.querySelector('.about-browser');
    if (browser && !reducedMotion.matches) browser.style.transform = `perspective(900px) rotateY(${(16 - progress * 26).toFixed(1)}deg) rotateX(${(7 - progress * 7).toFixed(1)}deg) scale(${(.9 + Number(visuals[1].style.opacity) * .1).toFixed(3)})`;
    const orbitA = document.querySelector('.orbit-a');
    const orbitB = document.querySelector('.orbit-b');
    if (orbitA && !reducedMotion.matches) orbitA.style.transform = `rotate(${(progress * 260).toFixed(1)}deg) scaleX(.75)`;
    if (orbitB && !reducedMotion.matches) orbitB.style.transform = `rotate(${(-33 - progress * 210).toFixed(1)}deg) scaleX(.45)`;
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener?.('change', schedule);
  schedule();
})();
