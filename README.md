# REST API Anime

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.21-blue)
![License](https://img.shields.io/badge/License-GPL--3.0-orange)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

REST API untuk streaming anime dan manga dengan multi-source support, terintegrasi dengan Consumet API dan AniList.

**Live API**: https://apistream.vercel.app

## Fitur

- **Multi-Source Streaming**: Anify, Gogoanime, HiAnime, Samehadaku, Otakudesu
- **Metadata & Search**: Consumet API, Jikan (MAL), AniList GraphQL
- **Schedules**: Airing schedules dari AniList
- **Redis Caching**: Performa tinggi dengan caching (opsional)
- **Security**: Rate limiting, Helmet, CORS
- **Deployment**: Vercel, Docker, PM2

## Requirements

- Node.js 20+

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
ANIFY_URL=https://api.anify.eltik.cc
```

## Penggunaan

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Anime

- `GET /v1/anime/search?q=<query>&source=<source>` - Search anime
- `GET /v1/anime/trending` - Trending anime
- `GET /v1/anime/popular` - Popular anime
- `GET /v1/anime/recent` - Recent episodes
- `GET /v1/anime/:id` - Anime details
- `GET /v1/anime/top-airing` - Top airing anime

### Manga

- `GET /v1/manga/search?q=<query>` - Search manga
- `GET /v1/manga/trending` - Trending manga
- `GET /v1/manga/:id` - Manga details

### AniList

- `GET /v1/anilist/search?q=<query>` - Search AniList
- `GET /v1/anilist/trending` - Trending on AniList
- `GET /v1/anilist/schedule` - Airing schedule

### Schedule

- `GET /v1/schedule` - All schedules
- `GET /v1/schedule/today` - Today's schedule
- `GET /v1/schedule/:day` - Schedule by day

### Episodes

- `GET /v1/episodes/:animeId` - Episode list
- `GET /v1/episode/:animeId/:episodeNumber` - Episode sources

### Admin

- `GET /v1/admin/stats` - Server stats

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel deploy
```

Atau import直接从 GitHub ke Vercel.

### Docker

```bash
docker-compose up -d
```

### PM2

```bash
pm2 start ecosystem.config.js
pm2 save
```

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.21
- **Caching**: Redis (ioredis) - opsional
- **Security**: Helmet, express-rate-limit
- **Deployment**: Vercel, Docker, PM2

## License

GPL-3.0 - lihat [LICENSE](LICENSE)

## Credit

- [Consumet](https://consumet.org)
- [AniList](https://anilist.co)
- [SorakuCommunity](https://github.com/SorakuCommunity)
