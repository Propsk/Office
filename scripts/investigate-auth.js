// scripts/investigate-auth.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function probe(path) {
  const base = process.env.NEXTAUTH_URL?.replace(/\/$/, '');
  if (!base) {
    console.error('⚠️  NEXTAUTH_URL not set in .env.local');
    return;
  }
  const url = base + path;
  process.stdout.write(`\n📡 GET ${path} … `);
  const start = Date.now();
  try {
    const res = await fetch(url);
    const ms = Date.now() - start;
    const ct = res.headers.get('content-type') || '';
    const text = await res.text();
    console.log(`status ${res.status} (${ms}ms), content-type: ${ct}`);
    console.log('⤷ body snippet:', text.slice(0, 200).replace(/\n/g, ' '));
  } catch (err) {
    console.error('✖ fetch error:', err);
  }
}

async function testMongo() {
  console.log('\n🗄️  Testing MongoDB connection…');
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set');
    return;
  }
  try {
    const start = Date.now();
    await mongoose.connect(uri, { dbName: 'coworking' });
    console.log(`✔ MongoDB connected (${Date.now()-start}ms)`);
  } catch (err) {
    console.error('✖ mongoose.connect error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

;(async () => {
  // NextAuth public endpoints
  await probe('/api/auth/session');
  await probe('/api/auth/providers');
  await probe('/api/auth/csrf');
  await testMongo();
  console.log('\n✅ Investigation complete.');
  process.exit(0);
})();
