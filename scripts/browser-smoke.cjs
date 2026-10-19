const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const {routes}=await import('../data/site.mjs');const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',response=>{if(response.status()>=400)missing.push(response.url()+' '+response.status())});
 const base=process.env.SITE_URL||'http://127.0.0.1:4173';
 await page.context().route('https://wa.me/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>WhatsApp destination check</title>'}));
 for(const route of routes){
  const response=await page.goto(base+route);assert.equal(response.status(),200,route);assert.equal(await page.locator('h1').count(),1,'one H1 '+route);
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+route+' '+width)}
  await page.locator('img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
  const broken=await page.locator('img[src]').evaluateAll(images=>images.filter(i=>!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[],'images '+route);
 }
 await page.goto(base+'/projecten/');await page.getByRole('button',{name:'Buitenwerk'}).click();assert.equal(await page.locator('[data-category]:visible').count(),2);await page.getByRole('button',{name:'Binnenwerk'}).click();assert.equal(await page.locator('[data-category]:visible').count(),3);await page.getByRole('button',{name:'Alles'}).click();assert.equal(await page.locator('[data-category]:visible').count(),5);
 await page.locator('.project-card').first().click();assert.match(page.url(),/projecten\/karakteristieke-woning\//);await page.locator('.zoom-image').first().click();assert(await page.locator('#lightbox').evaluate(d=>d.open));await page.keyboard.press('Escape');assert.equal(await page.locator('#lightbox').evaluate(d=>d.open),false);
 await page.goto(base+'/diensten/binnenschilderwerk/');await page.locator('summary').first().click();assert(await page.locator('details').first().evaluate(d=>d.open));await page.getByRole('link',{name:'Bespreek uw plannen',exact:true}).click();assert.equal(await page.locator('#service').inputValue(),'Binnenschilderwerk');
 await page.locator('#name').fill('Browsercontrole');await page.locator('#message').fill('We willen de woonkamer laten schilderen.');const [popup]=await Promise.all([page.waitForEvent('popup'),page.getByRole('button',{name:'Verder via WhatsApp'}).click()]);await popup.waitForLoadState('domcontentloaded').catch(()=>{});assert(popup.url().startsWith('https://wa.me/31658843114?text='));assert(decodeURIComponent(popup.url()).includes('Binnenschilderwerk'));await popup.close();assert.match(await page.locator('#form-status').textContent(),/Uw bericht staat klaar/);
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/');await page.getByRole('button',{name:'Menu openen'}).click();assert(await page.locator('#mobile-menu').evaluate(d=>d.open));await page.locator('#mobile-menu').getByRole('link',{name:'Diensten'}).click();assert.match(page.url(),/\/diensten\/$/);await page.getByRole('button',{name:'Menu openen'}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-menu').evaluate(d=>d.open),false);
 // Scroll through real animated content and ensure reveals cannot leave sections hidden.
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/');
 await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,35))}});await page.waitForTimeout(1500);assert.equal(await page.locator('.reveal-pending:not(.is-visible)').count(),0,'all home reveals triggered');
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);await page.screenshot({path:'/tmp/veluwe-multipage-desktop.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto(base+'/');await page.screenshot({path:'/tmp/veluwe-multipage-mobile.png',fullPage:true});
 assert.deepEqual(errors,[],'JS errors');const localMissing=missing.filter(u=>u.startsWith(base));assert.deepEqual(localMissing,[],'missing local requests');console.log('PASS: all '+routes.length+' pages at four widths, local images, filters, project navigation, lightbox, service/contact flow, WhatsApp number and topic, mobile menu, Escape and all home scroll reveals.');await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
