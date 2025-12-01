import { Router } from "express";
import { PendidikanController } from "../controllers/pendidikan.controller";
//import { body } from "express-validator";
//import { validate } from '../middleware/validator';

const router = Router();
const pendidikanController = new PendidikanController();

router.get("/pendidikan/all", pendidikanController.getAll);
// router.get('/:id', exampleController.getById);
router.post("/pendidikan", pendidikanController.create);
// router.put('/:id', validate(createExampleValidation), exampleController.update);
// router.delete('/:id', exampleController.delete);

export default router;
