// scripts/investigate.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testSession() {
  console.log('\n⏱️  Testing /api/auth/session…');

  const base = process.env.NEXTAUTH_URL?.replace(/\/$/, '');
  if (!base) {
    console.error('  ⚠️  NEXTAUTH_URL not set in .env.local');
    return;
  }

  const url = base + '/api/auth/session';
  const start = Date.now();
  try {
    const res = await fetch(url);             // ← use global fetch
    const ms = Date.now() - start;
    const text = await res.text();
    console.log(`  • GET ${url}`);
    console.log(`    – status: ${res.status} (${ms}ms)`);
    console.log(`    – content-type: ${res.headers.get('content-type')}`);
    console.log('    – body (first 200 chars):\n' +
                text.slice(0, 200) +
                (text.length > 200 ? '…' : ''));
  } catch (err) {
    console.error('  ✖ fetch error:', err);
  }
}

async function testDB() {
  console.log('\n⏱️  Testing MongoDB connection…');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('  ⚠️  MONGODB_URI not set in .env.local');
    return;
  }

  const start = Date.now();
  try {
    await mongoose.connect(uri, { dbName: 'coworking' });
    console.log(`  • connected to MongoDB in ${Date.now() - start}ms`);
  } catch (err) {
    console.error('  ✖ mongoose.connect error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

(async () => {
  await testSession();
  await testDB();
  console.log('\n✅ Done.');
  process.exit(0);
})();
