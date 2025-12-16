import express from "express";
import {
    expireFoods,
    cleanupExpiredFoods,
} from "../services/foodCronService.js";

const router = express.Router();

/**
 * POST /api/cron/expire-foods
 * Runs food expiry job
 */
router.post("/expire-foods", async (req, res) => {
    if (req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const result = await expireFoods();

        res.status(200).json({
            success: true,
            message: "Food expiry job executed",
            ...result,
        });
    } catch (error) {
        console.error("Expire foods cron error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * POST /api/cron/cleanup-expired
 * Deletes expired foods older than 7 days
 */
router.post("/cleanup-expired", async (req, res) => {
    try {
        const result = await cleanupExpiredFoods();

        res.status(200).json({
            success: true,
            message: "Expired food cleanup executed",
            ...result,
        });
    } catch (error) {
        console.error("Cleanup cron error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;
