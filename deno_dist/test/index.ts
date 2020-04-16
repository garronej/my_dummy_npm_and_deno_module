import "../lib/index.ts";

//fs is part of the standard node library, it will not work on deno but denoify wont throw.
import * as fs from "fs DENOIFY: DEPENDENCY UNMET (STANDARD)"; fs;


//colors is in dev dependency so denoify will not throw throws when it came across it.
import "colors DENOIFY: DEPENDENCY UNMET (DEV DEPENDENCY)"

import "./test1.ts";

