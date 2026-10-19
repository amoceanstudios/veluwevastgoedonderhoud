// Fill only with the verified business WhatsApp number, in international digits.
const businessWhatsApp = '31658843114';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#year').textContent = new Date().getFullYear();
const dialog = document.querySelector('#contact-dialog');
let topic = 'mijn pand';
function updateContact() {
  const link = document.querySelector('#whatsapp-send');
  if (!/^\d{8,15}$/.test(businessWhatsApp)) return;
  link.href = `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(`Hallo Veluwe Vastgoedonderhoud, ik wil graag meer weten over ${topic}.`)}`;
  link.hidden = false;
  document.querySelector('#contact-status').textContent = 'Ga verder in WhatsApp om uw vraag te versturen.';
}
for (const id of ['contact-button', 'whatsapp-button']) document.getElementById(id).addEventListener('click', () => { updateContact(); dialog.showModal(); });
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => {
  topic = button.dataset.topic;
  document.querySelectorAll('[data-topic]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  updateContact();
}));
const panels = document.querySelectorAll('.services details');
panels.forEach(panel => panel.addEventListener('toggle', () => { if (panel.open) panels.forEach(other => { if (other !== panel) other.open = false; }); }));
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: .12 });
const groups = [ ['.hero-image','paint'], ['.intro h2','left'], ['.intro-copy','right'], ['.section-heading h2','wipe'], ['.services details','up'], ['.statement','up'], ['.steps article','up'], ['.contact h2','wipe'], ['.contact-bottom','up'] ];
for (const [selector, effect] of groups) document.querySelectorAll(selector).forEach((element, i) => {
  element.classList.add('reveal-ready'); element.dataset.reveal = effect; element.style.transitionDelay = `${i * 90}ms`; observer.observe(element);
});
const progress = document.querySelector('.scroll-progress');
let scrollPending = false;
function updateProgress() { const available = document.documentElement.scrollHeight - innerHeight; progress.style.transform = `scaleX(${available > 0 ? scrollY / available : 0})`; scrollPending = false; }
addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); } }, { passive:true });
updateProgress();
// A short-lived pigment trail, only on fine pointers; no perpetual animation loop.
const canvas = document.querySelector('#paint-trail');
const ctx = canvas.getContext('2d');
let points = [], drawing = false, previous = null;
function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
resizeCanvas(); addEventListener('resize', resizeCanvas);
function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points = points.filter(point => performance.now() - point.time < 650);
  for (const point of points) {
    const opacity = Math.max(0, 1 - (performance.now() - point.time) / 650);
    ctx.strokeStyle = `rgba(126,148,86,${opacity * .35})`;
    ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (let strand = 0; strand < 4; strand++) { ctx.beginPath(); ctx.moveTo(point.x1,point.y1 + strand*3); ctx.lineTo(point.x2,point.y2 + strand*3); ctx.stroke(); }
  }
  if (points.length && !reducedMotion.matches) requestAnimationFrame(drawTrail); else { drawing = false; ctx.clearRect(0,0,canvas.width,canvas.height); }
}
addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType !== 'mouse' || event.target.closest('button,a,dialog')) { previous = null; return; }
  const next = { x:event.clientX, y:event.clientY };
  if (previous) points.push({x1:previous.x,y1:previous.y,x2:next.x,y2:next.y,time:performance.now()});
  previous = next;
  if (!drawing && points.length) { drawing = true; requestAnimationFrame(drawTrail); }
}, {passive:true});
addEventListener('pointerout', event => { if (!event.relatedTarget) previous = null; });
document.querySelectorAll('.service-contact').forEach(button => button.addEventListener('click', () => { dialog.showModal(); }));
const imageDialog = document.querySelector('#image-dialog');
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.classList.add('reveal-ready');card.dataset.reveal = ['paint','up','wipe'][i];observer.observe(card);
  card.addEventListener('click', () => {
    const image = document.querySelector('#expanded-project');image.onerror = () => { image.onerror = null; image.src = '/images/paint-study.svg'; document.querySelector('#project-caption').textContent = 'De originele projectfoto is tijdelijk niet bereikbaar. Hier ziet u een illustratie van de ontwerprichting.'; }; image.src = card.dataset.image;image.alt = card.querySelector('img').alt;
    document.querySelector('#project-caption').textContent = card.dataset.caption;imageDialog.showModal();
  });
});
imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => { if (event.target === imageDialog) { const r = imageDialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) imageDialog.close(); } });
// Keep the composition intact if the original Wix image host is unavailable.
document.querySelectorAll('.project-card img').forEach(image => {
  const unavailable = () => {
    image.classList.add('image-unavailable');
    if (!image.closest('.project-card').querySelector('.project-unavailable')) {
      const note = document.createElement('p');note.className = 'project-unavailable';note.textContent = 'Projectfoto tijdelijk niet bereikbaar.';image.closest('.project-card').append(note);
    }
  };
  image.addEventListener('error', unavailable);
  if (image.complete && !image.naturalWidth) unavailable();
});
const heroSource = new Image();
heroSource.onerror = () => { const hero = document.querySelector('.hero-image');hero.dataset.fallback = 'true';hero.setAttribute('aria-label','Illustratie van een verfroller op een groene wand'); };
heroSource.src = 'https://static.wixstatic.com/media/711638_b63017be263e4b578c11c9f4c1344b1f~mv2.jpg';
const colourDescriptions = {
  'Veluws groen': 'Rustig en aards. Een groene basis die mooi samengaat met hout en natuurlijke materialen.',
  'Warm terracotta': 'Warm en levendig. Een zachte aardetint die een ruimte karakter en geborgenheid geeft.',
  'Zacht zand': 'Licht en ingetogen. Een warme, neutrale basis die ruimte laat aan materialen en details.',
  'Diep blauw': 'Kalm en uitgesproken. Een diepe tint die contrast brengt met lichte kozijnen en warm hout.'
};
let chosenColour = 'Veluws groen';
document.querySelectorAll('[data-colour]').forEach(button => button.addEventListener('click', () => {
  chosenColour = button.dataset.name;
  document.querySelector('.colour-wall').setAttribute('fill', button.dataset.colour);
  document.querySelector('#colour-name').textContent = chosenColour;
  document.querySelector('#colour-description').textContent = colourDescriptions[chosenColour];
  document.querySelectorAll('[data-colour]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
}));
document.querySelector('#paint-amount').addEventListener('input', event => {
  const amount = Number(event.target.value);
  document.querySelector('.colour-wall').style.clipPath = `inset(0 ${100-amount}% 0 0)`;
  document.querySelector('#paint-percentage').textContent = `${amount}%`;
});
document.querySelector('#colour-contact').addEventListener('click', () => { topic = `schilderwerk met de sfeer ${chosenColour}`;updateContact();dialog.showModal(); });
for (const selector of ['.room-study','.studio-controls']) { const el = document.querySelector(selector);el.classList.add('reveal-ready');el.dataset.reveal = selector === '.room-study' ? 'paint' : 'up';observer.observe(el); }
