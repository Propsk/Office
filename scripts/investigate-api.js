// scripts/investigate-api.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Simple probe function
async function probe(method, path, body = null) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL;
  if (!base) {
    console.error('⚠️  NEXT_PUBLIC_BASE_URL / NEXTAUTH_URL not set');
    return;
  }
  const url = base.replace(/\/$/, '') + path;
  process.stdout.write(`\n📡 ${method} ${path} … `);
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method,
      headers: body
        ? { 'Content-Type': 'application/json' }
        : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const ms = Date.now() - start;
    const ct = res.headers.get('content-type') || '';
    const text = await res.text();
    console.log(`status ${res.status} (${ms}ms), content-type: ${ct}`);
    console.log('⤷ snippet:', text.slice(0, 200).replace(/\n/g, ' '));
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
    const t0 = Date.now();
    await mongoose.connect(uri);
    console.log(`✔ MongoDB connected (${Date.now() - t0}ms)`);
  } catch (err) {
    console.error('✖ mongoose.connect error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

;(async () => {
  await testMongo();

  // NextAuth endpoints (we know these are OK, but for completeness)
  await probe('GET',  '/api/auth/session');
  await probe('GET',  '/api/auth/providers');
  await probe('GET',  '/api/auth/csrf');

  // Your property routes
  await probe('GET',  '/api/properties');
  await probe('GET',  '/api/properties?page=1&pageSize=1');
  await probe('GET',  '/api/properties/123INVALID');             // invalid ID
  await probe('POST', '/api/properties', { foo: 'bar' });         // should 401 or 500
  await probe('PUT',  '/api/properties/123INVALID', { foo: 'bar' });
  await probe('DELETE','/api/properties/123INVALID');

  // Upload route
  await probe('POST','/api/upload');

  console.log('\n✅ All done.');
  process.exit(0);
})();
