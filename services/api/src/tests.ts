import { prisma } from './utils/prisma';
import jwt from 'jsonwebtoken';

async function runTests() {
  console.log('--- 1. SEEDING DB ---');
  try {
    const venue = await prisma.venue.upsert({
      where: { id: 'venue-001' },
      update: {},
      create: { id: 'venue-001', name: 'Rajiv Gandhi International Stadium' }
    });
    console.log('Venue:', venue.name);

    const zone = await prisma.zone.upsert({
      where: { id: 'zone-food-1' },
      update: {},
      create: { id: 'zone-food-1', venueId: 'venue-001', name: 'Food Court - Level 1', type: 'concession', floor: 1 }
    });
    console.log('Zone:', zone.name);

    const product = await prisma.product.upsert({
      where: { id: 'prod-001' },
      update: {},
      create: { id: 'prod-001', venueId: 'venue-001', name: 'Chicken Biryani Box', category: 'food', price: 299, currency: 'INR' }
    });
    console.log('Product:', product.name);
  } catch (err) {
    console.error('Seed error:', err);
  }

  console.log('\n--- 2. STARTING SERVER ---');
  // We won't start server here, we assume it's running on 3000

  const BASE_URL = 'http://localhost:3000';
  let token = '';
  
  console.log('\n--- 3. TESTING API ENDPOINTS ---');
  try {
    // 3a. Auth / Login
    console.log('Waiting for server to be ready...');
    let healthy = false;
    for (let i = 0; i < 10; i++) {
       try {
         const h = await fetch(`${BASE_URL}/health`);
         if (h.ok) {
           healthy = true;
           console.log('Server is healthy:', await h.json());
           break;
         }
       } catch (e) {
         console.log('Server not ready, retrying...');
         await new Promise(resolve => setTimeout(resolve, 3000));
       }
    }

    if (!healthy) throw new Error('Server never became healthy');

    console.log('Testing POST /api/auth/login');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode: 'TKT-1111-AAAA', device_id: 'test-device' })
    });
    const loginBody = await loginRes.json();
    console.log('Login:', loginBody);
    token = loginBody.access_token;

    // 3b. Queue Join
    console.log('\nTesting POST /api/queue/join');
    const qJoinRes = await fetch(`${BASE_URL}/api/queue/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ gate_id: 'gate-A', event_id: 'event-001' })
    });
    console.log('Queue Join:', await qJoinRes.json());
    
    // 3c. Queue Status
    console.log('\nTesting GET /api/queue/status');
    const qStatusRes = await fetch(`${BASE_URL}/api/queue/status`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    console.log('Queue Status:', await qStatusRes.json());

    // 3d. Menu
    console.log('\nTesting GET /api/orders/menu/venue-001');
    const menuRes = await fetch(`${BASE_URL}/api/orders/menu/venue-001`);
    console.log('Menu:', await menuRes.json());

    // 3e. Create Order
    console.log('\nTesting POST /api/orders');
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        event_id: 'event-001',
        pickup_zone_id: 'zone-food-1',
        items: [{ product_id: 'prod-001', quantity: 2 }]
      })
    });
    console.log('Order Details:', await orderRes.json());

  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests().finally(async () => {
  await prisma.$disconnect();
});
