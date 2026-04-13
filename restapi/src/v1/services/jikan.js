import axios from 'axios';

const JIKAN_URL = process.env.JIKAN_URL || 'https://api.jikan.moe/v4';

const api = axios.create({
  baseURL: JIKAN_URL,
  timeout: 10000
});

api.interceptors.response.use(
  response => response,
  async error => {
    const retries = error.config.__retryCount || 0;
    if (retries < 3 && error.response?.status === 429) {
      error.config.__retryCount = retries + 1;
      await new Promise(r => setTimeout(r, 1000 * retries));
      return api.request(error.config);
    }
    throw error;
  }
);

export async function searchAnime(query, page = 1, limit = 20) {
  const { data } = await api.get('/anime', {
    params: { q: query, page, limit }
  });
  return {
    success: true,
    data: data.data.map(mapAnime),
    meta: { page, per_page: limit, total: data.pagination?.items?.total || 0 }
  };
}

export async function getAnimeById(id) {
  const { data } = await api.get(`/anime/${id}`);
  return { success: true, data: mapAnime(data.data) };
}

export async function getTrendingAnime(limit = 10) {
  const { data } = await api.get('/anime/top', {
    params: { filter: 'airing', limit }
  });
  return {
    success: true,
    data: data.data.map(mapAnime),
    meta: { page: 1, per_page: limit, total: limit }
  };
}

export async function getPopularAnime(page = 1, limit = 20) {
  const { data } = await api.get('/anime/top', {
    params: { filter: 'bypopularity', page, limit }
  });
  return {
    success: true,
    data: data.data.map(mapAnime),
    meta: { page, per_page: limit, total: data.pagination?.items?.total || 0 }
  };
}

export async function getRecentEpisodes(page = 1, limit = 20) {
  const { data } = await api.get('/watch/episodes', {
    params: { page, limit }
  });
  return {
    success: true,
    data: data.data?.map(ep => ({
      id: ep.entry?.mal_id,
      title: ep.entry?.title,
      image: ep.entry?.images?.jpg?.image_url,
      episode: ep.episodes?.[0]?.title,
      airedAt: ep.episodes?.[0]?.aired
    })) || [],
    meta: { page, per_page: limit, total: 0 }
  };
}

function mapAnime(anime) {
  return {
    id: anime.mal_id,
    title: anime.title_english || anime.title,
    title_japanese: anime.title_japanese,
    image: anime.images?.jpg?.image_url,
    type: anime.type,
    episodes: anime.episodes,
    status: anime.status,
    synopsis: anime.synopsis,
    score: anime.score,
    year: anime.year,
    rating: anime.rating,
    genres: anime.genres?.map(g => g.name),
    studios: anime.studios?.map(s => s.name)
  };
}

export default { searchAnime, getAnimeById, getTrendingAnime, getPopularAnime, getRecentEpisodes };
