"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const index_1 = require("./index");
const pendidikan_routes_1 = __importDefault(require("./routes/pendidikan.routes"));
//import { errorHandler } from './middleware/errorHandler';
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Compression middleware
app.use((0, compression_1.default)());
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
// API routes
app.use(index_1.config.apiPrefix, pendidikan_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});
// Error handling middleware
//app.use(errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map