import axios from "axios";

const OTK_BASE_URL =
  process.env.OTK_BASE_URL || "https://otakudesu.animeupdates.me";

const api = axios.create({
  baseURL: `${OTK_BASE_URL}/anime`,
  timeout: 15000,
});

export async function searchAnime(query, page = 1) {
  const { data } = await api.get("/search", {
    params: { query, page },
  });
  return {
    success: true,
    data: data.results?.map(mapAnime) || [],
    meta: { page, per_page: 20, total: data.totalPage * 20 },
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
    data:
      data.episodes?.map((ep) => ({
        id: ep.id,
        number: ep.number,
        title: ep.title,
        image: ep.image,
      })) || [],
  };
}

export async function getEpisodeSources(id) {
  const { data } = await api.get(`/watch/${id}`);
  return {
    success: true,
    data: {
      sources: data.sources?.map((s) => ({
        url: s.url,
        type: s.type,
        quality: s.quality,
      })),
      subtitles: data.subtitles,
    },
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
    year: anime.releaseDate,
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
    year: anime.releaseDate,
    genres: anime.genres,
    studios: anime.studios,
    season: anime.season,
  };
}

export default {
  searchAnime,
  getAnimeById,
  getEpisodes,
  getEpisodeSources,
};
