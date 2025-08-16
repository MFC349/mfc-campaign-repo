import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, '..', 'data', 'metricool.csv');
const rows = fs.readFileSync(csvPath, 'utf-8').trim().split('\n');
const dataRows = rows.slice(1).filter(Boolean).map(parseCSV);
function parseCSV(line){
  const cols = []; let cur = '', q = false;
  for(const ch of line){
    if(ch === '"'){ q = !q; continue; }
    if(ch === ',' && !q){ cols.push(cur); cur=''; continue; }
    cur += ch;
  }
  cols.push(cur);
  const [network, , date, time, , caption] = cols;
  return { network, date, time, caption };
}
const tableRows = dataRows.map(r => `  <tr><td>${r.network}</td><td>${r.date}</td><td>${r.time}</td><td>${r.caption}</td></tr>`).join('\n');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Campaign Schedule</title>
<style>
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 4px; text-align: left; }
  th { background: #f0f0f0; }
</style>
</head>
<body>
<table>
<thead><tr><th>Platform</th><th>Date</th><th>Time</th><th>Caption</th></tr></thead>
<tbody>
${tableRows}
</tbody>
</table>
</body>
</html>`;
fs.writeFileSync(path.join(__dirname, '..', 'campaign.html'), html, 'utf-8');
console.log('Wrote campaign.html');
