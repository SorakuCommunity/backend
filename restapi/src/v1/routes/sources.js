import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'anify', name: 'Anify', language: 'en', status: 'online' },
      { id: 'gogoanime', name: 'Gogoanime', language: 'en', status: 'online' },
      { id: 'jikan', name: 'Jikan (MAL)', language: 'en', status: 'online' },
      { id: 'samehadaku', name: 'Samehadaku', language: 'id', status: 'online' },
      { id: 'otakudesu', name: 'Otakudesu', language: 'id', status: 'online' }
    ]
  });
});

router.get('/:source/status', (req, res) => {
  const { source } = req.params;
  const sources = ['anify', 'gogoanime', 'jikan', 'samehadaku', 'otakudesu'];
  
  if (!sources.includes(source)) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Source not found' }
    });
  }
  
  res.json({
    success: true,
    data: { source, status: 'online', latency: 0 }
  });
});

export default router;
