import axios from "axios";

const ANILIST_API = "https://graphql.anilist.co";

const api = axios.create({
  baseURL: ANILIST_API,
  timeout: 15000,
});

const animeFields = `
  id
  title { romaji english native userPreferred }
  coverImage { large medium color }
  description
  type
  format
  status
  episodes
  duration
  startDate { year month day }
  endDate { year month day }
  season
  seasonYear
  averageScore
  popularity
  genres
  studios { nodes { name } }
  source
  isAdult
  nextAiringEpisode { airingAt timeUntilAiring episode }
`;

const mediaFields = `
  id
  idMal
  title { romaji english native userPreferred }
  coverImage { large medium color }
  description
  type
  format
  status
  episodes
  volumes
  chapters
  duration
  startDate { year month day }
  endDate { year month day }
  season
  seasonYear
  averageScore
  popularity
  genres
  tags { name }
  studios { nodes { name } }
  source
  isAdult
  siteUrl
  isFavourite
  mediaListEntry { status score progress volumesRead chaptersRead }
`;

async function queryanilist(query, variables = {}) {
  const { data } = await api.post("", { query, variables });
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data;
}

export async function search(query, page = 1, perPage = 20) {
  const q = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage hasNextPage }
        media(search: $search, type: ANIME) {
          ${animeFields}
        }
      }
    }
  `;
  const result = await queryanilist(q, { search: query, page, perPage });
  return {
    success: true,
    data: result.Page.media.map(mapAnime),
    meta: {
      page: result.Page.pageInfo.currentPage,
      per_page: perPage,
      total: result.Page.pageInfo.total,
      hasNextPage: result.Page.pageInfo.hasNextPage,
    },
  };
}

export async function advancedSearch(options = {}) {
  const {
    query,
    type = "ANIME",
    page = 1,
    perPage = 20,
    format,
    sort,
    genres,
    id,
    year,
    status,
    season,
    countryOfOrigin,
  } = options;

  const q = `
    query ($search: String, $type: MediaType, $page: Int, $perPage: Int, $format: MediaFormat, $sort: [MediaSort], $genres: [String], $id: Int, $year: Int, $status: MediaStatus, $season: MediaSeason, $countryOfOrigin: CountryCode) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage hasNextPage }
        media(search: $search, type: $type, format: $format, sort: $sort, genre_in: $genres, id: $id, startDate_year: $year, status: $status, season: $season, countryOfOrigin: $countryOfOrigin) {
          ${animeFields}
        }
      }
    }
  `;

  const result = await queryanilist(q, {
    search: query,
    type,
    page,
    perPage,
    format,
    sort,
    genres,
    id,
    year,
    status,
    season,
    countryOfOrigin,
  });
  return {
    success: true,
    data: result.Page.media.map(mapAnime),
    meta: {
      page: result.Page.pageInfo.currentPage,
      per_page: perPage,
      total: result.Page.pageInfo.total,
      hasNextPage: result.Page.pageInfo.hasNextPage,
    },
  };
}

export async function getTrendingAnime(page = 1, perPage = 20) {
  const q = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage hasNextPage }
        trending: media(sort: TRENDING_DESC, type: ANIME) {
          ${animeFields}
        }
      }
    }
  `;
  const result = await queryanilist(q, { page, perPage });
  return {
    success: true,
    data: result.Page.trending.map(mapAnime),
    meta: {
      page: result.Page.pageInfo.currentPage,
      per_page: perPage,
      total: result.Page.pageInfo.total,
      hasNextPage: result.Page.pageInfo.hasNextPage,
    },
  };
}

export async function getPopularAnime(page = 1, perPage = 20) {
  const q = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage hasNextPage }
        popular: media(sort: POPULARITY_DESC, type: ANIME) {
          ${animeFields}
        }
      }
    }
  `;
  const result = await queryanilist(q, { page, perPage });
  return {
    success: true,
    data: result.Page.popular.map(mapAnime),
    meta: {
      page: result.Page.pageInfo.currentPage,
      per_page: perPage,
      total: result.Page.pageInfo.total,
      hasNextPage: result.Page.pageInfo.hasNextPage,
    },
  };
}

export async function getAnimeInfo(id) {
  const q = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${animeFields}
        trailer { id site }
        characters(role: MAIN) { nodes { id name { full preferred } image { large medium } } }
        relations { edges { relationType node { id title { romaji english } type format } } }
      }
    }
  `;
  const result = await queryanilist(q, { id: parseInt(id) });
  return { success: true, data: mapAnimeDetail(result.Media) };
}

export async function getAiringSchedule(
  page = 1,
  perPage = 20,
  weekStart,
  weekEnd,
  notYetAired = true,
) {
  const now = Math.floor(Date.now() / 1000);
  const start = weekStart || now;
  const end = weekEnd || now + 604800;

  const q = `
    query ($page: Int, $perPage: Int, $start: Int, $end: Int, $notYetAired: Boolean) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage hasNextPage }
        airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, notYetAired: $notYetAired) {
          id
          episode
          airingAt
          media { id title { romaji english } coverImage { medium } format status }
        }
      }
    }
  `;
  const result = await queryanilist(q, {
    page,
    perPage,
    start,
    end,
    notYetAired,
  });
  return {
    success: true,
    data: result.Page.airingSchedules.map((s) => ({
      id: s.id,
      episode: s.episode,
      airingAt: s.airingAt,
      anime: {
        id: s.media.id,
        title: s.media.title.romaji || s.media.title.english,
        image: s.media.coverImage.medium,
        format: s.media.format,
        status: s.media.status,
      },
    })),
    meta: {
      page: result.Page.pageInfo.currentPage,
      per_page: perPage,
      total: result.Page.pageInfo.total,
      hasNextPage: result.Page.pageInfo.hasNextPage,
    },
  };
}

export async function getGenres() {
  const q = `
    query {
      GenreCollection
    }
  `;
  const result = await queryanilist(q);
  return { success: true, data: result.GenreCollection.filter((g) => g) };
}

export async function getSeasonAnime(year, season) {
  const q = `
    query ($year: Int, $season: MediaSeason, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage hasNextPage }
        media(season: $season, seasonYear: $year, sort: POPULARITY_DESC, type: ANIME) {
          ${animeFields}
        }
      }
    }
  `;
  const result = await queryanilist(q, {
    year: parseInt(year),
    season: season.toUpperCase(),
    page: 1,
    perPage: 20,
  });
  return {
    success: true,
    data: result.Page.media.map(mapAnime),
    meta: { page: 1, per_page: 20, total: result.Page.pageInfo.total },
  };
}

function mapAnime(media) {
  return {
    id: media.id,
    title: media.title.english || media.title.romaji || media.title.native,
    image: media.coverImage.large || media.coverImage.medium,
    color: media.coverImage.color,
    description: media.description,
    type: media.type,
    format: media.format,
    status: media.status,
    episodes: media.episodes,
    duration: media.duration,
    startDate: media.startDate,
    endDate: media.endDate,
    season: media.season,
    seasonYear: media.seasonYear,
    score: media.averageScore,
    popularity: media.popularity,
    genres: media.genres,
    studios: media.studios?.nodes?.map((s) => s.name) || [],
  };
}

function mapAnimeDetail(media) {
  return {
    id: media.id,
    title: media.title.english || media.title.romaji || media.title.native,
    title_romaji: media.title.romaji,
    title_english: media.title.english,
    title_native: media.title.native,
    image: media.coverImage.large || media.coverImage.medium,
    color: media.coverImage.color,
    description: media.description?.replace(/<[^>]*>/g, ""),
    type: media.type,
    format: media.format,
    status: media.status,
    episodes: media.episodes,
    duration: media.duration,
    startDate: media.startDate,
    endDate: media.endDate,
    season: media.season,
    seasonYear: media.seasonYear,
    score: media.averageScore,
    popularity: media.popularity,
    genres: media.genres,
    studios: media.studios?.nodes?.map((s) => s.name) || [],
    source: media.source,
    isAdult: media.isAdult,
    trailer: media.trailer,
    characters:
      media.characters?.nodes?.slice(0, 10).map((c) => ({
        id: c.id,
        name: c.name.full || c.name.preferred,
        image: c.image.large || c.image.medium,
      })) || [],
    relations:
      media.relations?.edges?.map((r) => ({
        relationType: r.relationType,
        id: r.node.id,
        title: r.node.title.romaji || r.node.title.english,
        type: r.node.type,
        format: r.node.format,
      })) || [],
  };
}

export default {
  search,
  advancedSearch,
  getTrendingAnime,
  getPopularAnime,
  getAnimeInfo,
  getAiringSchedule,
  getGenres,
  getSeasonAnime,
};
