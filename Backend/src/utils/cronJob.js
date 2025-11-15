import cron from "node-cron";
import FoodPost from "../models/foodPost.js";
import { getIO } from "../socket/socketHandler.js";

// Check after 10 minutes ---> Cron Job schedule
cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    const res = await FoodPost.updateMany({ expiry_time: { $lt: now }, status : "available" }, { status : "expired" });
    if (res.modifiedCount > 0) {
      console.log("🕒 Auto-expired posts:", res.modifiedCount);
      try {
        getIO()?.emit("food_expired", { count: res.modifiedCount });
      } catch (err) {
        console.warn("Socket.io not initialized yet :", err.message);
      }
    }
  } catch (error) {
    console.error("Cron error :", error);
  }
});
