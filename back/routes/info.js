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

  const infoPath = path.join(moviesDir, movieName, "info.json");

  if (!fs.existsSync(infoPath)) {
    return res.status(404).json({ error: "info.json não encontrado" });
  }

  try {
    const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
    res.json(info);
  } catch (err) {
    console.error(`Erro ao ler info.json de ${movieName}`, err);
    res.status(500).json({ error: "Erro ao ler info.json" });
  }
});

module.exports = router;
