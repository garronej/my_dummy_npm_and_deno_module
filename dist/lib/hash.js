"use strict";
exports.__esModule = true;
exports.sha3_512 = exports.sha256 = void 0;
var crypto = require("crypto");
//@ts-ignore
var sha3_1 = require("sha3");
function sha256(input) {
    return crypto
        .createHash("sha256")
        .update(input)
        .digest("hex");
}
exports.sha256 = sha256;
function sha3_512(input) {
    return new sha3_1.SHA3(512)
        .update(input)
        .digest('hex');
}
exports.sha3_512 = sha3_512;
