const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const moviesDir = req.app.locals.moviesDir;

  try {
    const genreMap = {};

    const folders = fs
      .readdirSync(moviesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders.forEach((folder) => {
      const infoPath = path.join(moviesDir, folder, "info.json");

      if (!fs.existsSync(infoPath)) return;

      try {
        const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
        if (!info.genres || !Array.isArray(info.genres)) return;

        info.genres.forEach((genre) => {
          const name = genre.name;
          if (!name) return;

          if (!genreMap[name]) {
            genreMap[name] = [];
          }

          genreMap[name].push(folder);
        });
      } catch (err) {
        console.warn(`Erro ao ler info.json de "${folder}":`, err.message);
      }
    });

    res.json(genreMap);
  } catch (err) {
    console.error("Erro ao listar filmes por gênero:", err);
    res.status(500).json({ error: "Erro ao listar filmes por gênero" });
  }
});

module.exports = router;
