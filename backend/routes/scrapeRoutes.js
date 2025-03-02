const express = require('express');
const router = express.Router();
const { scrapeWebsite } = require('../controllers/scrapeController'); 

router.post('/scrap', scrapeWebsite); // Define the POST route

module.exports = router;
