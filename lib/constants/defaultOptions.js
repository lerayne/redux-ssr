"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var defaultOptions = {
    //auth
    authCookieName: "access_token",
    loginPagePath: "/login",
    rootPath: "/",
    keyExpiresIn: "30 days",

    //auth action creator to put user in state
    setUserState: function setUserState(userCookieObject) {
        return {
            type: 'SET_USER',
            payload: userCookieObject
        };
    },

    //auth getting status from state
    isLoggedInFromState: function isLoggedInFromState(state) {
        return state.user.id !== -1;
    }
};

exports.default = defaultOptions;


module.exports = defaultOptions;
//# sourceMappingURL=defaultOptions.js.map