class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); //this is going to call the error constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;