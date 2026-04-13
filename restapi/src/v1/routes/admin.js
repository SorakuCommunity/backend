import express from "express";
import { getCacheStats, clearCache } from "../utils/cache.js";

let requestCount = 0;
let errorCount = 0;
let startTime = Date.now();

const router = express.Router();

router.use((req, res, next) => {
  requestCount++;
  const originalSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 400) errorCount++;
    return originalSend.call(this, data);
  };
  next();
});

router.get("/stats", async (req, res) => {
  try {
    const cacheStats = await getCacheStats();
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const rps = (requestCount / uptime).toFixed(2);

    res.json({
      success: true,
      data: {
        server: {
          uptime,
          uptime_formatted: formatUptime(uptime),
          requests: {
            total: requestCount,
            errors: errorCount,
            error_rate: ((errorCount / requestCount) * 100).toFixed(2) + "%",
          },
          requests_per_second: rps,
          memory: process.memoryUsage(),
          node_version: process.version,
          platform: process.platform,
        },
        cache: cacheStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/cache/clear", async (req, res) => {
  try {
    const { pattern = "*" } = req.query;
    const deleted = await clearCache(pattern);
    res.json({
      success: true,
      data: { deleted_keys: deleted, pattern },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/cache/stats", async (req, res) => {
  try {
    const stats = await getCacheStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/sources", (req, res) => {
  res.json({
    success: true,
    data: {
      anime: [
        { id: "anify", name: "Anify", language: "en", status: "online" },
        {
          id: "gogoanime",
          name: "Gogoanime",
          language: "en",
          status: "online",
        },
        { id: "jikan", name: "Jikan (MAL)", language: "en", status: "online" },
        {
          id: "samehadaku",
          name: "Samehadaku",
          language: "id",
          status: "online",
        },
        {
          id: "otakudesu",
          name: "Otakudesu",
          language: "id",
          status: "online",
        },
        { id: "hianime", name: "HiAnime", language: "en", status: "online" },
      ],
      manga: [{ id: "anify", name: "Anify", language: "en", status: "online" }],
      tracking: [
        { id: "anilist", name: "AniList", language: "en", status: "online" },
      ],
    },
  });
});

router.get("/routes", (req, res) => {
  res.json({
    success: true,
    data: [
      { method: "GET", path: "/v1/anime/search", description: "Search anime" },
      {
        method: "GET",
        path: "/v1/anime/trending",
        description: "Get trending anime",
      },
      {
        method: "GET",
        path: "/v1/anime/popular",
        description: "Get popular anime",
      },
      {
        method: "GET",
        path: "/v1/anime/recent",
        description: "Get recent episodes",
      },
      {
        method: "GET",
        path: "/v1/anime/:id",
        description: "Get anime details",
      },
      { method: "GET", path: "/v1/manga/search", description: "Search manga" },
      {
        method: "GET",
        path: "/v1/manga/trending",
        description: "Get trending manga",
      },
      {
        method: "GET",
        path: "/v1/manga/:id",
        description: "Get manga details",
      },
      {
        method: "GET",
        path: "/v1/manga/:id/chapters",
        description: "Get manga chapters",
      },
      {
        method: "GET",
        path: "/v1/anilist/search",
        description: "Search AniList",
      },
      {
        method: "GET",
        path: "/v1/anilist/trending",
        description: "Get trending on AniList",
      },
      {
        method: "GET",
        path: "/v1/anilist/popular",
        description: "Get popular on AniList",
      },
      {
        method: "GET",
        path: "/v1/anilist/:id",
        description: "Get AniList anime details",
      },
      {
        method: "GET",
        path: "/v1/schedule",
        description: "Get airing schedule",
      },
      {
        method: "GET",
        path: "/v1/schedule/today",
        description: "Get today's schedule",
      },
      {
        method: "GET",
        path: "/v1/schedule/:day",
        description: "Get schedule for specific day",
      },
      {
        method: "GET",
        path: "/v1/episodes/:animeId",
        description: "Get anime episodes",
      },
      {
        method: "GET",
        path: "/v1/episode/:animeId/:episodeNumber",
        description: "Get episode sources",
      },
      {
        method: "GET",
        path: "/v1/admin/stats",
        description: "Get server stats",
      },
      {
        method: "GET",
        path: "/v1/admin/cache/clear",
        description: "Clear cache",
      },
      {
        method: "GET",
        path: "/v1/admin/cache/stats",
        description: "Get cache stats",
      },
    ],
  });
});

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
}

export default router;
