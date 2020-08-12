const __dirname = (()=>{
    const {url: urlStr}= import.meta;
    const url= new URL(urlStr);
    const __filename = url.protocol === "file:" ? url.pathname : urlStr;
    return __filename.replace(/[/][^/]*$/, '');
})();



//Supported Note builtin are listed in known-ports.json ( denoify repo )
import * as fs from "https://deno.land/std@0.64.0/node/fs.ts";
import * as path from "https://deno.land/std@0.64.0/node/path.ts";
import { TextDecoder } from "https://deno.land/std@0.64.0/node/util.ts";

export function getPackageJsonName(): string {

    return JSON.parse(
        new TextDecoder("utf-8").decode(
            fs.readFileSync(
                path.join(
                    __dirname,
                    "..", "..", "package.json"
                )
            ) as Uint8Array
        )
    )["name"];

}
