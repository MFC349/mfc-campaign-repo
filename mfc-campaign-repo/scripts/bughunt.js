/* Cheap, loud, and useful: runs jest, lists slow tests, retries failures to flag flakiness */
import { spawnSync } from "node:child_process";
import { readFileSync, mkdirSync, existsSync } from "node:fs";

const TMP = ".tmp";
if (!existsSync(TMP)) mkdirSync(TMP, { recursive: true });

function runJest(args = []) {
  const outFile = `${TMP}/jest-${Date.now()}.json`;
  const res = spawnSync("npx", ["jest", "--json", `--outputFile=${outFile}`, "--runInBand", ...args], {
    stdio: "inherit",
    shell: false
  });
  const json = JSON.parse(readFileSync(outFile, "utf8"));
  return { code: res.status ?? 0, report: json };
}

function summarize(report) {
  const tests = report.testResults || [];
  const flat = tests.flatMap(t =>
    (t.assertionResults || []).map(a => ({
      file: t.name,
      title: a.titlePath ? a.titlePath.join(" > ") : a.fullName || a.title,
      status: a.status,
      duration: a.duration ?? (t.perfStats?.runtime ?? 0)
    }))
  );

  const failures = flat.filter(x => x.status !== "passed");
  const slowest = [...flat].sort((a, b) => (b.duration || 0) - (a.duration || 0)).slice(0, 10);

  console.log("\n=== SLOW TESTS (top 10) ===");
  slowest.forEach(t => console.log(`${t.duration}ms  ${t.title}  (${t.file})`));

  const failedFiles = [...new Set(failures.map(f => f.file))];
  console.log(`\nFailures: ${failures.length} assertions across ${failedFiles.length} files`);
  return { failures, failedFiles };
}

function retryFailed(failedFiles) {
  if (!failedFiles.length) return;
  console.log("\n=== RETRYING FAILED FILES (2x) TO FLAG FLAKES ===");
  const stats = [];
  for (const f of failedFiles) {
    let passes = 0;
    for (let i = 0; i < 2; i++) {
      const { code } = runJest([f]);
      if (code === 0) passes++;
    }
    const flaky = passes > 0;
    stats.push({ file: f, flaky, passes });
    console.log(`${flaky ? "FLAKY" : "CONSISTENT FAIL"}  ${f}  (passes on retry: ${passes}/2)`);
  }
  console.log("\nFlake summary:");
  stats.forEach(s => console.log(`${s.flaky ? "FLAKY  " : "BROKEN "} ${s.file}`));
}

const first = runJest();
const { failedFiles } = summarize(first.report);
retryFailed(failedFiles);

process.exit(first.code);
