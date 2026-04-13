import axios from 'axios';
import * as cheerio from 'cheerio';

const HIANIME_URL = process.env.HIANIME_URL || 'https://api.hianime.to/api';

const api = axios.create({
  baseURL: HIANIME_URL,
  timeout: 15000
});

export async function search(query, page = 1) {
  const { data } = await api.get('/search', {
    params: { keyword: query, page }
  });
  return {
    success: true,
    data: data.result?.map(mapAnime) || [],
    meta: { page, per_page: 20, total: data.result?.length || 0 }
  };
}

export async function getAnimeInfo(id) {
  const { data } = await api.get('/info', {
    params: { id }
  });
  return { success: true, data: mapAnimeDetail(data) };
}

export async function getWatch(episodeId, server = 'vidplay') {
  const { data } = await api.get('/watch', {
    params: { episodeId, server }
  });
  return {
    success: true,
    data: {
      episodeId,
      sources: data.sources?.map(s => ({
        url: s.url,
        type: s.type,
        quality: s.quality
      })),
      subtitles: data.subtitles
    }
  };
}

export async function getTopAiring(limit = 10) {
  const { data } = await api.get('/top-airing', {
    params: { limit }
  });
  return {
    success: true,
    data: data.result?.map(mapAnime) || [],
    meta: { page: 1, per_page: limit, total: limit }
  };
}

export async function getMostPopular(limit = 10) {
  const { data } = await api.get('/most-popular', {
    params: { limit }
  });
  return {
    success: true,
    data: data.result?.map(mapAnime) || [],
    meta: { page: 1, per_page: limit, total: limit }
  };
}

export async function getGenres() {
  const { data } = await api.get('/genres');
  return {
    success: true,
    data: data.genres || []
  };
}

export async function getByGenre(genre, page = 1, limit = 20) {
  const { data } = await api.get('/genre', {
    params: { genre, page, limit }
  });
  return {
    success: true,
    data: data.result?.map(mapAnime) || [],
    meta: { page, per_page: limit, total: data.result?.length || 0 }
  };
}

export async function getSchedule() {
  const { data } = await api.get('/schedule');
  return {
    success: true,
    data: data.schedule || []
  };
}

export async function getAdvancedSearch(params) {
  const { data } = await api.get('/advanced-search', { params });
  return {
    success: true,
    data: data.result?.map(mapAnime) || [],
    meta: { page: data.page, per_page: 20, total: data.total }
  };
}

function mapAnime(anime) {
  return {
    id: anime.id,
    title: anime.name || anime.title,
    image: anime.poster || anime.image,
    type: anime.type,
    episodes: anime.totalEpisodes,
    status: anime.status,
    year: anime.releaseDate
  };
}

function mapAnimeDetail(anime) {
  return {
    id: anime.id,
    title: anime.title,
    image: anime.poster,
    description: anime.synopsis,
    type: anime.type,
    episodes: anime.totalEpisodes,
    status: anime.status,
    year: anime.releaseDate,
    genres: anime.genres,
    studios: anime.studios,
    season: anime.season
  };
}

export default { search, getAnimeInfo, getWatch, getTopAiring, getMostPopular, getGenres, getByGenre, getSchedule, getAdvancedSearch };
