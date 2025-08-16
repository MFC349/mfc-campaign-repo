
import fs from 'fs';
const [,, csvPath, linksPath] = process.argv;
if(!csvPath||!linksPath){ console.error('Usage: node scripts/inject_links.js <csv> <links.json>'); process.exit(1); }
const rows = fs.readFileSync(csvPath,'utf-8').split('\n');
const links = JSON.parse(fs.readFileSync(linksPath,'utf-8'));
const out = rows.map((line,i)=>{
  if(i===0||!line.trim()) return line;
  const cols=[]; let q=false, cur='';
  for(const ch of line){ if(ch==='"'){ q=!q; cur+=ch; continue; } if(ch===','&&!q){ cols.push(cur); cur=''; continue; } cur+=ch; }
  cols.push(cur);
  const key=(cols[4]||'').replace(/[{}]/g,'');
  if(links[key]) cols[4]=links[key];
  return cols.join(',');
}).join('\n');
process.stdout.write(out);
