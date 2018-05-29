const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const Errors = require('./models/Errors');
const api = require('./routes/api');
const expressJWT = require('express-jwt');
const dbc = require('./db/databaseConnector');
const app = express();

// Returns middleware that only parses urlencode bodies.
app.use(bodyParser.urlencoded({
    extended: true
}));

// Returns middleware that only parses json,
// and only looks at requests where the Content-Type header matches the type option.
app.use(bodyParser.json({
    type: "application/json"
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, Authorization");
    next();
});

// Require authentication for every request,
// unless the path is specified below.
app.use(expressJWT({
    secret: config.secretKey
}).unless({
    path: ['/api/login/psychologist', '/api/login/client', '/api/register/client', '/api/register/psychologist']
}), function (error, req, res, next) {
    if (error.name === "UnauthorizedError") {
        const error = Errors.unauthorized();
        res.status(error.code).json(error);
    }
});

// Route to /api
app.use("/api", api);

// process.env.PORT specifies the port that Heroku set for the api. Else config.port is used.
const port = process.env.PORT || config.port;
app.listen(port, () => {
    console.log(`Listening on port:${port}...`);
});

module.exports = app;