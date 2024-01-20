import express from "express";
import {loginController} from "../../controllers/login";

const router = express.Router();

router.post('', loginController.loginOrSignup);
router.post('/confirm', loginController.confirm);

export {router as loginRouter};
