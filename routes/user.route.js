import express from "express";
import { updateUser, deleteUser, getUserListings, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import upload from "../middleware/uploads.js";

const router = express.Router();

router.put("/update/:id", verifyToken, upload, updateUser); // ✅ Use PUT & Multer
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);


export default router;