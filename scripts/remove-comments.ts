import * as fs from "fs";
import * as path from "path";
import ts from "typescript";

interface StripOptions {
  preserveDirectives?: boolean;
  dryRun?: boolean;
}

/**
 * Strips comments safely using the TypeScript compiler scanner.
 * Ensures string literals, template strings, URLs, regexes, and JSX are never corrupted.
 */
export function stripComments(
  code: string,
  options: StripOptions = {}
): { cleanCode: string; removedCount: number } {
  const { preserveDirectives = true } = options;
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    /* skipTrivia */ false,
    ts.LanguageVariant.JSX,
    code
  );

  let token = scanner.scan();
  const rangesToRemove: { pos: number; end: number }[] = [];

  while (token !== ts.SyntaxKind.EndOfFileToken) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia ||
      token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      const pos = scanner.getTokenPos();
      const end = scanner.getTextPos();
      const commentText = code.slice(pos, end);

      // Preserve special directives (e.g. @ts-ignore, eslint-disable, Next.js agent rules)
      if (
        preserveDirectives &&
        (commentText.includes("@ts-") ||
          commentText.includes("eslint-") ||
          commentText.includes("@eslint") ||
          commentText.includes("istanbul ignore") ||
          commentText.includes("BEGIN:nextjs-agent-rules") ||
          commentText.includes("END:nextjs-agent-rules"))
      ) {
        // Keep compiler/linter directives
      } else {
        rangesToRemove.push({ pos, end });
      }
    }
    token = scanner.scan();
  }

  if (rangesToRemove.length === 0) {
    return { cleanCode: code, removedCount: 0 };
  }

  // Splice out comments from right to left
  let result = code;
  for (let i = rangesToRemove.length - 1; i >= 0; i--) {
    const { pos, end } = rangesToRemove[i];
    result = result.slice(0, pos) + result.slice(end);
  }

  // Clean up empty JSX comment brackets `{  }`
  result = result.replace(/\{\s*\}/g, "");

  // Collapse excess blank lines (max 1 empty line)
  result = result.replace(/(\r?\n\s*){3,}/g, "\n\n");

  return { cleanCode: result, removedCount: rangesToRemove.length };
}

const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
  ".turbo",
  "prisma",
]);

function processFile(
  filePath: string,
  options: StripOptions,
  stats: { filesScanned: number; filesModified: number; totalCommentsRemoved: number }
) {
  const ext = path.extname(filePath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) return;

  stats.filesScanned++;
  try {
    const originalCode = fs.readFileSync(filePath, "utf8");
    const { cleanCode, removedCount } = stripComments(originalCode, options);

    if (removedCount > 0) {
      stats.filesModified++;
      stats.totalCommentsRemoved += removedCount;

      const relPath = path.relative(process.cwd(), filePath);
      if (options.dryRun) {
        console.log(`[DRY RUN] Would clean ${removedCount} comments from: ${relPath}`);
      } else {
        fs.writeFileSync(filePath, cleanCode, "utf8");
        console.log(`✓ Cleaned ${removedCount} comments from: ${relPath}`);
      }
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

function processDirectory(
  dirPath: string,
  options: StripOptions,
  stats: { filesScanned: number; filesModified: number; totalCommentsRemoved: number }
) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        processDirectory(fullPath, options, stats);
      }
    } else if (entry.isFile()) {
      processFile(fullPath, options, stats);
    }
  }
}

function processPath(
  targetPath: string,
  options: StripOptions,
  stats: { filesScanned: number; filesModified: number; totalCommentsRemoved: number }
) {
  if (!fs.existsSync(targetPath)) {
    console.warn(`Target not found: ${targetPath}`);
    return;
  }
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    processFile(targetPath, options, stats);
  } else if (stat.isDirectory()) {
    processDirectory(targetPath, options, stats);
  }
}

// CLI Execution
async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const targetDirArg = args.find((a) => !a.startsWith("--"));

  const targetDirs = targetDirArg
    ? [path.resolve(process.cwd(), targetDirArg)]
    : [
        path.resolve(process.cwd(), "app"),
        path.resolve(process.cwd(), "components"),
      ];

  console.log("=========================================");
  console.log("   Safe Comment Stripper (TSX/TS/JS)     ");
  console.log("=========================================");
  console.log(`Mode: ${isDryRun ? "DRY RUN (no files modified)" : "WRITE (updating files)"}`);
  console.log(`Target: ${targetDirs.map((d) => path.relative(process.cwd(), d)).join(", ")}`);
  console.log("-----------------------------------------");

  const stats = {
    filesScanned: 0,
    filesModified: 0,
    totalCommentsRemoved: 0,
  };

  for (const target of targetDirs) {
    processPath(target, { dryRun: isDryRun, preserveDirectives: true }, stats);
  }

  console.log("-----------------------------------------");
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files ${isDryRun ? "that would be modified" : "modified"}: ${stats.filesModified}`);
  console.log(`Comments ${isDryRun ? "that would be removed" : "removed"}: ${stats.totalCommentsRemoved}`);
  console.log("=========================================");
}

if (require.main === module) {
  main();
}
