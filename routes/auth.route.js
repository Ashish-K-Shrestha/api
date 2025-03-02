import express from "express";
import { signin, signup, google, signOut, uploadImage } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get('/signout', signOut);
router.post("/uploadImage", uploadImage )

export default router;