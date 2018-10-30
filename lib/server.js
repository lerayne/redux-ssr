/**
 * Created by lerayne on 22.12.2017.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogoutEP = exports.createLoginEP = exports.createStaticGenerator = undefined;

var _createStaticGenerator2 = require('./createStaticGenerator');

var _createStaticGenerator3 = _interopRequireDefault(_createStaticGenerator2);

var _login = require('./endpoints/login');

var _login2 = _interopRequireDefault(_login);

var _logout = require('./endpoints/logout');

var _logout2 = _interopRequireDefault(_logout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createStaticGenerator = _createStaticGenerator3.default;
exports.createLoginEP = _login2.default;
exports.createLogoutEP = _logout2.default;
//# sourceMappingURL=server.js.map