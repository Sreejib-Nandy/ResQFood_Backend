import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { verifyRestaurantOwnership } from "../middlewares/foodMiddleware.js";
import upload from "../middlewares/upload.js";
import { createFood, getAllFood, claimFood, getNearbyFoods, markCollected } from "../controllers/foodController.js";

const router = express.Router();

router.get("/", getAllFood);
router.get("/nearby", protect, getNearbyFoods); // requires coordinates in query or user profile
// Create food post
router.post("/createfood", protect, authorizeRoles("restaurant"), upload.array("food_images", 5), createFood);
// Claimed food post
router.patch("/:id/claim", protect, authorizeRoles("ngo"), claimFood);
// Collected food 
router.patch("/:id/collected", protect, authorizeRoles("ngo"), markCollected);

// Update food post
router.put("/food/:id", protect, verifyRestaurantOwnership, async (req, res) => {
  const updates = req.body;
  Object.assign(req.food, updates);
  await req.food.save();
  res.json({ success: true, message: "Food updated", food: req.food });
});

// Delete food post
router.delete("/food/:id", protect, verifyRestaurantOwnership, async (req, res) => {
  await req.food.remove();
  res.json({ success: true, message: "Food post deleted" });
});


export default router;
