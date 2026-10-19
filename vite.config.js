import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import {routes} from './data/site.mjs';
export default defineConfig({build:{rollupOptions:{input:Object.fromEntries([...routes.map((route,i)=>['page'+i,resolve(process.cwd(),'.'+route+'index.html')]),['404',resolve(process.cwd(),'404.html')]])}}});
