import { Router } from "express";
import { ShortenController } from "../controllers/shortenController";

const router = Router();
const controller = new ShortenController();

router.post("/shorten", controller.createShortenUrl);
router.get("/urls", controller.getAllUrl);
router.get("/shorten/:id/stats", controller.getStats);
router.get("/:code", controller.getOriginalUrl);

export default router;