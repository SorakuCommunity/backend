import axios from 'axios';
import * as cheerio from 'cheerio';

const OTK_BASE_URL = process.env.OTK_BASE_URL || 'https://otakudesu.animeupdates.me';

const api = axios.create({
  baseURL: OTK_BASE_URL,
  timeout: 15000
});

export async function searchAnime(query, page = 1) {
  const { data } = await api.get('/search', {
    params: { q: query, page }
  });
  const $ = cheerio.load(data);
  const results = [];
  
  $('.anime-list .anime-item').each((_, el) => {
    results.push({
      id: $(el).find('a').attr('href')?.split('/').pop(),
      title: $(el).find('.title').text().trim(),
      image: $(el).find('img').attr('src'),
      type: $(el).find('.type').text().trim(),
      status: $(el).find('.status').text().trim()
    });
  });
  
  return {
    success: true,
    data: results,
    meta: { page, per_page: 20, total: results.length }
  };
}

export async function getAnimeById(id) {
  const { data } = await api.get(`/anime/${id}`);
  const $ = cheerio.load(data);
  
  return {
    success: true,
    data: {
      id,
      title: $('.entry-title').text().trim(),
      image: $('.thumb img').attr('src'),
      description: $('.desc').text().trim(),
      type: $('.info-item').filter((_, el) => $(el).text().includes('Type')).find('.info').text().trim(),
      episodes: parseInt($('.info-item').filter((_, el) => $(el).text().includes('Episode')).find('.info').text()) || 0,
      status: $('.info-item').filter((_, el) => $(el).text().includes('Status')).find('.info').text().trim(),
      genres: $('.genre .tag').map((_, el) => $(el).text().trim()).get(),
      studios: []
    }
  };
}

export async function getEpisodes(id) {
  const { data } = await api.get(`/anime/${id}`);
  const $ = cheerio.load(data);
  const episodes = [];
  
  $('.episode-list a').each((_, el) => {
    episodes.push({
      id: $(el).attr('href')?.split('/').pop(),
      number: episodes.length + 1,
      title: $(el).text().trim()
    });
  });
  
  return { success: true, data: episodes };
}

export async function getEpisodeSources(episodeId) {
  try {
    const { data } = await api.get(`/episode/${episodeId}`);
    const $ = cheerio.load(data);
    
    const sources = [];
    $('.download-option option').each((_, el) => {
      const val = $(el).attr('value');
      if (val) {
        sources.push({
          url: val,
          quality: $(el).text().match(/(\d+p)/)?.[1] || 'unknown',
          type: 'mp4'
        });
      }
    });
    
    return {
      success: true,
      data: { episodeId, sources, subtitles: [] }
    };
  } catch {
    return { success: false, error: { code: 'SOURCE_OFFLINE', message: 'Episode not found' } };
  }
}

export default { searchAnime, getAnimeById, getEpisodes, getEpisodeSources };
