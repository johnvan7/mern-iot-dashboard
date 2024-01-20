import express from "express";
import {samplesRouter} from "./samples";
import {loginRouter} from "./login";
import {sensorsRouter} from "./sensors";
import {apiController} from "../../controllers";

const router = express.Router();

router.get('', apiController.apiWorks);

router.use('/samples', samplesRouter);

router.use('/sensors', sensorsRouter);

router.use('/login', loginRouter);

export {router as apiRouter};
