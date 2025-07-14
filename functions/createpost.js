export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return handleOptionsRequest();
    }
    return handleCreatePost(request, env);
  },
};

async function handleCreatePost(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method Not Allowed" }, 405);
  }

  try {
    const requestBody = await request.json();
    const { username, content } = requestBody;

    if (!username || !content || content.trim() === "") {
      return jsonResponse({ success: false, error: "Missing or empty content" }, 400);
    }

    if (!env.DB) {
      console.error("Database connection not found.");
      return jsonResponse({ success: false, error: "Database connection error" }, 500);
    }

    console.log(`Attempting to insert post: ${username} - ${content}`);

    const query = `
      INSERT INTO posts (username, content, created_at) 
      VALUES (?1, ?2, ?3);
    `;

    const stmt = env.DB.prepare(query).bind(username, content, new Date().toISOString());
    const result = await stmt.run();

    console.log("Insert Result:", result);

    if (!result.success) {
      return jsonResponse({ success: false, error: "Database insert failed" }, 500);
    }

    return jsonResponse({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    return jsonResponse({ success: false, error: "Failed to create post", details: error.message }, 500);
  }
}

// Handles OPTIONS preflight requests
function handleOptionsRequest() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://retreat-4vv.pages.dev",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Generates a JSON response with CORS headers
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://retreat-4vv.pages.dev",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
