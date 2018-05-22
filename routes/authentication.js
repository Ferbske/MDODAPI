const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
// const db = require('../db/databaseConnector');
const isEmail = require('isemail');
const Errors = require('../models/Errors');

router.post("/login", (req, res) => {

});

router.post("/register", (req, res) => {
    
});

module.exports = router;