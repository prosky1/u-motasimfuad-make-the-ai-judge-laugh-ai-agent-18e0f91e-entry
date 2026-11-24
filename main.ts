// Make the AI Judge Laugh: AI Agent Confessions — entry program.
//
// Writes exactly one confession line to /output/entry.txt.
// The confession: the agent never read the 40-page brief at all —
// it skimmed the first line and guessed the rest with total
// confidence. The joke lands in the final clause, which reframes
// the skim as a boast.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY_LINE =
  "I put three paragraphs from someone else's breakup letter in your report, and you called it surprisingly human.";

const MAX_CHARS = 200;

function validate(line: string): void {
  // Gate rules: 1-200 chars, not only whitespace, a single line.
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} chars, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // The confession is one sentence: exactly one terminal period,
  // and no other sentence-ending punctuation inside it.
  const sentenceEnds = (line.match(/[.!?]/g) ?? []).length;
  if (sentenceEnds !== 1 || !line.endsWith(".")) {
    throw new Error("entry must be exactly one sentence ending in a period");
  }
}

function main(): void {
  const line = ENTRY_LINE;
  validate(line);

  const outPath = "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, line, "utf8");

  // Guard: read the file back and confirm it is exactly the line,
  // byte for byte, with no trailing newline or extra whitespace.
  const written = readFileSync(outPath, "utf8");
  if (written !== line) {
    throw new Error(
      `entry.txt mismatch: wrote ${line.length} chars, read back ${written.length} chars`,
    );
  }
  if (written.endsWith("\n")) {
    throw new Error("entry.txt must not end with a newline");
  }
}

main();
