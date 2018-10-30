'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = promiseMiddleware;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Created by lerayne on 17.01.17.
 */

/**
 * Redux middleware that performs Promise functionality.
 * @param getState
 * @param dispatch
 * @returns function
 */
function promiseMiddleware(_ref) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;

    return function (next) {
        return function (action) {

            // Expects action to have "promise" field.
            // If none - throws it to next middleware with correct return policy.
            if (!action.promise) {
                return next(action);
            } else {
                // Pass the action itself to the next MW transparently (allows to do smthng on request)
                next(action);

                var type = action.type,
                    promise = action.promise,
                    payload = action.payload,
                    rest = _objectWithoutProperties(action, ['type', 'promise', 'payload']);

                // copy all initial info to a new action


                var newAction = _extends({}, rest, {
                    initialType: type
                });

                if (payload !== undefined) {
                    newAction.initialPayload = payload;
                }

                // Returns a promise in which this "then" is done and the next "then" will receive the
                // result of this
                return promise.then(function (result) {
                    // "next" is fatser, but "dispatch" is more correct, for example there can be
                    // loogger middleware
                    dispatch(_extends({}, newAction, {
                        type: type + '_SUCCESS',
                        payload: result
                    }));

                    // this is passed into next "then"
                    return true;
                }, function (error) {
                    console.error(error);

                    dispatch(_extends({}, newAction, {
                        type: type + '_FAILURE',
                        payload: error
                    }));

                    // this is passed into next "then"
                    return false;
                });
            }
        };
    };
}
module.exports = exports.default;
//# sourceMappingURL=promiseMiddleware.js.map