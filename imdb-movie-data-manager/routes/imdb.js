const express = require('express');
const router = express.Router();
const graphDBConnect = require('../middleware/graphDBConnect');

function formatResponse(resultObj) {
  const result = [];
  if (resultObj.records.length > 0) {
    resultObj.records.map(record => {
      result.push(record._fields[0].properties);
    });
  }
  return result;
}

// Insert the new movie information
router.post('/', async function(req, res) {
  const title = req.body.title;
  const description = req.body.description;
  const year = req.body.year;
  const runtime = req.body.runtime;
  const rating = req.body.rating;
  const votes = req.body.votes;
  const revenue = req.body.revenue;

  const genres = req.body.genres;

  const query = `CREATE (movie:Movie {
    title: $title,
    description: $description,
    year: $year,
    runtime: $runtime,
    rating: $rating,
    votes: $votes,
    revenue: $revenue
  })
  WITH movie
  UNWIND $genres AS genre
  MERGE (g:Genres { type: genre })
  MERGE (movie)-[:IN]->(g)
  RETURN movie`;

  const params = {title: title, description: description, year: year, runtime: runtime, rating: rating, votes: votes, revenue: revenue, genres: genres};

  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

// Retrieve all MOVIES in the Database
router.get('/', async function(req, res) {
  const query = 'MATCH (movie:Movie) RETURN movie LIMIT 300';
  const params = {};
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

// Display the movie’s details includes actors, directors and genres using title.
router.get('/:title', async function(req, res) {
  const { title } = req.params;
  const query = `MATCH (movie:Movie {title: $title})
  OPTIONAL MATCH (movie)<-[:ACTED_IN]-(actor:Person)
  OPTIONAL MATCH (movie)<-[:DIRECTED]-(director:Person)
  OPTIONAL MATCH (movie)-[:IN]->(genre:Genres)
  RETURN movie, COLLECT(DISTINCT actor) AS actors, COLLECT(DISTINCT director) AS directors, COLLECT(DISTINCT genre) AS genres;`;

  const params = { title: title };
  const result = await graphDBConnect.executeCypherQuery(query, params);

  const data = result.records.map(record => ({
    movie: record.get("movie").properties,
    actors: record.get("actors").map(actor => actor.properties),
    directors: record.get("directors").map(director => director.properties),
    genres: record.get("genres").map(genre => genre.properties),
  }));

  res.json(data);
});

// Update the movie information using title. (By update only title, description, and rating)
router.patch('/:title', async function(req, res) {
  const title = req.params.title; // Title of the movie to update

  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedRating = req.body.rating;
  const query = `MATCH (movie:Movie {title: $title})
  SET movie.title = $updatedTitle,
      movie.description = $updatedDescription,
      movie.rating = $updatedRating
  RETURN movie`;
  const params = { title: title, updatedTitle: updatedTitle, updatedDescription: updatedDescription, updatedRating: updatedRating };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

// Delete the movie information using title
router.delete('/:title', async function(req, res) {
  const { title } = req.params;
  const query = 'MATCH (movie:Movie {title: $title}) DETACH DELETE movie';
  const params = { title: title };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);

  res.send('Delete success');
});

module.exports = router;