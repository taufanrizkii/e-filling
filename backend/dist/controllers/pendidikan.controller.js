"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendidikanController = void 0;
const pendidikan_service_1 = require("../services/pendidikan.service");
//import { AppError } from '../middleware/errorHandler';
class PendidikanController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const examples = await this.pendidikanService.getAll();
                console.log(req);
                res.json({
                    status: "success",
                    data: examples,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.pendidikanService = new pendidikan_service_1.PendidikanService();
    }
}
exports.PendidikanController = PendidikanController;
//# sourceMappingURL=pendidikan.controller.js.map