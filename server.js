const express = require("express");
const redis = require("redis");

const app = express();
const PORT = 3000;

// Connect to Redis
const client = redis.createClient({
    socket: {
        host: "127.0.0.1",
        port: 6379
    }
});

client.on("error", (err) => {
    console.log("Redis Error:", err);
});

// Rate Limiter Configuration
const LIMIT = 5;
const WINDOW = 60;

// Rate Limiter Middleware
async function rateLimiter(req, res, next) {

    try {
        // Identify client
        const userIP = req.ip;

        // Create time window
        const currentWindow = Math.floor(Date.now() / 1000 / WINDOW);

        // Generate Redis key
        const key = `rate:${userIP}:${currentWindow}`;

        // Update counter atomically
        const count = await client.eval(`
            local count = redis.call('INCR', KEYS[1])

            if count == 1 then
                redis.call('EXPIRE', KEYS[1], ARGV[1])
            end

            return count
        `, {
            keys: [key],
            arguments: [String(WINDOW)]
        });

        // Check request limit
        if (count > LIMIT) {
            return res.status(429).json({
                message: "Rate limit exceeded!",
                requests: count,
                limit: LIMIT
            });
        }

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// Connect Redis and start server
async function startServer() {

    await client.connect();

    console.log("Redis Connected Successfully!");

    // API Route
    app.get("/api", rateLimiter, (req, res) => {

        res.json({
            message: "Request accepted!",
            limit: LIMIT
        });

    });

    // Start server
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();