const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

const moviesDir = "/mnt/disco-rigido/Videos/Filmes";

// Rota para listar todos os filmes (nomes das pastas)
app.get("/api/movies", (req, res) => {
  try {
    const folders = fs
      .readdirSync(moviesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    res.json(folders);
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Erro ao carregar filmes" });
  }
});

// Rota para pegar o info.json de um filme específico
app.get("/api/info", (req, res) => {
  const movieName = req.query.name;
  if (!movieName)
    return res.status(400).json({ error: "Nome do filme não especificado" });

  const moviePath = path.join(moviesDir, movieName);
  const infoPath = path.join(moviePath, "info.json");

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

// Rota para listar todas as legendas (.srt) do filme
app.get("/api/subs", (req, res) => {
  const movieName = req.query.name;
  if (!movieName)
    return res.status(400).json({ error: "Nome do filme não especificado" });

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

// Rota estática para servir os arquivos do filme (vídeo, legenda, etc.)
app.use("/movies", express.static(moviesDir));

app.listen(port, () => {
  console.log(`🎬 Servidor rodando em http://localhost:${port}`);
});
