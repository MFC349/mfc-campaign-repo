import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import chalk from 'chalk';

const root = path.resolve(process.cwd());

const files = [
  { data: 'data/captions.json', schema: 'data/schemas/captions.schema.json' },
  { data: 'data/schedule.json', schema: 'data/schemas/schedule.schema.json' },
  { data: 'data/links.json', schema: 'data/schemas/links.schema.json' }
];

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let failed = false;

for (const { data, schema } of files) {
  const dataPath = path.join(root, data);
  const schemaPath = path.join(root, schema);
  const payload = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const schemaJson = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const validate = ajv.compile(schemaJson);
  const ok = validate(payload);
  if (!ok) {
    failed = true;
    console.error(chalk.red(`✗ ${data} failed validation:`));
    for (const err of validate.errors) {
      console.error(chalk.yellow(`  → ${err.instancePath} ${err.message}`));
    }
  } else {
    console.log(chalk.green(`✓ ${data} is valid against ${schema}`));
  }
}

if (failed) {
  console.error(chalk.red('Validation failed. Fix the JSON above.'));
  process.exit(1);
} else {
  console.log(chalk.green('All JSON files valid.'));
}
