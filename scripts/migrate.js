// scripts/migrate.js
// Auto-runs database.sql against your Supabase project.
// Usage: npm run db:migrate
// Requires: SUPABASE_ACCESS_TOKEN in .env.local
//   -> Get yours at: https://supabase.com/dashboard/account/tokens

const fs = require("fs");
const path = require("path");

// ─── Load .env.local manually (no extra deps needed) ─────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env.local not found");
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

// ─── Extract project ref from Supabase URL ────────────────────────────────────
function getProjectRef(supabaseUrl) {
  // e.g. https://giedhzkjhmtmvqbuwfoh.supabase.co
  const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
  if (!match) {
    console.error("❌ Could not parse project ref from NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
  }
  return match[1];
}

async function runMigration() {
  loadEnv();

  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!accessToken || accessToken === "your_supabase_access_token_here") {
    console.error(`
❌ SUPABASE_ACCESS_TOKEN is not set.

To get your token (one-time setup):
  1. Go to https://supabase.com/dashboard/account/tokens
  2. Create a new token (e.g. "Trivo Migrations")
  3. Add this to your .env.local:
     SUPABASE_ACCESS_TOKEN=your_token_here
  4. Run: npm run db:migrate
    `);
    process.exit(1);
  }

  if (!supabaseUrl) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
    process.exit(1);
  }

  const projectRef = getProjectRef(supabaseUrl);
  const sqlPath = path.join(__dirname, "..", "database.sql");

  if (!fs.existsSync(sqlPath)) {
    console.error("❌ database.sql not found in project root");
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, "utf-8");

  console.log(`🚀 Running database migration...`);
  console.log(`   Project: ${projectRef}`);
  console.log(`   SQL file: ${path.basename(sqlPath)} (${(sql.length / 1024).toFixed(1)} KB)\n`);

  const apiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

  let response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });
  } catch (err) {
    console.error("❌ Network error:", err.message);
    process.exit(1);
  }

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.error(`❌ Migration failed (HTTP ${response.status}):`);
    console.error(typeof data === "object" ? JSON.stringify(data, null, 2) : data);
    process.exit(1);
  }

  console.log("✅ Migration completed successfully!");
  console.log("   All tables, policies, and seed data are up to date.\n");
}

runMigration().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
