"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const index_1 = require("../index");
exports.pool = new pg_1.Pool({
    host: index_1.config.database.host,
    port: index_1.config.database.port,
    database: index_1.config.database.name,
    user: index_1.config.database.user,
    password: index_1.config.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
//# sourceMappingURL=database.js.map