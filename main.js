const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const progress = document.querySelector('.progress');
let scrollScheduled = false;
function updateProgress() { const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;scrollScheduled=false; }
addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});
addEventListener('resize',updateProgress);updateProgress();
document.querySelector('.back-top')?.addEventListener('click',()=>scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'}));
const menu=document.querySelector('#mobile-menu');
document.querySelector('.menu-button')?.addEventListener('click',()=>menu.showModal());
document.querySelector('.menu-close')?.addEventListener('click',()=>menu.close());
addEventListener('resize',()=>{if(innerWidth>700&&menu.open)menu.close()});
function outsideClose(dialog){dialog?.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}})}
outsideClose(menu);
// Native links keep navigation, browser history and deep linking intact.
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -15px 0px'});
for(const el of document.querySelectorAll('[data-reveal]')){
 if(el.dataset.reveal==='words'){
   let index=0;
   const textNodes=[];const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(walker.nextNode())if(walker.currentNode.textContent.trim())textNodes.push(walker.currentNode);
   for(const node of textNodes){const fragment=document.createDocumentFragment();for(const token of node.textContent.split(/(\s+)/)){if(!token)continue;if(/^\s+$/.test(token)){fragment.append(document.createTextNode(token));continue}const mask=document.createElement('span');mask.className='word-mask';const word=document.createElement('span');word.textContent=token;word.style.setProperty('--word-delay',`${Math.min(index++,8)*45}ms`);mask.append(word);fragment.append(mask)}node.replaceWith(fragment)}
 }
 el.classList.add('reveal-pending');observer.observe(el);
}
document.querySelectorAll('.statement').forEach(el=>observer.observe(el));
addEventListener('pageshow',event=>{if(event.persisted)document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.add('is-visible'))});
const cards=[...document.querySelectorAll('[data-category]')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;let count=0;
 document.querySelectorAll('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(button===other)));
 cards.forEach(card=>{const visible=filter==='all'||card.dataset.category===filter;card.hidden=!visible;if(visible){count++;card.classList.add('is-visible')}});
 document.querySelector('#filter-status').textContent=`${count} projecten zichtbaar`;
}));
const lightbox=document.querySelector('#lightbox');
document.querySelectorAll('[data-full]').forEach(button=>button.addEventListener('click',()=>{const image=lightbox.querySelector('img');image.src=button.dataset.full;image.alt=button.dataset.caption;lightbox.querySelector('p').textContent=button.dataset.caption;lightbox.showModal()}));
lightbox?.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());outsideClose(lightbox);
const form=document.querySelector('#enquiry-form');
if(form){const params=new URLSearchParams(location.search),service=params.get('dienst');if(service){const select=form.querySelector('#service');if([...select.options].some(o=>o.value===service))select.value=service}
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const name=form.elements.name.value.trim(),message=form.elements.message.value.trim();if(!name||!message){document.querySelector('#form-status').textContent='Vul uw naam en uw vraag in.';return}
 const topic=form.elements.service.value;const body=`Hallo Veluwe Vastgoedonderhoud,\n\nMijn naam is ${name}. Mijn vraag gaat over ${topic}.\n\n${message}`;
 const channel=event.submitter?.value||'whatsapp';const href=channel==='email'?`mailto:info@veluwevastgoedonderhoud.nl?subject=${encodeURIComponent('Aanvraag: '+topic)}&body=${encodeURIComponent(body)}`:`https://wa.me/31658843114?text=${encodeURIComponent(body)}`;
 if(channel==='email')location.href=href;else{const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener noreferrer';link.click()}
 const status=document.querySelector('#form-status');status.textContent='Uw bericht staat klaar. Bevestig het versturen in '+(channel==='email'?'uw e-mailprogramma.':'WhatsApp.');const fallback=document.createElement('a');fallback.href=href;fallback.textContent=' Niet geopend? Klik hier.';if(channel!=='email'){fallback.target='_blank';fallback.rel='noopener noreferrer'}status.append(fallback);
 });
}
// A restrained, short-lived brush trace for fine pointers, disabled for reduced motion.
if(matchMedia('(pointer:fine)').matches&&!reducedMotion.matches){const canvas=document.createElement('canvas');canvas.className='brush-cursor';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);const ctx=canvas.getContext('2d');let last=null,points=[],running=false;function resize(){canvas.width=innerWidth;canvas.height=innerHeight}resize();addEventListener('resize',resize);function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);const now=performance.now();points=points.filter(p=>now-p.t<450);for(const p of points){const a=(1-(now-p.t)/450)*.23;ctx.strokeStyle=`rgba(154,48,58,${a})`;ctx.lineWidth=2;ctx.lineCap='round';for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(p.x1,p.y1+i*2);ctx.lineTo(p.x2,p.y2+i*2);ctx.stroke()}}if(points.length&&!reducedMotion.matches)requestAnimationFrame(draw);else{running=false;ctx.clearRect(0,0,canvas.width,canvas.height)}}addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reducedMotion.matches||e.target.closest('a,button,input,textarea,select,dialog')){last=null;return}if(last)points.push({x1:last.x,y1:last.y,x2:e.clientX,y2:e.clientY,t:performance.now()});last={x:e.clientX,y:e.clientY};if(!running&&points.length){running=true;requestAnimationFrame(draw)}},{passive:true});addEventListener('pointerout',e=>{if(!e.relatedTarget)last=null})}
