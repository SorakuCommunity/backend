import express from "express";
import anify from "../services/anify.js";
import gogoanime from "../services/gogoanime.js";
import jikan from "../services/jikan.js";
import samehadaku from "../services/samehadaku.js";
import otakudesu from "../services/otakudesu.js";
import hianime from "../services/hianime.js";
import { cacheFetch } from "../utils/cache.js";

const router = express.Router();

router.get("/search", async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20, source = "anify" } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Query required" },
      });
    }

    const cacheKey = `anime:search:${source}:${q}:${page}:${limit}`;
    let result;

    switch (source) {
      case "anify":
        result = await cacheFetch(
          cacheKey,
          () => anify.searchAnime(q, page, limit),
          1800,
        );
        break;
      case "gogoanime":
        result = await cacheFetch(
          cacheKey,
          () => gogoanime.searchAnime(q, page),
          1800,
        );
        break;
      case "jikan":
        result = await cacheFetch(
          cacheKey,
          () => jikan.searchAnime(q, page, limit),
          1800,
        );
        break;
      case "samehadaku":
        result = await cacheFetch(
          cacheKey,
          () => samehadaku.searchAnime(q, page),
          1800,
        );
        break;
      case "otakudesu":
        result = await cacheFetch(
          cacheKey,
          () => otakudesu.searchAnime(q, page),
          1800,
        );
        break;
      case "hianime":
        result = await cacheFetch(
          cacheKey,
          () => hianime.search(q, page),
          1800,
        );
        break;
      default:
        result = await cacheFetch(
          cacheKey,
          () => anify.searchAnime(q, page, limit),
          1800,
        );
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/trending", async (req, res, next) => {
  try {
    const { limit = 10, source = "anify" } = req.query;
    const cacheKey = `anime:trending:${source}:${limit}`;
    let result;

    switch (source) {
      case "anify":
        result = await cacheFetch(
          cacheKey,
          () => anify.getTrendingAnime(limit),
          1800,
        );
        break;
      case "hianime":
        result = await cacheFetch(
          cacheKey,
          () => hianime.getTopAiring(limit),
          1800,
        );
        break;
      default:
        result = await cacheFetch(
          cacheKey,
          () => anify.getTrendingAnime(limit),
          1800,
        );
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/popular", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `anime:popular:${page}:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => jikan.getPopularAnime(page, limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/recent", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `anime:recent:${page}:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => jikan.getRecentEpisodes(page, limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/top-airing", async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const cacheKey = `anime:top-airing:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => hianime.getTopAiring(limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/genres", async (req, res, next) => {
  try {
    const cacheKey = `anime:genres`;
    const result = await cacheFetch(cacheKey, () => hianime.getGenres(), 86400);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/genre/:genre", async (req, res, next) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `anime:genre:${genre}:${page}:${limit}`;
    const result = await cacheFetch(
      cacheKey,
      () => hianime.getByGenre(genre, page, limit),
      1800,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/schedule", async (req, res, next) => {
  try {
    const cacheKey = `anime:schedule`;
    const result = await cacheFetch(
      cacheKey,
      () => hianime.getSchedule(),
      3600,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { source = "anify" } = req.query;
    const cacheKey = `anime:${source}:${id}`;

    let result;
    try {
      switch (source) {
        case "anify":
          result = await cacheFetch(
            cacheKey,
            () => anify.getAnimeInfo(id),
            3600,
          );
          break;
        case "gogoanime":
          result = await cacheFetch(
            cacheKey,
            () => gogoanime.getAnimeById(id),
            3600,
          );
          break;
        case "samehadaku":
          result = await cacheFetch(
            cacheKey,
            () => samehadaku.getAnimeById(id),
            3600,
          );
          break;
        case "otakudesu":
          result = await cacheFetch(
            cacheKey,
            () => otakudesu.getAnimeById(id),
            3600,
          );
          break;
        case "hianime":
          result = await cacheFetch(
            cacheKey,
            () => hianime.getAnimeInfo(id),
            3600,
          );
          break;
        default:
          result = await cacheFetch(
            cacheKey,
            () => anify.getAnimeInfo(id),
            3600,
          );
      }
    } catch {
      result = await jikan.getAnimeById(id);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
