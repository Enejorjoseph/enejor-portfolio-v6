(() => {
  const journey = document.querySelector('.journey');
  if (!journey) return;
  const paper = document.querySelector('#scenePaper');
  const digital = document.querySelector('#sceneDigital');
  const globeScene = document.querySelector('#sceneGlobe');
  const letter = document.querySelector('#letter');
  const pen = document.querySelector('.pen');
  const written = document.querySelector('#written');
  const laptop = document.querySelector('#laptop');
  const screenText = document.querySelector('#screenText');
  const globeWrap = document.querySelector('#globeWrap');
  const globeCopy = document.querySelector('.globe-copy');
  const explore = document.querySelector('.explore-link');
  const canvas = document.querySelector('#globe');
  const ctx = canvas.getContext('2d');
  const hello = "Hello, I'm Enejor Joseph.";
  const profession = 'A web developer from';
  let raf = 0;

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;

  function drawGlobe(progress) {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.max(1, Math.round(box.width * dpr));
    if (canvas.width !== size || canvas.height !== size) { canvas.width = size; canvas.height = size; }
    const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2, r = Math.min(w, h) * .455;
    ctx.clearRect(0, 0, w, h);
    const spin = progress * Math.PI * 1.55;
    const glow = ctx.createRadialGradient(cx - r * .35, cy - r * .4, r * .08, cx, cy, r * 1.1);
    glow.addColorStop(0, '#4c8198'); glow.addColorStop(.5, '#244760'); glow.addColorStop(1, '#102236');
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = glow; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.strokeStyle = '#9ed1d333'; ctx.lineWidth = Math.max(1, w * .002);
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath(); const yy = cy - Math.sin(lat * Math.PI / 180) * r;
      const rx = Math.cos(lat * Math.PI / 180) * r; ctx.ellipse(cx, yy, rx, Math.max(2, r * .075), 0, 0, Math.PI * 2); ctx.stroke();
    }
    for (let lon = 0; lon < 180; lon += 30) {
      ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(Math.cos((lon + spin * 45) * Math.PI / 180)) * r, r, 0, 0, Math.PI * 2); ctx.stroke();
    }
    // Stylized continent silhouettes; the Africa shape is centered as the globe turns toward Nigeria.
    const shapes = [
      [[-.65,-.54],[-.37,-.67],[-.17,-.58],[-.22,-.41],[-.36,-.3],[-.43,-.12],[-.61,-.16],[-.73,-.36]],
      [[-.17,-.25],[.04,-.32],[.22,-.23],[.27,-.05],[.18,.1],[.12,.35],[.01,.55],[-.11,.39],[-.18,.11],[-.25,-.03]],
      [[.25,-.45],[.47,-.48],[.68,-.34],[.73,-.13],[.59,-.01],[.53,.17],[.37,.2],[.24,.01],[.15,-.18]],
      [[-.8,.1],[-.57,.06],[-.39,.15],[-.31,.32],[-.44,.46],[-.7,.4]],
    ];
    const rotate = spin * .17;
    for (let k = 0; k < shapes.length; k++) {
      const visible = Math.abs(Math.sin(rotate + k * 1.3));
      if (visible < .18) continue;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(visible, 1);
      ctx.beginPath(); shapes[k].forEach(([x,y],i) => i ? ctx.lineTo(x*r,y*r) : ctx.moveTo(x*r,y*r)); ctx.closePath();
      ctx.fillStyle = k === 1 ? '#d19c72' : '#68a393'; ctx.globalAlpha = .88; ctx.fill();
      ctx.strokeStyle = '#c5e1d077'; ctx.lineWidth = 1.2 * dpr; ctx.stroke(); ctx.restore();
    }
    // Nigeria marker, placed on the west side of central Africa.
    const nx = cx + r * (.045 + Math.sin(spin * .17) * .025), ny = cy + r * .09;
    const pulse = 5 * dpr + (Math.sin(progress * 13) + 1) * 2 * dpr;
    ctx.beginPath(); ctx.arc(nx, ny, pulse, 0, Math.PI*2); ctx.fillStyle = '#ff9a70'; ctx.fill();
    ctx.beginPath(); ctx.arc(nx, ny, pulse * 2.1, 0, Math.PI*2); ctx.strokeStyle = '#ffb28a88'; ctx.lineWidth = 1.5*dpr; ctx.stroke();
    ctx.restore();
    const shine = ctx.createLinearGradient(cx-r, cy-r, cx+r, cy+r);
    shine.addColorStop(0,'#ffffff26'); shine.addColorStop(.42,'transparent'); shine.addColorStop(1,'#06111c72');
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=shine;ctx.fill();
    ctx.strokeStyle='#a7c9d85c';ctx.lineWidth=Math.max(1,w*.002);ctx.stroke();
  }

  function update() {
    raf = 0;
    const rect = journey.getBoundingClientRect();
    const distance = journey.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / distance);
    const writing = smooth(0, .18, p);
    const pageShift = smooth(.25, .4, p);
    const typing = smooth(.36, .56, p);
    const globeIn = smooth(.58, .76, p);
    const globeZoom = smooth(.77, .96, p);

    paper.style.opacity = String(1 - pageShift);
    paper.style.transform = `scale(${1 + pageShift * .04})`;
    letter.style.transform = `rotate(${-2 + writing * 1.4}deg) translateY(${writing * -10}px)`;
    written.textContent = hello.slice(0, Math.floor(hello.length * writing));
    pen.style.left = `calc(50% + ${110 - writing * 90}px)`;
    pen.style.top = `calc(50% + ${140 - writing * 75}px)`;
    pen.style.transform = `rotate(${-44 + writing * 17}deg)`;

    digital.style.opacity = String(smooth(.24,.4,p) * (1 - smooth(.56,.64,p)));
    digital.style.transform = `scale(${1 + (1-pageShift)*.03})`;
    laptop.style.transform = `translate(${mix(110,0,smooth(.28,.47,p))}vw,-50%) scale(${1 + typing*.05})`;
    screenText.textContent = profession.slice(0, Math.floor(profession.length * typing));
    document.querySelectorAll('.orbit-word').forEach((el, i) => { el.style.opacity = String(smooth(.4,.5,p) * (1-smooth(.56,.63,p))); el.style.transform = `translateY(${(1-typing)*18*(i ? -1:1)}px)`; });

    globeScene.style.opacity = String(globeIn);
    globeWrap.style.opacity = String(globeIn);
    globeWrap.style.transform = `translate(-50%,-50%) scale(${mix(.24, 1.5, globeZoom)}) rotate(${p*24}deg)`;
    globeCopy.style.opacity = String(smooth(.74,.88,p) * (1-smooth(.96,1,p)*.2));
    globeCopy.style.transform = `translateY(${mix(20,0,smooth(.74,.84,p))}px)`;
    explore.style.opacity = String(smooth(.81,.9,p));
    drawGlobe(p);
  }
  function requestUpdate(){ if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate);
  requestUpdate();
})();
