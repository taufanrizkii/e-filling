"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendidikanService = void 0;
const pendidikan_repository_1 = require("../repositories/pendidikan.repository");
const pendidikan_1 = require("../models/pendidikan");
// import { Result } from "pg";
// import { stat } from "fs";
class PendidikanService {
    constructor() {
        this.pendidikanRepository = new pendidikan_repository_1.PendidikanRepository();
    }
    async getAll() {
        const result = await this.pendidikanRepository.findAll();
        return result.map((pendidikan) => new pendidikan_1.PendidikanItemDTO(pendidikan.id, pendidikan.tahun_ajaran.toString() +
            "/" +
            (pendidikan.tahun_ajaran + 1).toString() +
            " " +
            pendidikan.semester, pendidikan.mata_kuliah, pendidikan.kelas + "/" + pendidikan.sks.toString() + "SKS", pendidikan.status));
    }
}
exports.PendidikanService = PendidikanService;
//# sourceMappingURL=pendidikan.service.js.map