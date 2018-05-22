const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const db = require('../db/'); //TODO Complete route.
const isEmail = require('isemail');
const Errors = require('../models/Errors');

module.exports = router;