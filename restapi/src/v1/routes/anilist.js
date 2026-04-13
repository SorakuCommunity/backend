import express from "express";
import anilist from "../services/anilist.js";
import { cacheFetch } from "../utils/cache.js";

const router = express.Router();

router.get("/search", async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({
          success: false,
          error: { code: "BAD_REQUEST", message: "Query required" },
        });
    }

    const cacheKey = `anilist:search:${q}:${page}:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => anilist.search(q, page, limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/advanced-search", async (req, res, next) => {
  try {
    const {
      q,
      type = "ANIME",
      page = 1,
      limit = 20,
      format,
      sort,
      genres,
      year,
      status,
      season,
    } = req.query;

    const cacheKey = `anilist:advanced:${q}:${type}:${page}:${format}:${sort}:${genres}:${year}:${status}:${season}`;
    const result = await cacheFetch(
      cacheKey,
      () =>
        anilist.advancedSearch({
          query: q,
          type,
          page,
          perPage: limit,
          format,
          sort,
          genres,
          year,
          status,
          season,
        }),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/trending", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `anilist:trending:${page}:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => anilist.getTrendingAnime(page, limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/popular", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `anilist:popular:${page}:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => anilist.getPopularAnime(page, limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/season", async (req, res, next) => {
  try {
    const { year, season } = req.query;
    if (!year || !season) {
      return res
        .status(400)
        .json({
          success: false,
          error: { code: "BAD_REQUEST", message: "Year and season required" },
        });
    }

    const cacheKey = `anilist:season:${year}:${season}`;
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

router.get("/schedule", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `anilist:schedule:${page}:${limit}`;
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

router.get("/genres", async (req, res, next) => {
  try {
    const cacheKey = "anilist:genres";
    const result = await cacheFetch(cacheKey, () => anilist.getGenres(), 86400);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `anilist:anime:${id}`;
    const result = await cacheFetch(
      cacheKey,
      () => anilist.getAnimeInfo(id),
      3600,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
