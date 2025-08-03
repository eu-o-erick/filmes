const express = require("express");
const cors = require("cors");
const path = require("path");

const getAllRoute = require("./routes/getAll");
const infoRoute = require("./routes/info");
const subsRoute = require("./routes/subs");

const app = express();
const port = 3000;

app.use(cors());

const moviesDir = "/mnt/hdd_filmes/Filmes";

app.locals.moviesDir = moviesDir;

app.use("/api/get-all", getAllRoute);
app.use("/api/info", infoRoute);
app.use("/api/subs", subsRoute);

app.use("/movies", express.static(moviesDir));

app.listen(port, () => {
  console.log(`🎬 Servidor rodando em http://localhost:${port}`);
});
