import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./v1/middleware/error.js";
import { securityMiddleware } from "./v1/middleware/security.js";
import { initRedis } from "./v1/utils/cache.js";

import animeRoutes from "./v1/routes/anime.js";
import episodeRoutes from "./v1/routes/episode.js";
import sourcesRoutes from "./v1/routes/sources.js";
import mangaRoutes from "./v1/routes/manga.js";
import anilistRoutes from "./v1/routes/anilist.js";
import scheduleRoutes from "./v1/routes/schedule.js";
import adminRoutes from "./v1/routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

initRedis();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(securityMiddleware);

app.get("/", (req, res) => {
  res.json({
    name: "REST API Anime",
    version: "1.0.0",
    description: "REST API for anime/manga streaming with Consumet support",
    repository: "https://github.com/SorakuCommunity/backend",
    endpoints: {
      anime: "/v1/anime",
      manga: "/v1/manga",
      anilist: "/v1/anilist",
      schedule: "/v1/schedule",
      episodes: "/v1/episodes",
      sources: "/v1/sources",
      admin: "/v1/admin",
    },
    documentation: "https://docs.consumet.org",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/v1/anime", animeRoutes);
app.use("/v1/manga", mangaRoutes);
app.use("/v1/anilist", anilistRoutes);
app.use("/v1/schedule", scheduleRoutes);
app.use("/v1/episodes", episodeRoutes);
app.use("/v1/episode", episodeRoutes);
app.use("/v1/sources", sourcesRoutes);
app.use("/v1/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
