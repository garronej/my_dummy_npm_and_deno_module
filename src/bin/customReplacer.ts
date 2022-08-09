// @denoify-ignore

import { makeThisModuleAnExecutableReplacer } from "denoify";
import { assert } from "tsafe";
import * as path from "path";

makeThisModuleAnExecutableReplacer(async ({
    parsedImportExportStatement,
    destDirPath
}) => {

    switch (parsedImportExportStatement.parsedArgument.nodeModuleName) {
        case "left-pad": {

            /*
             *We expect not to run against statements like
             *import(..).then(...)
             *or 
             *export * from "..."
             *in our code.
             */
            assert(
                !parsedImportExportStatement.isAsyncImport &&
                parsedImportExportStatement.statementType === "import"
            );

            const match = parsedImportExportStatement.target?.match(/^\*\s+as\s+(.*)$/);

            //We expect:import * as xxxx from "..."
            assert(!!match);

            return `import { leftPad as ${match[1]
                } } from "${path.relative(
                    destDirPath,
                    path.join(__dirname, "..", "..", "deno_dist", "tools", "leftPad.ts")
                )
                    .split(path.sep).join(path.posix.sep) //For windows compat (we dont want backslashes)
                }"`;

        } break;
    }

    //The replacer should return undefined when we want to let denoify replace the statement 
    return undefined;


});