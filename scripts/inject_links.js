import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const root = process.cwd();

const links = JSON.parse(fs.readFileSync(path.join(root, 'data/links.json'), 'utf-8'));
const csvIn = fs.readFileSync(path.join(root, 'data/metricool.csv'), 'utf-8');

// naive CSV parser just for this simple file
const lines = csvIn.split(/\r?\n/).filter(Boolean);
const header = lines.shift();
const colIndex = Object.fromEntries(header.split(',').map((h, i) => [h.trim(), i]));
const out = [header];

const linkMap = new Map();
for (const m of links.media) linkMap.set(m.slug, m.media_url);

for (const line of lines) {
  const cols = line.split(',');
  const text = cols[colIndex['text']];
  // Expect slug at the start of text in brackets? If not present, fallback by searching known slugs.
  let foundSlug = null;
  for (const slug of linkMap.keys()) {
    if (text.includes(slug)) { foundSlug = slug; break; }
  }
  if (!foundSlug) {
    // last resort: single-slug project, use the only url
    if (links.media.length === 1) foundSlug = links.media[0].slug;
  }
  if (!foundSlug) {
    console.warn(chalk.yellow('No slug detected in row; leaving media_url empty.'));
  } else {
    cols[colIndex['media_url']] = linkMap.get(foundSlug);
  }
  out.push(cols.join(','));
}

const outPath = path.join(root, 'data/metricool_linked.csv');
fs.writeFileSync(outPath, out.join('\n'));
console.log(chalk.green(`Wrote ${out.length-1} rows with links → ${outPath}`));
