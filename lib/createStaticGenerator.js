/**
 * Created by lerayne on 22.12.2017.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createStaticGenerator;

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _routerRedirections = require('./compose/routerRedirections');

var _auth = require('./compose/auth');

var _configureStore = require('./redux/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _defaultOptions = require('./constants/defaultOptions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createStaticGenerator(options) {

    /* object configuration */

    var defaultOptions = {
        authCookieName: _defaultOptions.authCookieName,
        loginPagePath: _defaultOptions.loginPagePath,
        rootPath: _defaultOptions.rootPath,
        keyExpiresIn: _defaultOptions.keyExpiresIn,
        setUserState: _defaultOptions.setUserState,
        isLoggedInFromState: _defaultOptions.isLoggedInFromState
    };

    var requiredOptions = ['getTemplate', 'getRootRoute', 'reducers', 'jwtSecret', 'domain'];

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
            getTemplate = _options.getTemplate,
            getRootRoute = _options.getRootRoute,
            reducers = _options.reducers,
            jwtSecret = _options.jwtSecret,
            _setUserState = _options.setUserState,
            _isLoggedInFromState = _options.isLoggedInFromState,
            _authCookieName = _options.authCookieName,
            _loginPagePath = _options.loginPagePath,
            _rootPath = _options.rootPath,
            _keyExpiresIn = _options.keyExpiresIn,
            domain = _options.domain;

        /**
         * return static page as a stream (allows gradual load as the page renders)
         * @param res - express resource
         * @param getState
         * @param reactNode
         */

        var streamHTML = function streamHTML(res, getState, reactNode) {
            var _getTemplate$split = getTemplate('{react-root}', getState()).split('{react-root}'),
                _getTemplate$split2 = _slicedToArray(_getTemplate$split, 2),
                headHTML = _getTemplate$split2[0],
                tailHTML = _getTemplate$split2[1];

            res.write(headHTML);

            var stream = (0, _server.renderToNodeStream)(reactNode);

            stream.pipe(res, { end: false });

            stream.on('end', function () {
                res.write(tailHTML);
                res.end();
            });
        };

        //get functions for handling redirections by react-router

        var _createRouterRedirect = (0, _routerRedirections.createRouterRedirectFuncs)(_isLoggedInFromState, _loginPagePath, _rootPath),
            getOnEnterFunc = _createRouterRedirect.getOnEnterFunc,
            getOnChangeFunc = _createRouterRedirect.getOnChangeFunc;

        var _createAuthFuncs = (0, _auth.createAuthFuncs)(domain, _authCookieName, jwtSecret, _keyExpiresIn),
            checkUserAuth = _createAuthFuncs.checkUserAuth,
            grantAccess = _createAuthFuncs.grantAccess;

        /**
         * Actual handler of express get routing
         *
         * @param req - express request
         * @param res - express response
         */


        return function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
                var _this = this;

                var store, _ref2, currentUser;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:

                                //create redux store
                                store = (0, _configureStore2.default)({}, reducers);

                                // get current user's authentication cookie status (false | jwt.verify object)
                                // Attention! Only the essential user info should be stored in a JWT cookie!

                                _context2.next = 3;
                                return checkUserAuth(req);

                            case 3:
                                _ref2 = _context2.sent;
                                currentUser = _ref2.payload;

                                if (!currentUser) {
                                    _context2.next = 9;
                                    break;
                                }

                                store.dispatch(_setUserState(currentUser));

                                // reauthorize user
                                // todo - only reauthorize near expiration (performance). Now reauthorizing each time
                                _context2.next = 9;
                                return grantAccess(req, res, currentUser);

                            case 9:

                                (0, _reactRouter.match)({
                                    location: req.url,
                                    routes: getRootRoute(getOnEnterFunc(store.getState), getOnChangeFunc(store.getState))
                                }, function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error, redirectLocation, renderProps) {
                                        var promises;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        if (!redirectLocation) {
                                                            _context.next = 2;
                                                            break;
                                                        }

                                                        return _context.abrupt('return', res.redirect(302, redirectLocation.pathname + redirectLocation.search));

                                                    case 2:
                                                        if (!error) {
                                                            _context.next = 4;
                                                            break;
                                                        }

                                                        return _context.abrupt('return', res.status(500).send(error.message));

                                                    case 4:
                                                        if (renderProps) {
                                                            _context.next = 6;
                                                            break;
                                                        }

                                                        return _context.abrupt('return', res.status(404).send('Not found'));

                                                    case 6:

                                                        // seeks for "initialize" static function that returns a promise
                                                        promises = [];


                                                        renderProps.routes.forEach(function (route) {
                                                            var component = route.component.WrappedComponent || route.component;
                                                            if (component.initialize) {
                                                                promises.push(component.initialize(store.dispatch, renderProps.location));
                                                            }
                                                        });

                                                        // todo - proper error handling with try-catch

                                                        if (!promises.length) {
                                                            _context.next = 11;
                                                            break;
                                                        }

                                                        _context.next = 11;
                                                        return Promise.all(promises);

                                                    case 11:

                                                        streamHTML(res, store.getState, _react2.default.createElement(
                                                            _reactRedux.Provider,
                                                            { store: store },
                                                            _react2.default.createElement(_reactRouter.RouterContext, renderProps)
                                                        ));

                                                    case 12:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function (_x3, _x4, _x5) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());

                            case 10:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function generateStaticPage(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return generateStaticPage;
        }();
    }
}
module.exports = exports.default;
//# sourceMappingURL=createStaticGenerator.js.map