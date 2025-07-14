export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders() });
      }

      if (request.method === "GET") {
        return await handleGetPosts(request, env);
      }

      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders() });
    } catch (error) {
      console.error("Worker Error:", error);
      return jsonResponse({ success: false, error: "Internal Server Error" }, 500);
    }
  }
};

async function handleGetPosts(request, env) {
  try {
    const url = new URL(request.url);
    const offset = parseInt(url.searchParams.get("offset")) || 0;
    const limit = parseInt(url.searchParams.get("limit")) || 10;

    // DEBUG: Check if env.DB is defined
    if (!env.DB) {
      console.error("Error: env.DB is not defined in the worker bindings.");
      return jsonResponse({ success: false, error: "Database connection error" }, 500);
    }

    // Fetch posts
    const { results } = await env.DB.prepare(
      "SELECT username, content, created_at FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?"
    )
      .bind(limit, offset)
      .all();

    return jsonResponse({ success: true, posts: results });
  } catch (error) {
    console.error("Database Query Error:", error);
    return jsonResponse({ success: false, error: "Failed to fetch posts" }, 500);
  }
}

// Helper functions
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(),
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://retreat-4vv.pages.dev",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}
