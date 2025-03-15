export async function onRequest(context) {
    const { request, env } = context;

    // Simple example: Fetch all users
    const { results } = await env.DB.prepare("SELECT * FROM users").all();

    return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const { name } = await request.json();

    await env.DB.prepare("INSERT INTO users (name) VALUES (?)").bind(name).run();

    return new Response("User added successfully!");
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    const { results } = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).all();

    return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
    });
}
