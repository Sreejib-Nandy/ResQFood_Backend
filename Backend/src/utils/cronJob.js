import cron from "node-cron";
import FoodPost from "../models/foodPost.js";
import { getIO } from "../socket/socketHandler.js";

// Expire food every 2 minutes
cron.schedule("*/2 * * * *", async () => {
  try {
    const now = new Date();

    const expiredPosts = await FoodPost.find({
      expiry_time: { $lte: now },
      status: { $in: ["available", "claimed"] },
    }).select("_id");

    if (!expiredPosts.length) return;

    await FoodPost.updateMany(
      { _id: { $in: expiredPosts.map(p => p._id) } },
      {
        status: "expired",
        expiredAt: now,
      }
    );

    console.log("Auto-expired posts:", expiredPosts.length);

    getIO()?.emit("food_expired", {
      ids: expiredPosts.map(p => p._id.toString()),
    });

  } catch (error) {
    console.error("Cron error:", error);
  }
});


//  Cleanup expired posts after 7 days
cron.schedule("0 3 * * *", async () => {
  const res = await FoodPost.deleteMany({
    status: "expired",
    expiredAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });

  if (res.deletedCount > 0) {
    console.log("Cleaned expired posts:", res.deletedCount);
  }
});
