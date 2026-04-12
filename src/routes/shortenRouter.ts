import { Router } from "express";
import { ShortenController } from "../controllers/shortenController";
import { validateData } from "../middleware/validationMiddleware";
import { createShortenUrlSchema } from "../schemas/shorten.schema";


const router = Router();
const controller = new ShortenController();

router.post("/shorten", validateData(createShortenUrlSchema), controller.createShortenUrl);
router.get("/urls", controller.getAllUrl);
router.get("/shorten/:id/stats", controller.getStats);
router.get("/:code", controller.getOriginalUrl);

export default router;