const __dirname = (() => {
    const { url: urlStr } = import.meta;
    const url = new URL(urlStr);
    const __filename = (url.protocol === "file:" ? url.pathname : urlStr)
        .replace(/[/][^/]*$/, '');

    const isWindows = (() => {

        let NATIVE_OS: typeof Deno.build.os = "linux";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const navigator = (globalThis as any).navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.("Win") ?? false) {
            NATIVE_OS = "windows";
        }

        return NATIVE_OS == "windows";

    })();

    return isWindows ?
        __filename.split("/").join("\\").substring(1) :
        __filename;
})();



//Supported Note builtin are listed in known-ports.json ( denoify repo )
import * as fs from "https://deno.land/std@0.152.0/node/fs.ts";
import * as path from "https://deno.land/std@0.152.0/node/path.ts";
import { TextDecoder } from "https://deno.land/std@0.152.0/node/util.ts";

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
