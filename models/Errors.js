const Error = require('./Error');

class Errors {
    static unauthorized() {
        return new Error("Not authorized", 401);
    }

    static noValidToken() {
        return new Error("Token is invalid", 498);
    }

    static conflict() {
        return new Error("Conflict", 409);
    }

    static badRequest() {
        return new Error("Bad Request", 400);
    }

    static forbidden() {
        return new Error("Forbidden", 403);
    }

    static resquesTimeout() {
        return new Error("Request Timeout", 408);
    }

    static internalServerError() {
        return new Error("Internal Server Error", 500);
    }

    static notFound() {
        return new Error("Not Found", 404);
    }
}