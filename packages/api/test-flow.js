const API = 'http://localhost:3001/dev';

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

async function run() {
  console.log('1. Sign up organizer...');
  const signup = await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email: 'test-organizer@test.com', password: 'password123', role: 'organizer' }),
  });
  console.log('   OK - token received, user:', signup.user?.email);

  console.log('2. Sign up attendee...');
  await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email: 'test-attendee@test.com', password: 'password123', role: 'attendee' }),
  });
  console.log('   OK');

  console.log('3. Login as organizer...');
  const login = await request('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email: 'test-organizer@test.com', password: 'password123' }),
  });
  const token = login.token;
  console.log('   OK');

  console.log('4. Create event...');
  const event = await request('/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: 'Test Event',
      description: 'Created by flow test',
      date: new Date().toISOString(),
      location: 'Test Venue',
      capacity: 10,
    }),
  });
  console.log('   OK - event id:', event.id);

  console.log('5. List events...');
  const events = await request('/events');
  console.log('   OK - count:', events.length);

  console.log('6. Get event detail...');
  const detail = await request(`/events/${event.id}`);
  console.log('   OK -', detail.name);

  console.log('\nAll tests passed.');
}

run().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
