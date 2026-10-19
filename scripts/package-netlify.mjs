import {cp,rm} from 'node:fs/promises';
// netlify/ is a generated deployment directory, committed for manual Netlify Drop.
await rm(new URL('../netlify/',import.meta.url),{recursive:true,force:true});
await cp(new URL('../dist/',import.meta.url),new URL('../netlify/',import.meta.url),{recursive:true});
console.log('Updated netlify/ with the complete multi-page production build.');
