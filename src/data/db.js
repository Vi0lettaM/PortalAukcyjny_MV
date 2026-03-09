const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("MongoDB connected");
}

function getDB() {
    if (!db) throw new Error("Database not connected yet");
    return db;
}

module.exports = { connectDB, getDB };
