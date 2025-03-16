export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'POST') {
    const { username, password } = await request.json();

    // Check if the username exists in the database
    const existingUserQuery = `
      SELECT * FROM users WHERE username = ?;
    `;
    const existingUser = await env.DB.prepare(existingUserQuery)
      .bind(username)
      .first();

    if (existingUser) {
      // Username exists, verify the password
      const passwordMatches = await verifyPassword(password, existingUser.password);
      if (passwordMatches) {
        return new Response(JSON.stringify({ message: 'Login successful', success: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ message: 'Invalid password' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Username doesn't exist, create the user
      const hashedPassword = await hashPassword(password);
      const insertUserQuery = `
        INSERT INTO users (username, password) VALUES (?, ?);
      `;
      await env.DB.prepare(insertUserQuery)
        .bind(username, hashedPassword)
        .run();

      return new Response(JSON.stringify({ message: 'Signup successful', success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const hashed = await crypto.subtle.digest('SHA-256', passwordBytes);
  return Array.from(new Uint8Array(hashed)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(inputPassword, storedPasswordHash) {
  const inputHashed = await hashPassword(inputPassword);
  return inputHashed === storedPasswordHash;
}
