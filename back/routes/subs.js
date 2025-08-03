const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const moviesDir = req.app.locals.moviesDir;
  const movieName = req.query.name;

  if (!movieName) {
    return res.status(400).json({ error: "Nome do filme não especificado" });
  }

  const moviePath = path.join(moviesDir, movieName);

  if (!fs.existsSync(moviePath)) {
    return res.status(404).json({ error: "Filme não encontrado" });
  }

  try {
    const files = fs.readdirSync(moviePath);
    const subtitles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".srt"
    );
    res.json(subtitles);
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Erro ao carregar legendas" });
  }
});

module.exports = router;
