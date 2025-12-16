import FoodPost from "../models/foodPost.js";
import { getIO } from "../socket/socketHandler.js";

/**
 * Expire foods whose expiry_time has passed
 */
export const expireFoods = async () => {
  const now = new Date();

  const expiredPosts = await FoodPost.find({
    expiry_time: { $lte: now },
    status: { $in: ["available", "claimed"] },
  }).select("_id");

  if (!expiredPosts.length) {
    return { expired: 0 };
  }

  await FoodPost.updateMany(
    { _id: { $in: expiredPosts.map(p => p._id) } },
    {
      status: "expired",
      expiredAt: now,
    }
  );

  try {
    getIO()?.emit("food_expired", {
      ids: expiredPosts.map(p => p._id.toString()),
    });
  } catch (e) {
    console.warn("Socket emit skipped:", e.message);
  }

  return { expired: expiredPosts.length };
};

/**
 * Cleanup expired foods older than 7 days
 */
export const cleanupExpiredFoods = async () => {
  const result = await FoodPost.deleteMany({
    status: "expired",
    expiredAt: {
      $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { deleted: result.deletedCount || 0 };
};
