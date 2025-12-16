import cron from "node-cron";
import FoodPost from "../models/foodPost.js";
import { getIO } from "../socket/socketHandler.js";

// Expire food every 5 minutes
cron.schedule("*/2 * * * *", async () => {
  try {
    const now = new Date();

    const expiredPosts = await FoodPost.find({
      expiry_time: { $lt: now },
    }).select("_id");

    if (!expiredPosts.length) return;

    await FoodPost.updateMany(
      { _id: { $in: expiredPosts.map(p => p._id) } },
      {
        status: "expired",
        expiredAt: new Date(),
      }
    );

    console.log("Auto-expired posts:", expiredPosts.length);

    try {
      getIO()?.emit("food_expired", {
        ids: expiredPosts.map(p => p._id.toString()),
      });
    } catch (err) {
      console.warn("Socket.io not initialized yet:", err.message);
    }
  } catch (error) {
    console.error("Cron error:", error);
  }
});

// Cleanup expired posts after 7 days
cron.schedule("0 3 * * *", async () => {
  const res = await FoodPost.deleteMany({
    status: "expired",
    expiredAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });

  if (res.deletedCount > 0) {
    console.log("Cleaned expired posts:", res.deletedCount);
  }
});
