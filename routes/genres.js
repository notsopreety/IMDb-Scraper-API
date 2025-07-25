const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

const genresList = [
  "action",
  "adventure",
  "animation",
  "biography",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "family",
  "fantasy",
  "film-noir",
  "game-show",
  "history",
  "horror",
  "music",
  "musical",
  "mystery",
  "news",
  "reality-tv",
  "romance",
  "sci-fi",
  "short",
  "sport",
  "talk-show",
  "thriller",
  "war",
  "western",
];

router.get("/", (req, res) => {
  const originalGenres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film-Noir",
    "Game-Show",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "News",
    "Reality-TV",
    "Romance",
    "Sci-Fi",
    "Short",
    "Sport",
    "Talk-Show",
    "Thriller",
    "War",
    "Western",
  ];
  res.json({ genres: originalGenres });
});

router.get("/:genre", async (req, res) => {
  try {
    const genreParam = req.params.genre.toLowerCase();

    if (!genresList.includes(genreParam)) {
      return res.status(400).json({ error: "Invalid genre" });
    }

    const searchUrl = `https://www.imdb.com/search/title/?genres=${encodeURIComponent(
      genreParam
    )}`;

    const { data } = await axios.get(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);
    const results = [];

    $("li.ipc-metadata-list-summary-item").each((i, el) => {
      const $el = $(el);
      const fullTitle = $el.find("h3.ipc-title__text").text().trim();
      const title = fullTitle.replace(/^\d+\.\s*/, "").trim();

      const metadataItems = $el.find(".sc-29531a57-8.cxFOWT");

      const imdbRating = $el.find("span.ipc-rating-star--rating").text().trim();
      const voteCountRaw = $el
        .find("span.ipc-rating-star--voteCount")
        .text()
        .trim();
      const voteCount = voteCountRaw.replace(/[()]/g, "").trim();

      const imgElem = $el.find("img.ipc-image");
      let poster = null;
      let posters = [];

      if (imgElem.length) {
        const srcSet = imgElem.attr("srcSet");
        if (srcSet) {
          posters = srcSet.split(",").map((src) => {
            const [url, size] = src.trim().split(" ");
            return { url, size: size.replace("w", "") };
          });
          poster = posters[posters.length - 1].url;
        } else {
          poster = imgElem.attr("src") || null;
          if (poster) posters = [{ url: poster, size: null }];
        }
      }

      const href = $el.find("a.ipc-lockup-overlay").attr("href");
      const idMatch = href?.match(/title\/tt(\d+)\//);
      const id = idMatch ? idMatch[1] : null;

      const description = $el.find(".ipc-html-content-inner-div").text().trim();

      if (id && title) {
        results.push({
          id,
          title,
          imdbRating,
          voteCount,
          poster,
          description,
        });
      }
    });

    if (results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    res.json({
      searchResults: results,
    });
  } catch (error) {
    console.error("Scraping Error:", error.message);
    res.status(500).json({ error: "Failed to fetch data from IMDb" });
  }
});

module.exports = router;
