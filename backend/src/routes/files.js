const express = require('express');

const router = express.Router();

router.use((req, res) => {
  res.status(501).json({ error: 'File routes are not implemented yet' });
});

module.exports = router;
