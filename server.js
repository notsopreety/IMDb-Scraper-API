const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.set('json spaces', 2);

app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const searchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(q)}&s=tt`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    $('.ipc-metadata-list-summary-item').each((i, element) => {
      const title = $(element).find('.ipc-metadata-list-summary-item__t').text().trim();
      const year = $(element).find('.ipc-metadata-list-summary-item__li').first().text().trim();
      const href = $(element).find('a').attr('href');
      const idMatch = href?.match(/title\/tt(\d+)\//);
      const poster = $(element).find('.ipc-image').attr('src');
      const typeText = $(element).find('.ipc-metadata-list-summary-item__li').last().text().trim();

      if (title && idMatch) {
        results.push({
          id: idMatch[1],
          title,
          year,
          type: typeText || null,
          poster
        });
      }
    });

    if (results.length === 0) {
      return res.status(404).json({ error: 'No results found' });
    }

    const details = await getMovieDetails(results[0].id);

    res.json({
      searchResults: results,
      details
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from IMDb' });
  }
});

app.get('/getmoviedetails', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Query parameter "id" is required' });
    }

    const details = await getMovieDetails(id);
    res.json(details);

  } catch (error) {
    console.error('Details Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

async function getMovieDetails(id) {
  const url = `https://www.imdb.com/title/tt${id}/`;
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const $ = cheerio.load(data);

  return {
    title: $('h1').text().trim(),
    rating: $('[data-testid="hero-rating-bar__aggregate-rating__score"] span').first().text().trim(),
    description: $('[data-testid="plot"] span').first().text().trim(),
    duration: $('[data-testid="title-techspec_runtime"]').text().trim(),
    genre: $('[data-testid="genres"]').text().trim().split('\n').map(g => g.trim()).filter(Boolean),
    releaseDate: $('[data-testid="title-details-releasedate"] a').text().trim(),
    director: $('[data-testid="title-pc-principal-credit"]:contains("Director") a').text().trim(),
    cast: $('[data-testid="title-cast-item"]').map((i, el) => ({
      name: $(el).find('a[data-testid="title-cast-item__actor"]').text().trim(),
      character: $(el).find('a[data-testid="cast-item-characters-link"] span').text().trim()
    })).get(),
    poster: $('[data-testid="hero-media__poster"] img').attr('src')
  };
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
