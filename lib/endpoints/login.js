'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Created by lerayne on 22.03.17.
                                                                                                                                                                                                                                                                   */

exports.default = createLoginEP;

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _auth = require('../compose/auth');

var _defaultOptions = require('../constants/defaultOptions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

console.log('authCookieName', _defaultOptions.authCookieName);

function createLoginEP(options) {

    var defaultOptions = {
        authCookieName: _defaultOptions.authCookieName,
        loginPagePath: _defaultOptions.loginPagePath,
        rootPath: _defaultOptions.rootPath,
        keyExpiresIn: _defaultOptions.keyExpiresIn
    };

    var requiredOptions = ['jwtSecret', 'domain', 'getUser'];

    var missingProp = requiredOptions.find(function (propName) {
        return options[propName] === undefined;
    });

    if (missingProp) {
        throw new Error('ERROR in createStaticGenerator: ' + missingProp + ' not specified');
    }

    options = _extends({}, defaultOptions, options);

    //variable scoping
    {
        var _options = options,
            domain = _options.domain,
            _authCookieName = _options.authCookieName,
            jwtSecret = _options.jwtSecret,
            _keyExpiresIn = _options.keyExpiresIn,
            _loginPagePath = _options.loginPagePath,
            _rootPath = _options.rootPath,
            getUser = _options.getUser;

        var _createAuthFuncs = (0, _auth.createAuthFuncs)(domain, _authCookieName, jwtSecret, _keyExpiresIn),
            checkUserAuth = _createAuthFuncs.checkUserAuth,
            grantAccess = _createAuthFuncs.grantAccess;

        var redirectToFailure = function redirectToFailure(req, res) {
            res.redirect(302, _url2.default.format({
                pathname: _loginPagePath, query: {
                    next: req.body.nextUrl,
                    error: 1
                }
            }));
        };

        return function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
                var _ref2, currentUser, user, passwordCorrect;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return checkUserAuth(req);

                            case 2:
                                _ref2 = _context.sent;
                                currentUser = _ref2.payload;

                                if (!currentUser) {
                                    _context.next = 8;
                                    break;
                                }

                                // Already logged in: redirect back
                                res.redirect(302, req.body.nextUrl || '/');
                                _context.next = 26;
                                break;

                            case 8:
                                _context.next = 10;
                                return getUser(req.body.email);

                            case 10:
                                user = _context.sent;

                                if (user) {
                                    _context.next = 15;
                                    break;
                                }

                                // No such user
                                redirectToFailure(req, res);
                                _context.next = 26;
                                break;

                            case 15:
                                _context.next = 17;
                                return _bcryptjs2.default.compare(req.body.password, user.password_hash);

                            case 17:
                                passwordCorrect = _context.sent;


                                console.log('passwordCorrect', passwordCorrect);

                                if (passwordCorrect) {
                                    _context.next = 23;
                                    break;
                                }

                                // Wrong password
                                redirectToFailure(req, res);
                                _context.next = 26;
                                break;

                            case 23:
                                _context.next = 25;
                                return grantAccess(req, res, user);

                            case 25:
                                res.redirect(302, req.body.nextUrl || _rootPath);

                            case 26:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function login(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return login;
        }();
    }
}
module.exports = exports.default;
//# sourceMappingURL=login.js.map