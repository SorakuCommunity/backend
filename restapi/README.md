# REST API Anime

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.21-blue)
![License](https://img.shields.io/badge/License-GPL--3.0-orange)

REST API untuk streaming anime dan manga dengan multi-source support, terintegrasi dengan Consumet API dan AniList.

## Fitur

- **Multi-Source Streaming**: Anify, Gogoanime, HiAnime, Samehadaku, Otakudesu
- **Metadata & Search**: Consumet API, Jikan (MAL), AniList GraphQL
- **Schedules**: Airing schedules dari AniList
- **Redis Caching**: Performa tinggi dengan caching
- **Security**: Rate limiting, Helmet, CORS
- **Deployment**: Docker, PM2, Vercel, Render, Railway

## Requirements

- Node.js 20+
- Redis (optional, untuk caching)

## Instalasi

```bash
git clone https://github.com/SorakuCommunity/backend.git
cd backend
npm install
```

## Konfigurasi

Copy `.env.example` ke `.env` dan sesuaikan:

```env
NODE_ENV=production
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
ANIFY_URL=https://api.anify.eltik.cc
```

## Penggunaan

```bash
# Development
npm run dev

# Production
npm start

# PM2
pm2 start ecosystem.config.js

# Docker
docker-compose up -d
```

## API Endpoints

### Anime

- `GET /v1/anime/search?q=<query>&source=<source>` - Search anime
- `GET /v1/anime/trending` - Trending anime
- `GET /v1/anime/popular` - Popular anime
- `GET /v1/anime/recent` - Recent episodes
- `GET /v1/anime/:id` - Anime details
- `GET /v1/anime/top-airing` - Top airing anime
- `GET /v1/anime/genres` - Genre list

### Manga

- `GET /v1/manga/search?q=<query>` - Search manga
- `GET /v1/manga/trending` - Trending manga
- `GET /v1/manga/:id` - Manga details
- `GET /v1/manga/:id/chapters` - Chapter list
- `GET /v1/manga/chapter/:chapterId` - Chapter pages

### AniList

- `GET /v1/anilist/search?q=<query>` - Search AniList
- `GET /v1/anilist/trending` - Trending on AniList
- `GET /v1/anilist/popular` - Popular on AniList
- `GET /v1/anilist/:id` - Anime details
- `GET /v1/anilist/schedule` - Airing schedule
- `GET /v1/anilist/genres` - Genre list

### Schedule

- `GET /v1/schedule` - All schedules
- `GET /v1/schedule/today` - Today's schedule
- `GET /v1/schedule/:day` - Schedule by day (sunday-saturday)

### Episodes

- `GET /v1/episodes/:animeId` - Episode list
- `GET /v1/episode/:animeId/:episodeNumber` - Episode sources

### Admin

- `GET /v1/admin/stats` - Server stats
- `GET /v1/admin/cache/clear` - Clear cache
- `GET /v1/admin/cache/stats` - Cache stats

## Deployment

### Docker

```bash
docker-compose up -d
```

### PM2

```bash
pm2 install pm2-logrotation
pm2 start ecosystem.config.js
pm2 save
```

### Vercel

```bash
vercel deploy
```

### Render

Import dari GitHub dengan `npm start`

## Environment Variables

| Variable       | Default            | Description             |
| -------------- | ------------------ | ----------------------- |
| PORT           | 3000               | Server port             |
| NODE_ENV       | production         | Environment             |
| REDIS_HOST     | localhost          | Redis host              |
| REDIS_PORT     | 6379               | Redis port              |
| REDIS_TTL      | 3600               | Cache TTL (seconds)     |
| ANIFY_URL      | api.anify.eltik.cc | Anify API URL           |
| CORS_ORIGIN    | \*                 | Allowed origins         |
| RATE_LIMIT_MAX | 100                | Max requests per window |

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.21
- **Caching**: Redis (ioredis)
- **Security**: Helmet, express-rate-limit
- **Deployment**: Docker, PM2

## License

GPL-3.0 - lihat [LICENSE](LICENSE)

## Credit

- [Consumet](https://consumet.org)
- [AniList](https://anilist.co)
- [SorakuCommunity](https://github.com/SorakuCommunity)
