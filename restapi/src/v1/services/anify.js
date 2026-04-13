import axios from 'axios';

const ANIFY_URL = process.env.ANIFY_URL || 'https://api.anify.eltik.cc';

const api = axios.create({
  baseURL: ANIFY_URL,
  timeout: 15000
});

export async function searchAnime(query, page = 1, limit = 20) {
  const { data } = await api.get('/anime/search', {
    params: { query, page, count: limit }
  });
  return {
    success: true,
    data: data.results?.map(mapAnime) || [],
    meta: { page, per_page: limit, total: data.total || 0 }
  };
}

export async function getAnimeById(id) {
  const { data } = await api.get(`/anime/${id}`);
  return { success: true, data: mapAnimeDetail(data) };
}

export async function getAnimeInfo(id) {
  const { data } = await api.get(`/anime/${id}/info`);
  return { success: true, data: mapAnimeDetail(data) };
}

export async function getTrendingAnime(limit = 10) {
  const { data } = await api.get('/trending anime', {
    params: { limit }
  });
  return {
    success: true,
    data: data.results?.map(mapAnime) || [],
    meta: { page: 1, per_page: limit, total: limit }
  };
}

export async function getEpisodes(id, dub = false) {
  const { data } = await api.get(`/anime/${id}/episodes`, {
    params: { dub }
  });
  return {
    success: true,
    data: data.episodes?.map(ep => ({
      id: ep.id,
      number: ep.number,
      title: ep.title,
      image: ep.image,
      isFiller: ep.isFiller,
      updatedAt: ep.updatedAt
    })) || []
  };
}

export async function getEpisodeSources(episodeId, server = 'vidplay') {
  const { data } = await api.get(`/anime/episode/sources`, {
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

function mapAnime(anime) {
  return {
    id: anime.id,
    title: anime.title.english || anime.title.romaji || anime.title.native,
    image: anime.image,
    description: anime.description,
    type: anime.type,
    episodes: anime.totalEpisodes,
    status: anime.status,
    year: anime.releaseDate
  };
}

function mapAnimeDetail(anime) {
  return {
    id: anime.id,
    title: anime.title?.english || anime.title?.romaji || anime.title?.native,
    image: anime.image,
    description: anime.description,
    type: anime.type,
    episodes: anime.totalEpisodes,
    status: anime.status,
    year: anime.releaseDate,
    genres: anime.genres,
    studios: anime.studios,
    season: anime.season
  };
}

export default { searchAnime, getAnimeById, getAnimeInfo, getTrendingAnime, getEpisodes, getEpisodeSources };
