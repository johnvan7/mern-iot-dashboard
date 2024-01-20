import express from "express";
import {authorize} from "../../middlewares/auth";
import {ADMIN, SENSOR, USER} from "../../types/entityTypes";
import {samplesController} from "../../controllers/samples";

const router = express.Router();

router.get('/:id', authorize([ADMIN, USER]), samplesController.getById);
router.get('', authorize([ADMIN, USER]), samplesController.getAll);
router.post('', authorize([SENSOR]), samplesController.create);

export {router as samplesRouter};
