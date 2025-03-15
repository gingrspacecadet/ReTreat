async function createTable(env) {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `;

    try {
        await env.DB.prepare(createTableQuery).run();
        console.log("Table 'users' created successfully!");
    } catch (error) {
        console.error("Error creating table:", error);
    }
}

createTable(globalThis).catch(console.error);
