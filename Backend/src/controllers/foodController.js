import FoodPost from "../models/foodPost.js";
import { getIO } from "../socket/socketHandler.js";
/**
 * Create a food post
 * - req.files => array of uploaded images (cloudinary)
 * - req.body.location => optionally GeoJSON string or address string
 *   We prefer to require location coordinates in body for accuracy; but if you send address, backend can geocode.
 */
import axios from "axios";
import { sendSMS } from "../utils/twilio.js";
import User from "../models/User.js";

const geocodeAddress = async (address) => {
  if (!address) return null;
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&limit=1`;
  const res = await axios.get(url);
  const feat = res.data.features?.[0];
  if (!feat) return null;
  const [lng, lat] = feat.geometry.coordinates;
  return { type: "Point", coordinates: [lng, lat] };
};

// Create a new food post
export const createFood = async (req, res) => {
  try {
    const { food_name, quantity, description, expiry_time, address } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(200).json({
        success: false,
        message: "Food image is required",
      });
    }
    const images = [
      {
        url: file.path,
        public_id: file.filename,
      },
    ];

    let geoPoint = null;

    // fallback : if address present, geocode
    if (address) {
      const g = await geocodeAddress(address);
      if (g) {
        geoPoint = g;
      }
    }

    // fallback : use restaurant's saved location
    if (!geoPoint) {
      const rest = await User.findById(req.user._id);
      if (rest?.location?.coordinates) {
        geoPoint = rest.location;
      }
    }

    if (!geoPoint) {
      return res.status(200).json({ success: false, message: "Location required (address or restaurant profile location)" });
    }

    if (!expiry_time) {
      return res.status(200).json({ success: false, message: "expiry_time is required" });
    }

    const post = await FoodPost.create({
      restaurantId: req.user._id,
      food_name,
      quantity,
      description,
      expiry_time: expiry_time ? new Date(expiry_time) : null,
      location: geoPoint,
      food_image: images,
    });

    const io = getIO();
    io?.emit("new_food_post", post);

    res.status(200).json({ success: true, message: "Notification sent", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all foodposts from specific restaurant
export const getFoodPostsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const foodPosts = await FoodPost.find({ restaurantId })
      .populate("restaurantId", "name address contactInfo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foodPosts.length,
      data: foodPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch food posts",
    });
  }
};

// Get all the food post from different restaurants
export const getAllFood = async (req, res) => {
  try {
    const posts = await FoodPost.find({ status: "available" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Claimed food by any NGO
export const claimFood = async (req, res) => {
  try {
    const post = await FoodPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    if (post.status !== "available") {
      return res.status(400).json({ success: false, message: "Not available" });
    }

    post.status = "claimed";
    post.claimedBy = req.user._id;
    post.claimedAt = new Date();
    await post.save();

    // Send SMS to restaurant
    const restaurant = await User.findById(post.restaurantId);
    const ngo = await User.findById(req.user._id);
    if (restaurant?.contactInfo) {
      sendSMS(
        restaurant.contactInfo,
        `🌱 Great news! Your food donation "${post.food_name}" (Quantity: ${post.quantity}) has been claimed by ${req.user.name} from ${req.user.organization || "an NGO"}.\n\n` +
        `Thank you for helping reduce food waste and support people in need. Your generosity is making a difference! 🍽️`
      );
    }
    if (ngo?.contactInfo) {
      sendSMS(
        ngo.contactInfo,
        `🍽️ Food Claimed Successfully!

        Food: "${post.food_name}"
        Quantity: "${post.quantity}"

        Expiry time:
        ${new Date(post.expiry_time).toLocaleString()}

        Location:
        https://www.google.com/maps?q=${post.location.coordinates[1]},${post.location.coordinates[0]}

        Restaurant: ${restaurant.name}

        Please collect the food before it expires.
        Thank you for helping reduce food waste and fight hunger 💚`
      );
    }

    const io = getIO();
    io?.emit("food_claimed", post);

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get food within radius (km) from given coords. If no coords passed, uses user's saved location
export const getNearbyFoods = async (req, res) => {
  try {
    let { radius_km } = req.query;
    radius_km = parseFloat(radius_km || "5");

    // use user's saved location if not provided
    if (!req.user || !req.user.location?.coordinates) {
      return res.status(400).json({ success: false, message: "Provide coordinates or set user profile location" });
    }
    const [lng, lat] = req.user.location.coordinates;

    const meters = radius_km * 1000;

    const foods = await FoodPost.find({
      status: "available",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: meters
        }
      }
    });

    res.json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Mark as collected
export const markCollected = async (req, res) => {
  try {
    const { id: foodId } = req.params;
    const ngoId = req.user.id;
    const food = await FoodPost.findById(foodId);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    const restaurant = await User.findById(food.restaurantId);

    if (!food.claimedBy || food.claimedBy.toString() !== ngoId)
      return res.status(403).json({ error: "Unauthorized" });

    if (food.status !== "claimed") {
      return res.status(400).json({ message: "Food is not claimed yet" });
    }

    food.status = "collected";
    food.collectedAt = new Date();
    await food.save();

    // Send SMS to NGO
    const ngo = await User.findById(ngoId);
    if (ngo?.contactInfo) {
      sendSMS(
        ngo.contactInfo,
        `🌟 Thank you, ${ngo.name}! You have successfully collected the food donation "${food.food_name}" (Quantity: ${food.quantity}) from ${restaurant.name}.\n\n` +
        `This food will now reach people who need it the most. Your effort is helping fight hunger and reduce food waste. Keep up the amazing work! 💚`
      );
    }

    const io = getIO();
    io.emit("foodCollected", { foodId });

    res.json({ success: true, message: "Food marked as collected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClaimedFoodsByNGO = async (req, res) => {
  try {
    const ngoId = req.user._id;

    const foods = await FoodPost.find({
      claimedBy: ngoId,
      status: "claimed",
    }).populate("restaurantId", "name address");

    res.status(200).json({
      success: true,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};