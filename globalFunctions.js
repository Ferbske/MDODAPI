function stripBearerToken(bearerToken) {
    return bearerToken.split(" ")[1];
}

module.exports = {
    stripBearerToken
};