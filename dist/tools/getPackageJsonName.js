"use strict";
exports.__esModule = true;
exports.getPackageJsonName = void 0;
//Supported Note builtin are listed in known-ports.json ( denoify repo )
var fs = require("fs");
var path = require("path");
var util_1 = require("util");
function getPackageJsonName() {
    return JSON.parse(new util_1.TextDecoder("utf-8").decode(fs.readFileSync(path.join(__dirname, "..", "..", "package.json"))))["name"];
}
exports.getPackageJsonName = getPackageJsonName;
