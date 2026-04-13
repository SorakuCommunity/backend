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

app.get("/", async (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Api Soraku.live - Soraku.live</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      min-height: 100vh;
      color: #fff;
      overflow-x: hidden;
    }
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
      animation: rotate 20s linear infinite;
    }
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .container {
      max-width: 1200px;
      width: 100%;
      position: relative;
      z-index: 1;
    }
    .logo {
      text-align: center;
      margin-bottom: 3rem;
    }
    .logo h1 {
      font-size: 4rem;
      font-weight: 700;
      background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }
    .logo p {
      font-size: 1.25rem;
      color: #94a3b8;
    }
    .badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.5);
      border-radius: 50px;
      font-size: 0.875rem;
      color: #a5b4fc;
      margin-top: 1rem;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }
    .card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(99, 102, 241, 0.5);
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
    }
    .card-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .card p {
      font-size: 0.875rem;
      color: #94a3b8;
      line-height: 1.5;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-top: 3rem;
      flex-wrap: wrap;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #6366f1;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #94a3b8;
    }
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #64748b;
      font-size: 0.875rem;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
    }
    .endpoints {
      margin-top: 2rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .endpoints h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .endpoint-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      font-size: 0.875rem;
    }
    .method {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #6366f1;
    }
    .method.get { background: #22c55e; }
    .method.post { background: #3b82f6; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="container">
      <div class="logo">
        <h1>APIStreams</h1>
        <p>Welcome to Anime REST API! Your gateway to anime & manga streaming</p>
        <span class="badge">v1.0.0 • Powered by Consumet</span>
      </div>

      <div class="cards">
        <a href="/v1/anime/trending" class="card">
          <div class="card-icon">🔥</div>
          <h3>Anime</h3>
          <p>Search, trending, popular, and recent anime episodes from multiple sources</p>
        </a>
        <a href="/v1/manga/trending" class="card">
          <div class="card-icon">📚</div>
          <h3>Manga</h3>
          <p>Search manga, read chapters, and explore trending titles</p>
        </a>
        <a href="/v1/anilist/trending" class="card">
          <div class="card-icon">📋</div>
          <h3>AniList</h3>
          <p>Integrate with AniList for tracking, profiles, and detailed metadata</p>
        </a>
        <a href="/v1/schedule/today" class="card">
          <div class="card-icon">📅</div>
          <h3>Schedule</h3>
          <p>Check today's airing anime and weekly schedules</p>
        </a>
        <a href="/v1/anime/search?q=naruto" class="card">
          <div class="card-icon">🔍</div>
          <h3>Search</h3>
          <p>Search anime and manga across multiple sources</p>
        </a>
        <a href="/v1/admin/stats" class="card">
          <div class="card-icon">⚙️</div>
          <h3>Admin</h3>
          <p>Server stats, cache management, and monitoring</p>
        </a>
      </div>

      <div class="endpoints">
        <h2>Quick Endpoints</h2>
        <div class="endpoint-list">
          <div class="endpoint-item">
            <span class="method get">GET</span>
            <span>/v1/anime/trending</span>
          </div>
          <div class="endpoint-item">
            <span class="method get">GET</span>
            <span>/v1/anime/search?q=naruto</span>
          </div>
          <div class="endpoint-item">
            <span class="method get">GET</span>
            <span>/v1/manga/trending</span>
          </div>
          <div class="endpoint-item">
            <span class="method get">GET</span>
            <span>/v1/schedule/today</span>
          </div>
          <div class="endpoint-item">
            <span class="method get">GET</span>
            <span>/v1/anilist/trending</span>
          </div>
          <div class="endpoint-item">
            <span class="method get">GET</span>
            <span>/v1/anime/popular</span>
          </div>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-value">6+</div>
          <div class="stat-label">Sources</div>
        </div>
        <div class="stat">
          <div class="stat-value">10K+</div>
          <div class="stat-label">Anime</div>
        </div>
        <div class="stat">
          <div class="stat-value">5K+</div>
          <div class="stat-label">Manga</div>
        </div>
      </div>

      <div class="footer">
        <p>Built with ❤️ by <a href="https://github.com/SorakuCommunity">SorakuCommunity</a></p>
        <p>Documentation: <a href="https://github.com/SorakuCommunity/backend">GitHub</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  res.setHeader("Content-Type", "text/html");
  res.send(html);
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
