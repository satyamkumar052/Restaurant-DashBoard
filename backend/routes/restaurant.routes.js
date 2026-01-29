import { Router } from "express";
import {getRestaurantTrends, getRestaurent, getTopRestaurents} from "../controller/restaurant.controller.js";

const router = Router();

router.get("/getRestaurent", getRestaurent);
router.get("/top", getTopRestaurents);
router.get("/:id/trends", getRestaurantTrends);

export default router;
