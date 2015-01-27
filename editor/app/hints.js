var JSHINT = require('jshint').JSHINT;
var jshintrc = require('./jshintrc.js');

module.exports = function (code) {
    var result = JSHINT(code, jshintrc);

    if (result) {
        return true;
    }

    return JSHINT.errors;
};
