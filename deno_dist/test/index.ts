import "../lib/index.ts";

//url is a node builtin that do not have a port for deno yet, 
//it will not work on deno but denoify wont throw.
//checkout here how it is transformed:  ../../deno_dist/test/index.ts
import * as fs from "https://deno.land/std@0.151.0/node/url.ts"; fs;

//colors is in dev dependency so denoify will not throw throws when it came across it.
import "colors DENOIFY: DEPENDENCY UNMET (DEV DEPENDENCY)"

import "./test1.ts";

