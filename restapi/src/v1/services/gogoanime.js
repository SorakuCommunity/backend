import axios from 'axios';

const CONSUMET_URL = process.env.CONSUMET_URL || 'https://api.consumet.org';

const api = axios.create({
  baseURL: `${CONSUMET_URL}/anime/gogoanime`,
  timeout: 15000
});

export async function searchAnime(query, page = 1) {
  const { data } = await api.get('/search', {
    params: { query, page }
  });
  return {
    success: true,
    data: data.results?.map(mapAnime) || [],
    meta: { page, per_page: 20, total: data.totalPage * 20 }
  };
}

export async function getAnimeById(id) {
  const { data } = await api.get(`/info/${id}`);
  return { success: true, data: mapAnimeDetail(data) };
}

export async function getEpisodes(id) {
  const { data } = await api.get(`/info/${id}`);
  return {
    success: true,
    data: data.episodes?.map((ep, i) => ({
      id: `${id}-${i + 1}`,
      number: ep.number,
      title: ep.title,
      isFiller: ep.isFiller
    })) || []
  };
}

export async function getEpisodeSources(episodeId) {
  const { data } = await api.get('/watch', {
    params: { id: episodeId }
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
    title: anime.title,
    image: anime.image,
    type: anime.type,
    episodes: anime.totalEpisodes,
    status: anime.status,
    release: anime.releaseDate
  };
}

function mapAnimeDetail(anime) {
  return {
    id: anime.id,
    title: anime.title,
    image: anime.image,
    description: anime.synopsis,
    type: anime.type,
    episodes: anime.totalEpisodes,
    status: anime.status,
    release: anime.releaseDate,
    genres: anime.genres,
    studios: []
  };
}

export default { searchAnime, getAnimeById, getEpisodes, getEpisodeSources };
