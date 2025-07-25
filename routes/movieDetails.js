const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(400)
        .json({ error: 'Query parameter "id" is required' });
    }

    const details = await getMovieDetails(id);
    res.json(details);
  } catch (error) {
    console.error("Details Error:", error.message);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

async function getMovieDetails(id) {
  const url = `https://www.imdb.com/title/tt${id}/`;
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(data);

  return {
    title: $("h1").text().trim(),
    rating: $('[data-testid="hero-rating-bar__aggregate-rating__score"] span')
      .first()
      .text()
      .trim(),
    totalRatings: $('[class*="sc-d541859f-3"]').first().text().trim(),
    description: $('[data-testid="plot-xs_to_m"]')
      .text()
      .trim()
      .replace("Read all", "")
      .trim(),
    duration: $('[data-testid="title-techspec_runtime"]')
      .text()
      .trim()
      .replace("Runtime", "")
      .trim(),
    genre: $(".ipc-chip--on-baseAlt .ipc-chip__text")
      .map((i, el) => $(el).text().trim())
      .get(),
    releaseDate: $('[data-testid="title-details-releasedate"] a').text().trim(),
    director: $(
      '[data-testid="title-pc-principal-credit"]:contains("Director") a'
    )
      .text()
      .trim(),
    cast: $('[data-testid="title-cast-item"]')
      .map((i, el) => ({
        name: $(el)
          .find('a[data-testid="title-cast-item__actor"]')
          .text()
          .trim(),
        character: $(el)
          .find('a[data-testid="cast-item-characters-link"] span')
          .text()
          .trim(),
      }))
      .get(),
    poster: $('[data-testid="hero-media__poster"] img').attr("src"),
  };
}

module.exports = router;
