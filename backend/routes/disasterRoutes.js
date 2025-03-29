const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/latest', async (req, res) => {
  try {
    const response = await axios.get('https://api.reliefweb.int/v1/reports?appname=disasterapp&limit=5');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching disaster data' });
  }
});

module.exports = router;
