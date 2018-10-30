'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _promiseMiddleware = require('./promiseMiddleware');

var _promiseMiddleware2 = _interopRequireDefault(_promiseMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var reducers = arguments[1];


    // apply middlewares
    var middlewares = (0, _redux.applyMiddleware)(_reduxThunk2.default, _promiseMiddleware2.default);

    // apply devtools
    if (process.env.NODE_ENV === 'development' && process.env.BROWSER) {

        var DevTools = require('../client/DevTools/index').default;

        middlewares = (0, _redux.compose)(middlewares, DevTools.instrument());
    }

    // creates store from root reducer, initial state and middlewares
    return (0, _redux.createStore)((0, _redux.combineReducers)(reducers), initialState, middlewares);
} /**
   * Created by lerayne on 09.05.17.
   */

module.exports = exports.default;

//# sourceMappingURL=configureStore.js.map