
import * as React from "react";
import * as ReactDOMServer  from "react-dom/server";

export const dummyRender = (props: { foo: string; }) => 
  ReactDOMServer.renderToString(<h1>{props.foo}</h1>);
