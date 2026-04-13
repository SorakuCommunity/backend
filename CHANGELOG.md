# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-04-14

### Added

- REST API for anime/manga streaming with Consumet support
- Multi-source anime providers: Anify, Gogoanime, HiAnime, Samehadaku, Otakudesu
- Manga search and chapter endpoints
- AniList GraphQL integration for metadata, search, trending, schedules
- Redis caching for improved performance
- Airing schedule endpoints
- Admin dashboard with server stats and cache control
- Security: Helmet, CORS, rate limiting
- Docker and PM2 deployment configurations
- Vercel deployment support
- GitHub Actions CI/CD workflows

### Tech Stack

- Node.js 20+
- Express.js 4.21
- Redis (ioredis) - optional
- Helmet 7.1
- express-rate-limit 7.4

### API Endpoints

- `/v1/anime` - Anime search, trending, popular, recent
- `/v1/manga` - Manga search, trending, chapters
- `/v1/anilist` - AniList search, trending, popular, schedule
- `/v1/schedule` - Airing schedules
- `/v1/episodes` - Episode list and sources
- `/v1/admin` - Server stats, cache management
