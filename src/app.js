const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/* Middlewares */

function verifyId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  return next();
}

app.get('/repositories', (request, response) => response.json(repositories));

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const likes = 0;

  const repository = {
    id: uuid(), title, url, techs, likes,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', verifyId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'repository not found' });
  }

  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', verifyId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'ID Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', verifyId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ Message: 'Repository not found' });
  }

  const repositorie = repositories[repositoryIndex];

  repositorie.likes++;

  repositories[repositoryIndex] = repositorie;

  return response.json(repositorie);
});

module.exports = app;
