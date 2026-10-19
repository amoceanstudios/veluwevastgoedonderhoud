import { mkdir, writeFile, readFile } from 'node:fs/promises';
// Run when static.wixstatic.com is permitted by the environment network policy.
const sources = JSON.parse(await readFile(new URL('../sources/original-images.json', import.meta.url), 'utf8'));
const destination = new URL('../public/original-media/', import.meta.url);
await mkdir(destination, { recursive: true });
let failures = 0;
for (const { url } of sources) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.headers.get('content-type')?.startsWith('image/')) throw new Error('Expected an image response');
    const bytes = Buffer.from(await response.arrayBuffer());
    const name = new URL(url).pathname.split('/').at(-1);
    await writeFile(new URL(name, destination), bytes);
    console.log(`Saved ${name}`);
  } catch (error) { failures++; console.error(`Could not download ${new URL(url).pathname}: ${error.message}`); }
}
if (failures) process.exitCode = 1;
