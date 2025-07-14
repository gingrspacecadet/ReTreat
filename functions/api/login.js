export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DB) {
    console.error("Database not initialized or available.");
    return jsonResponse({ error: "Database not initialized" }, 500);
  }

  console.log("DB Object:", env.DB); // Check if it's valid

  if (request.method === "POST") {
    try {
      const requestBody = await request.text();
      if (!requestBody) {
        console.error("Empty request body");
        return jsonResponse({ error: "Empty request body" }, 400);
      }

      const { username, password } = JSON.parse(requestBody);
      if (!username || !password) {
        console.error("Missing username or password");
        return jsonResponse({ error: "Missing username or password" }, 400);
      }

      console.log("Checking user:", username);

      // Query the database for the username
      const existingUser = await env.DB.prepare(
        "SELECT * FROM users WHERE username = ?"
      )
        .bind(username)
        .first();

      console.log("Query result for user:", existingUser);

      if (!existingUser) {
        // User does not exist, create a new user
        console.log("User not found, creating new one...");
        const hashedPassword = await hashPassword(password);
        await env.DB.prepare(
          "INSERT INTO users (username, password) VALUES (?, ?)"
        )
          .bind(username, hashedPassword)
          .run();

        return jsonResponse({ message: "Signup successful", success: true });
      } else {
        // User exists, verify the password
        console.log("User found in DB:", existingUser);

        const passwordMatches = await verifyPassword(password, existingUser.password);
        if (passwordMatches) {
          // Password matches, signal frontend to perform the redirect
          return jsonResponse({
            message: "Login successful",
            success: true,
            redirectUrl: "/settings.html", // Indicating the URL to redirect to
          });
        } else {
          // Incorrect password
          console.error("Incorrect password");
          return jsonResponse({ error: "Incorrect password" }, 400);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      return jsonResponse({ error: `Server error: ${error.message}` }, 500);
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  }
};

async function handleRequest(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (request.method === "POST") {
    try {
      const requestBody = await request.text();
      if (!requestBody) {
        return jsonResponse({ error: "Empty request body" }, 400);
      }

      const { username, password } = JSON.parse(requestBody);
      if (!username || !password) {
        return jsonResponse({ error: "Missing username or password" }, 400);
      }

      const existingUser = await env.DB.prepare(
        "SELECT * FROM users WHERE username = ?"
      )
        .bind(username)
        .first();

      console.log("Query result for user:", existingUser);

      if (!existingUser) {
        // User not found, create a new one
        console.log("User not found, creating new one...");
        const hashedPassword = await hashPassword(password);
        await env.DB.prepare(
          "INSERT INTO users (username, password) VALUES (?, ?)"
        )
          .bind(username, hashedPassword)
          .run();
        return jsonResponse({ message: "Signup successful", success: true });
      } else {
        const passwordMatches = await verifyPassword(password, existingUser.password);
        if (passwordMatches) {
          // Login successful, send a response with the URL to redirect
          return jsonResponse({
            message: "Login successful",
            success: true,
            redirectUrl: "/settings.html",
          });
        } else {
          console.error("Incorrect password");
          return jsonResponse({ error: "Incorrect password" }, 400);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      return jsonResponse({ error: `Server error: ${error.message}` }, 500);
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
}

// Helper function to return JSON responses with CORS headers
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(),
  });
}

// **Updated CORS Headers to Allow Custom Headers**
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://retreat-4vv.pages.dev", // Set to your frontend URL
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Custom-Header",
    "Access-Control-Allow-Credentials": "true", // Allow credentials like cookies
    "Content-Type": "application/json",
  };
}

// Hash password using SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const hashed = await crypto.subtle.digest("SHA-256", passwordBytes);
  return Array.from(new Uint8Array(hashed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Verify password hash
async function verifyPassword(inputPassword, storedPasswordHash) {
  const inputHashed = await hashPassword(inputPassword);
  return inputHashed === storedPasswordHash;
}
