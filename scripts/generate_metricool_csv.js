import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import chalk from 'chalk';
import dayjs from 'dayjs';

const root = process.cwd();

const captions = JSON.parse(fs.readFileSync(path.join(root, 'data/captions.json'), 'utf-8'));
const schedule = JSON.parse(fs.readFileSync(path.join(root, 'data/schedule.json'), 'utf-8'));

const captionsMap = new Map();
for (const item of captions.items) {
  captionsMap.set(item.slug, item);
}

const rows = [];
for (const post of schedule.posts) {
  const cap = captionsMap.get(post.slug);
  if (!cap) {
    console.warn(chalk.yellow(`No caption found for slug: ${post.slug}; skipping.`));
    continue;
  }
  if (!cap.platforms.includes(post.platform)) {
    console.warn(chalk.yellow(`Slug ${post.slug} not configured for platform ${post.platform}; skipping.`));
    continue;
  }
  rows.push({
    date: post.date,
    time: post.time,
    platform: post.platform,
    text: cap.text + (cap.hashtags ? `\n\n${cap.hashtags}` : ''),
    media_url: '' // to be injected later
  });
}

if (!rows.length) {
  console.error(chalk.red('No rows generated. Check schedule/platforms.'));
  process.exit(1);
}

const outPath = path.join(root, 'data/metricool.csv');

const writer = createObjectCsvWriter({
  path: outPath,
  header: [
    { id: 'date', title: 'date' },
    { id: 'time', title: 'time' },
    { id: 'platform', title: 'platform' },
    { id: 'text', title: 'text' },
    { id: 'media_url', title: 'media_url' }
  ]
});

await writer.writeRecords(rows);
console.log(chalk.green(`Wrote ${rows.length} rows to ${outPath}`));
