import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { verifyRestaurantOwnership } from "../middlewares/foodMiddleware.js";
import upload from "../middlewares/upload.js";
import { createFood, getAllFood, claimFood, getNearbyFoods, markCollected, getFoodPostsByRestaurant, getClaimedFoodsByNGO } from "../controllers/foodController.js";
import cloudinary from "../config/cloudinary.js";
import { getIO } from "../socket/socketHandler.js";

const router = express.Router();

router.get("/", getAllFood);
router.get("/restaurant/:restaurantId", protect, getFoodPostsByRestaurant);
router.get("/nearby", protect, getNearbyFoods); // requires coordinates in query or user profile
// Create food post
router.post("/createfood", upload.single("food_image"), protect, authorizeRoles("restaurant"), createFood);
// Claimed food post
router.patch("/:id/claim", protect, authorizeRoles("ngo"), claimFood);
router.get("/claimed", protect, authorizeRoles("ngo"), getClaimedFoodsByNGO);
// Collected food 
router.patch("/:id/collected", protect, authorizeRoles("ngo"), markCollected);

router.put(
  "/food/:id",
  protect,
  verifyRestaurantOwnership,
  upload.single("food_image"),
  async (req, res) => {
    try {
      const updates = req.body;

      const allowedUpdates = [
        "food_name",
        "quantity",
        "description",
        "location",
      ];

      allowedUpdates.forEach((field) => {
        if (updates[field] !== undefined) {
          req.food[field] = updates[field];
        }
      });

      if (updates.expiry_time) {
        req.food.expiry_time = new Date(updates.expiry_time);
      }

      if (req.file) {
        // delete old image from cloudinary
        if (req.food.food_image?.[0]?.public_id) {
          await cloudinary.uploader.destroy(
            req.food.food_image[0].public_id
          );
        }

        req.food.food_image = [
          {
            url: req.file.path,
            public_id: req.file.filename,
          },
        ];
      }

      await req.food.save();

      let io;
      try {
        io = getIO();
      } catch (e) {
        console.warn("Socket not initialized yet");
      }
      if(io) {
      io?.emit("post_updated", {
        _id: post._id,
        food_name: post.food_name,
        quantity: post.quantity,
        description: post.description,
        expiry_time: post.expiry_time,
        location: post.location,
        food_image: post.food_image,
        restaurantId: post.restaurantId,
      });
    }

      res.json({
        success: true,
        message: "Food updated successfully",
        food: req.food,
      });

    } catch (err) {
      console.error("Update food error:", err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);


// Delete food post
router.delete("/food/:id", protect, verifyRestaurantOwnership, async (req, res) => {
  try {
    const foodId = req.food._id;
    await req.food.deleteOne();

    let io;
      try {
        io = getIO();
      } catch (e) {
        console.warn("Socket not initialized yet");
      }
    io?.emit("post_deleted", {
      foodId: foodId.toString(),
    });

    res.json({ success: true, message: "Food post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
