import express from "express";
import manga from "../services/manga.js";
import { cacheFetch } from "../utils/cache.js";

const router = express.Router();

router.get("/search", async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Query required" },
      });
    }

    const cacheKey = `manga:search:${q}:${page}:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => manga.searchManga(q, page, limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/trending", async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const cacheKey = `manga:trending:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => manga.getTrendingManga(limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `manga:${id}`;
    const result = await cacheFetch(
      cacheKey,
      () => manga.getMangaInfo(id),
      3600,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/chapters", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const cacheKey = `manga:${id}:chapters:${page}`;
    const result = await cacheFetch(
      cacheKey,
      () => manga.getChapters(id),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/chapter/:chapterId", async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const result = await manga.getChapterPages(chapterId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
