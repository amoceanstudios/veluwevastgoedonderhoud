import {mkdir,readFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {join} from 'node:path';
const run=promisify(execFile);
const sources=JSON.parse(await readFile(new URL('../sources/original-images.json',import.meta.url),'utf8'));
const destination=process.env.MEDIA_DIRECTORY||'/tmp/veluwe-original-media';await mkdir(destination,{recursive:true});let failures=0;
for(const {url} of sources){const name=new URL(url).pathname.split('/').at(-1);try{await run('curl',['--fail','--silent','--show-error','--max-time','30',url,'-o',join(destination,name)]);console.log('Saved '+name)}catch(e){failures++;console.error('Download failed: '+name+' '+e.message)}}
if(failures)process.exitCode=1;
