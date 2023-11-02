const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.send(`<center><H1> Welcome to Home Page Moulika Nagulavancha!...</H1></center>`);
});

module.exports = router;