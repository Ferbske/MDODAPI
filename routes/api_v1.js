const express = require('express');
const router = express.Router({});
const config = require('../config');

router.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to api v1"
    });
});

module.exports = router;