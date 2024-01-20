import express from "express";
import {ADMIN, USER} from "../../types/entityTypes";
import {authorize} from "../../middlewares/auth";
import {sensorsController} from "../../controllers/sensors";

const router = express.Router();

router.get('/:id', authorize([ADMIN, USER]), sensorsController.getById);
router.get('', authorize([ADMIN, USER]), sensorsController.getAll);
router.post('', authorize([USER, ADMIN]), sensorsController.createOrUpdate);
router.delete('/:id', authorize([ADMIN, USER]), sensorsController.deleteById);
router.put('/:id/allowedUsers', authorize([ADMIN, USER]), sensorsController.addAllowedUser);
router.delete('/:id/allowedUsers', authorize([ADMIN, USER]), sensorsController.deleteAllowedUser);

export {router as sensorsRouter};
