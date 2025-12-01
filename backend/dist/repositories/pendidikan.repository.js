"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendidikanRepository = void 0;
const database_1 = require("../configs/database");
class PendidikanRepository {
    async findAll() {
        const query = "SELECT * FROM pendidikan ORDER BY created_at DESC";
        const result = await database_1.pool.query(query);
        return result.rows;
    }
}
exports.PendidikanRepository = PendidikanRepository;
//# sourceMappingURL=pendidikan.repository.js.map