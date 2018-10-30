'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createAuthFuncs = createAuthFuncs;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _ms = require('ms');

var _ms2 = _interopRequireDefault(_ms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createAuthFuncs(domain, authCookieName, jwtSecret, keyExpiresIn) {
    var grantAccess = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, insecureUser) {
            var password_hash, rest, user, token;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            // removing password hash
                            //todo - move "password_hash" to config, as it's DB field name
                            password_hash = insecureUser.password_hash, rest = _objectWithoutProperties(insecureUser, ['password_hash']);

                            // todo - check ip

                            user = _extends({}, rest, {
                                ip: '0.0.0.0' // current IP should be here


                                // todo - get domain from env (doesn't work now on prod)
                                // const host = req.get('host')
                                // const hostname = host.split(':')[0]

                            });
                            _context.next = 5;
                            return createToken(user);

                        case 5:
                            token = _context.sent;


                            res.cookie(authCookieName, token, {
                                path: '/',
                                domain: domain,
                                maxAge: (0, _ms2.default)(keyExpiresIn)
                            });
                            _context.next = 12;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](0);

                            console.error('grantAccess:', _context.t0);

                        case 12:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 9]]);
        }));

        return function grantAccess(_x2, _x3, _x4) {
            return _ref.apply(this, arguments);
        };
    }();

    /**
     * Checks named cookie against jwt secret key
     *
     * @param req
     * @returns {Promise<any>}
     */
    function checkUserAuth(req) {
        return new Promise(function (resolve) {
            if (!req.cookies[authCookieName]) {
                resolve(false);
            } else {
                _jsonwebtoken2.default.verify(req.cookies[authCookieName], jwtSecret, function (err, decoded) {
                    resolve(err ? false : decoded);
                });
            }
        });
    }

    /**
     * creates new token based on any payload
     *
     * @param payload
     * @param optionsOverride
     * @returns {Promise<any>}
     */
    function createToken(payload) {
        var optionsOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var options = _extends({
            expiresIn: keyExpiresIn
        }, optionsOverride);

        return new Promise(function (resolve, reject) {
            _jsonwebtoken2.default.sign({ payload: payload }, jwtSecret, options, function (err, token) {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    return {
        checkUserAuth: checkUserAuth,
        grantAccess: grantAccess
    };
}
//# sourceMappingURL=auth.js.map