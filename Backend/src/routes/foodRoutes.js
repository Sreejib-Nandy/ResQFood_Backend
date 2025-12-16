import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { verifyRestaurantOwnership } from "../middlewares/foodMiddleware.js";
import upload from "../middlewares/upload.js";
import { createFood, getAllFood, claimFood, getNearbyFoods, markCollected, getFoodPostsByRestaurant, getClaimedFoodsByNGO} from "../controllers/foodController.js";
import { getIO } from "../socket/socketHandler.js";

const router = express.Router();

router.get("/", getAllFood);
router.get("/restaurant/:restaurantId", protect, getFoodPostsByRestaurant);
router.get("/nearby", protect, getNearbyFoods); // requires coordinates in query or user profile
// Create food post
router.post("/createfood", upload.single("food_image"),protect, authorizeRoles("restaurant"), createFood);
// Claimed food post
router.patch("/:id/claim", protect, authorizeRoles("ngo"), claimFood);
router.get("/claimed",protect,authorizeRoles("ngo"),getClaimedFoodsByNGO);
// Collected food 
router.patch("/:id/collected", protect, authorizeRoles("ngo"), markCollected);

// Update food post
router.put("/food/:id", protect, verifyRestaurantOwnership, async (req, res) => {
  const updates = req.body;
  const allowedUpdates = [
    "food_name",
    "quantity",
    "description",
    "expiry_time",
    "location",
    "food_image"
  ];

  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      req.food[field] = updates[field];
    }
  });
  await req.food.save();

  const io = getIO();
  io?.emit("post_updated", req.food);

  res.json({ success: true, message: "Food updated", food: req.food });
});

// Delete food post
router.delete("/food/:id", protect, verifyRestaurantOwnership, async (req, res) => {
  const foodId = req.food._id;
  await req.food.deleteOne();

  const io = getIO();
  io?.emit("post_deleted", foodId);

  res.json({ success: true, message: "Food post deleted" });
});


export default router;
