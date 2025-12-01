"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pendidikan_controller_1 = require("../controllers/pendidikan.controller");
//import { body } from "express-validator";
//import { validate } from '../middleware/validator';
const router = (0, express_1.Router)();
const pendidikanController = new pendidikan_controller_1.PendidikanController();
router.get("/pendidikan/all", pendidikanController.getAll);
// router.get('/:id', exampleController.getById);
// router.post('/', validate(createExampleValidation), exampleController.create);
// router.put('/:id', validate(createExampleValidation), exampleController.update);
// router.delete('/:id', exampleController.delete);
exports.default = router;
//# sourceMappingURL=pendidikan.routes.js.map