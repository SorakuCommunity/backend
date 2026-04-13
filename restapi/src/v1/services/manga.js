import express from "express";
import axios from "axios";

const ANIFY_URL = process.env.ANIFY_URL || "https://api.anify.eltik.cc";

const api = axios.create({
  baseURL: ANIFY_URL,
  timeout: 15000,
});

export async function searchManga(query, page = 1, limit = 20) {
  const { data } = await api.get("/manga/search", {
    params: { query, page, count: limit },
  });
  return {
    success: true,
    data: data.results?.map(mapManga) || [],
    meta: { page, per_page: limit, total: data.total || 0 },
  };
}

export async function getMangaInfo(id) {
  const { data } = await api.get(`/manga/${id}/info`);
  return { success: true, data: mapMangaDetail(data) };
}

export async function getChapters(id) {
  const { data } = await api.get(`/manga/${id}/chapters`);
  return {
    success: true,
    data:
      data.chapters?.map((ch) => ({
        id: ch.id,
        chapter: ch.chapter,
        title: ch.title,
        pages: ch.pages,
        releasedAt: ch.releasedAt,
      })) || [],
  };
}

export async function getChapterPages(chapterId) {
  const { data } = await api.get(`/manga/chapter/${chapterId}`);
  return {
    success: true,
    data: {
      chapterId,
      pages: data.pages || [],
      prevChapter: data.prevChapter,
      nextChapter: data.nextChapter,
    },
  };
}

export async function getTrendingManga(limit = 10) {
  const { data } = await api.get("/trending manga", {
    params: { limit },
  });
  return {
    success: true,
    data: data.results?.map(mapManga) || [],
    meta: { page: 1, per_page: limit, total: limit },
  };
}

function mapManga(manga) {
  return {
    id: manga.id,
    title: manga.title.english || manga.title.romaji || manga.title.native,
    image: manga.image,
    description: manga.description,
    type: manga.type,
    chapters: manga.totalChapters,
    status: manga.status,
    year: manga.releaseDate,
  };
}

function mapMangaDetail(manga) {
  return {
    id: manga.id,
    title: manga.title?.english || manga.title?.romaji || manga.title?.native,
    image: manga.image,
    description: manga.description,
    type: manga.type,
    chapters: manga.totalChapters,
    status: manga.status,
    year: manga.releaseDate,
    genres: manga.genres,
    authors: manga.authors,
    artist: manga.artist,
  };
}

export default {
  searchManga,
  getMangaInfo,
  getChapters,
  getChapterPages,
  getTrendingManga,
};
