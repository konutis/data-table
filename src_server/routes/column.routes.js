const express = require('express');
const router = express.Router();
const column = require('../models/column.model');

/* All posts */
router.get('/', async (req, res) => {
    await column.getColumns()
        .then((posts) => {
            res.json(posts)
        })
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message});
            } else {
                res.status(500).json({message: err.message});
            }
        });
});

module.exports = router;