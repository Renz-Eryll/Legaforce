import app from "./app.js";
import { PORT, NODE_ENV } from "./config/env.js";
import { connectToDatabase, disconnectDatabase } from "./config/database.js";

const startServer = async () => {
  try {
    await connectToDatabase();

    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🚀 Legaforce API Server Running          ║
║                                            ║
║   Environment: ${NODE_ENV?.padEnd(28)}║
║   Port: ${PORT?.toString().padEnd(35)}║
║   URL:http://localhost:${PORT?.toString().padEnd(20)}║
╚════════════════════════════════════════════╝
      `);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Closing server gracefully...`);

      server.close(async () => {
        console.log("HTTP server closed");
        await disconnectDatabase();
        process.exit(0);
      });

      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
