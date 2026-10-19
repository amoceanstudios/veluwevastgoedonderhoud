import {readFile,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {routes} from '../data/site.mjs';
const root=resolve('netlify');let checks=0;
for(const route of [...routes,'/404.html']){
 const path=join(root,route.endsWith('/')?route+'index.html':route),html=await readFile(path,'utf8');
 if(!/<h1[ >]/.test(html))throw Error('Missing page title: '+route);
 if(!html.includes('lang="nl"'))throw Error('Missing Dutch language: '+route);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  const url=new URL(match[1],'https://check.local'+route);if(url.origin!=='https://check.local')continue;
  const target=join(root,decodeURIComponent(url.pathname));let info;try{info=await stat(target)}catch{throw Error(`Broken local resource on ${route}: ${url.pathname}`)}
  if(info.isDirectory())await stat(join(target,'index.html'));checks++;
 }
 for(const image of html.matchAll(/<img\b[^>]*>/g))if(!image[0].includes('alt='))throw Error('Image missing alt: '+route);
}
console.log(`PASS: ${routes.length+1} documents; ${checks} local links and resource references exist.`);
