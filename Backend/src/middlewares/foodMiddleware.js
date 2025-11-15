import FoodPost from "../models/foodPost.js";

// Middleware to check ownership
export const verifyRestaurantOwnership = async (req, res, next) => {
  try {
    const food = await FoodPost.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food post not found" });
    }

    if (food.restaurantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized: Not the owner" });
    }

    // Attach food to request for easier access in controller
    req.food = food;
    next();
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
