const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const searchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(
      q
    )}&s=tt`;
    const { data } = await axios.get(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".ipc-metadata-list-summary-item").each((i, element) => {
      const title = $(element)
        .find(".ipc-metadata-list-summary-item__t")
        .text()
        .trim();
      const listItems = $(element).find(".ipc-metadata-list-summary-item__li");

      let year = "";
      let type = "Movie";

      listItems.each((i, el) => {
        const text = $(el).text().trim();
        if (/^\d{4}/.test(text) && !year) year = text;
        else if (
          /(TV Series|TV Movie|Video|Short|Movie|Documentary|Mini-Series|Podcast|Game)/i.test(
            text
          )
        ) {
          type = text;
        }
      });

      const href = $(element).find("a").attr("href");
      const idMatch = href?.match(/title\/tt(\d+)\//);
      const poster = $(element).find(".ipc-image").attr("src");

      if (title && idMatch && year && type !== "Unknown" && poster) {
        results.push({
          id: idMatch[1],
          title,
          year,
          type,
          poster,
        });
      }
    });

    if (results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    res.json({ searchResults: results });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch data from IMDb" });
  }
});

module.exports = router;
