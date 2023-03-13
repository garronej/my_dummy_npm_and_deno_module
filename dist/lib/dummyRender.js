"use strict";
exports.__esModule = true;
exports.dummyRender = void 0;
var React = require("react");
var ReactDOMServer = require("react-dom/server");
var dummyRender = function (props) {
    return ReactDOMServer.renderToString(React.createElement("h1", null, props.foo));
};
exports.dummyRender = dummyRender;
