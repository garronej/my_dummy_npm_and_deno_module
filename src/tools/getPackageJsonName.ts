

//Supported Note builtin are listed in known-ports.json ( denoify repo )
import * as fs from "fs";
import * as path from "path";
import { TextDecoder } from "util";

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
