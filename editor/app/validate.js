var esprima = require('esprima');

module.exports = function (code) {
    var error = {};

    try {
        esprima.parse(code);
    }
    catch (e) {
        error.reason = e.description;
        error.line = e.lineNumber;
        error.character = e.column;

        return [error];
    }

    return true;
};
