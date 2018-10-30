'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createLogoutEP;

var _defaultOptions = require('../constants/defaultOptions');

function createLogoutEP(options) {

    var defaultOptions = {
        authCookieName: _defaultOptions.authCookieName,
        loginPagePath: _defaultOptions.loginPagePath
    };

    options = _extends({}, defaultOptions, options);

    //variable scoping
    {
        var _options = options,
            _authCookieName = _options.authCookieName,
            _loginPagePath = _options.loginPagePath;


        return function logout(req, res) {
            res.clearCookie(_authCookieName);
            res.redirect(302, _loginPagePath);
        };
    }
}
module.exports = exports.default;
//# sourceMappingURL=logout.js.map