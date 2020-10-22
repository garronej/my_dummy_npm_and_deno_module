
import React from "https://dev.jspm.io/react@16.14.0";;
// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/df2a75e38bf52fa0bf4bd29cd790478e3011fc0f/react-dom/v16.13.1/server.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.14.0/server.js";;

export const dummyRender = (props: { foo: string; }) => 
  ReactDOMServer.renderToString(<h1>{props.foo}</h1>);
