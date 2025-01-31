const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    likes: 0,
    title,
    url,
    techs,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRespositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if (findRespositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  };

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRespositoryIndex].likes,
  };

  repositories[findRespositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRespositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if (findRespositoryIndex >= 0) {
    repositories.splice(findRespositoryIndex, 1);
  } else {
    return response.status(400).json({ error: 'Repository does not exists!' });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRespositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if (findRespositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  };

  repositories[findRespositoryIndex].likes++;

  return response.json(repositories[findRespositoryIndex]);
});

module.exports = app;
