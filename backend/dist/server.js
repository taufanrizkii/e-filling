"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const index_1 = require("./index");
const database_1 = require("./configs/database");
const PORT = index_1.config.port || 5000;
const startServer = async () => {
    try {
        // Test database connection
        await database_1.pool.query('SELECT NOW()');
        console.log('Database connected successfully');
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${index_1.config.nodeEnv}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await database_1.pool.end();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await database_1.pool.end();
    process.exit(0);
});
//# sourceMappingURL=server.js.map