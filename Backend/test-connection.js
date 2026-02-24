require("dotenv").config();
const pool = require("./src/config/db");

async function testConnection() {
    try {
        console.log("Testing database connection...");
        const result = await pool.query("SELECT NOW()");
        console.log("✅ Database connected successfully!");
        console.log("Current time from DB:", result.rows[0].now);
        
        // Test if users table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);
        
        if (tableCheck.rows[0].exists) {
            console.log("✅ Users table exists");
        } else {
            console.log("❌ Users table does NOT exist");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
}

testConnection();
