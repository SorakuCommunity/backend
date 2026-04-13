import express from "express";
import anilist from "../services/anilist.js";
import anify from "../services/anify.js";
import { cacheFetch } from "../utils/cache.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `schedule:${page}:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => anilist.getAiringSchedule(page, limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/today", async (req, res, next) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const today = new Date();
    const dayStart = new Date(today.setHours(0, 0, 0, 0)).getTime() / 1000;
    const dayEnd = dayStart + 86400;

    const cacheKey = `schedule:today`;
    const result = await cacheFetch(
      cacheKey,
      () => anilist.getAiringSchedule(1, 50, dayStart, dayEnd),
      3600,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:day", async (req, res, next) => {
  try {
    const { day } = req.params;
    const days = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    const dayNum = days[day.toLowerCase()];

    if (dayNum === undefined) {
      return res
        .status(400)
        .json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message:
              "Invalid day. Use: sunday, monday, tuesday, wednesday, thursday, friday, saturday",
          },
        });
    }

    const now = new Date();
    const currentDay = now.getDay();
    const diff = (dayNum - currentDay + 7) % 7;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    targetDate.setHours(0, 0, 0, 0);

    const start = Math.floor(targetDate.getTime() / 1000);
    const end = start + 86400;

    const cacheKey = `schedule:day:${day}`;
    const result = await cacheFetch(
      cacheKey,
      () => anilist.getAiringSchedule(1, 50, start, end),
      3600,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/week/:year/:season", async (req, res, next) => {
  try {
    const { year, season } = req.params;
    const cacheKey = `schedule:week:${year}:${season}`;
    const result = await cacheFetch(
      cacheKey,
      () => anilist.getSeasonAnime(year, season),
      3600,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
