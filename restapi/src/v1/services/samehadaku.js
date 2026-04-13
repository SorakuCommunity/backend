import axios from 'axios';
import * as cheerio from 'cheerio';

const SAMA_BASE_URL = process.env.SAMA_BASE_URL || 'https://samehadaku.email';

const api = axios.create({
  baseURL: SAMA_BASE_URL,
  timeout: 15000
});

export async function searchAnime(query, page = 1) {
  const { data } = await api.get('/search.html', {
    params: { search_string: query, page }
  });
  const $ = cheerio.load(data);
  const results = [];
  
  $('.anime-list .anime-item').each((_, el) => {
    results.push({
      id: $(el).find('a').attr('href')?.split('/').pop()?.replace('.html', ''),
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
  const { data } = await api.get(`/anime/${id}.html`);
  const $ = cheerio.load(data);
  
  return {
    success: true,
    data: {
      id,
      title: $('.entry-title').text().trim(),
      image: $('.thumb img').attr('src'),
      description: $('.desc').text().trim(),
      type: $('.info span').filter((_, el) => $(el).text().includes('Type')).next().text().trim(),
      episodes: parseInt($('.info span').filter((_, el) => $(el).text().includes('Total Episode')).next().text()) || 0,
      status: $('.info span').filter((_, el) => $(el).text().includes('Status')).next().text().trim(),
      genres: $('.genrei .set').map((_, el) => $(el).text().trim()).get(),
      studios: []
    }
  };
}

export async function getEpisodes(id) {
  const { data } = await api.get(`/anime/${id}.html`);
  const $ = cheerio.load(data);
  const episodes = [];
  
  $('#episode_list li a').each((_, el) => {
    const href = $(el).attr('href');
    const match = href?.match(/episode-(\d+)/);
    episodes.push({
      id: href?.split('/').pop()?.replace('.html', ''),
      number: match ? parseInt(match[1]) : episodes.length + 1,
      title: $(el).text().trim()
    });
  });
  
  return { success: true, data: episodes };
}

export async function getEpisodeSources(episodeId) {
  try {
    const { data } = await api.get(`/download/${episodeId}.html`);
    const $ = cheerio.load(data);
    
    const sources = [];
    $('.download-links a').each((_, el) => {
      sources.push({
        url: $(el).attr('href'),
        quality: $(el).text().match(/(\d+p)/)?.[1] || 'unknown',
        type: 'mp4'
      });
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
