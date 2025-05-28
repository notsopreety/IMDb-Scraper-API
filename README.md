# 🎬 IMDb Scraper API

A lightweight Node.js API that scrapes IMDb to fetch movie, series, or TV show details using Express, Axios, and Cheerio. This API allows you to search for titles and retrieve detailed metadata such as rating, plot, genres, cast, and more.

🌐 **Live Demo**: [movieSearch](https://www.imdb.bhandarimilan.info.np/search?q=the+notebook), [getMovieDetails](https://www.imdb.bhandarimilan.info.np/getmoviedetails?id=0332280)


---

## 📌 Features

- 🔍 Search any movie or series by title
- 🎞 Get movie details by IMDb ID
- 🎭 Includes cast, director, genres, rating, plot summary, etc.
- 🚫 Filters out incomplete data automatically

---

## 📁 Endpoints

### 1. `/search?q=title`

**Description:** Search for a movie, series, or title.

**Query Parameter:**
- `q`: The title to search for.

**Example:**

GET /search?q=The Notebook

**Response:**
```json
{
  "searchResults": [
    {
      "id": "0332280",
      "title": "The Notebook",
      "year": "2004",
      "type": "Movie",
      "poster": "https://..."
    },
    ...
  ]
}
```

### 2. `/getmoviedetails?id=0332280`

**Description:**: Get full details about a movie using its IMDb ID.

**Query Parameter:**
- `id`: : IMDb ID


**Example:**

GET /getmoviedetails?id=0332280

**Response:**
```json
{
  "title": "The Notebook",
  "rating": "7.8",
  "description": "A poor yet passionate young man...",
  "duration": "2h 3m",
  "genre": ["Drama", "Romance"],
  "releaseDate": "25 June 2004",
  "director": "Nick Cassavetes",
  "cast": [
    { "name": "Ryan Gosling", "character": "Noah" },
    ...
  ],
  "poster": "https://..."
}
```

🚀 How to Run Locally

```bash
git clone https://github.com/milancodess/imdb-scraper-api.git
cd imdb-scraper-api
npm install
node server.js
```

The server will start on ```http://localhost:3000```.


---

## 🛠 Built With
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)![Cheerio](https://img.shields.io/badge/Cheerio-ff6600?style=for-the-badge&logo=cheerio&logoColor=white)![IMDb](https://img.shields.io/badge/IMDb-F5DE50?style=for-the-badge&logo=imdb&logoColor=black)
