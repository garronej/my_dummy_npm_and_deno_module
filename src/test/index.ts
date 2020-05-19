import "../lib";

//url is a node builtin that do not have a port for deno yet, 
//it will not work on deno but denoify wont throw.
//checkout here how it is transformed:  ../../deno_dist/test/index.ts
import * as fs from "url"; fs;

//colors is in dev dependency so denoify will not throw throws when it came across it.
import "colors"

import "./test1";

