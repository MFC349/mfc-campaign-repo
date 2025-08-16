
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);
const caps = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','captions.json'),'utf-8'));
const sched = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','schedule.json'),'utf-8'));
const start = new Date(sched.start_date + 'T00:00:00');
const idx = {SUNDAY:0,MONDAY:1,TUESDAY:2,WEDNESDAY:3,THURSDAY:4,FRIDAY:5,SATURDAY:6};
function dateForWeekday(start, weekday, w){const base=new Date(start.getTime()); const delta=-base.getDay(); const sun=new Date(base.getTime()); sun.setDate(base.getDate()+delta+w*7); const d=new Date(sun.getTime()); d.setDate(sun.getDate()+weekday); const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), da=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${da}`;}
const platforms=[
  {key:'tiktok',network:'TikTok',post_type:'video',ph:'TT',dow:sched.days_of_week.tiktok,time:sched.times.tiktok},
  {key:'instagram',network:'Instagram',post_type:'video',ph:'IG',dow:sched.days_of_week.instagram,time:sched.times.instagram},
  {key:'facebook',network:'Facebook',post_type:'video',ph:'FB',dow:sched.days_of_week.facebook,time:sched.times.facebook},
  {key:'linkedin',network:'LinkedIn',post_type:'video',ph:'LI',dow:sched.days_of_week.linkedin,time:sched.times.linkedin},
];
let lines=['network,post_type,date,time,content_url,caption'];
for(let w=0; w<sched.weeks; w++){ const cap=caps.weeks[w]; for(const pf of platforms){ const date=dateForWeekday(start, idx[pf.dow], w); const wk=String(w+1).padStart(2,'0'); const url=`{{WK${wk}_${pf.ph}}}`; const caption=cap[pf.key].replace(/\n/g,' ').replace(/"/g,'\"'); lines.push(`${pf.network},${pf.post_type},${date},${pf.time},${url},"${caption}"`); } }
fs.writeFileSync(path.join(__dirname,'..','data','metricool.csv'), lines.join('\n'), 'utf-8'); console.log('Wrote data/metricool.csv');
