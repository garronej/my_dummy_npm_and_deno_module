
import * as interfaces from "./interfaces/index.ts";
import * as runExclusive from "https://raw.github.com/garronej/run_exclusive/2.1.18/mod.ts";
import { buildMethod } from "https://raw.github.com/garronej/run_exclusive/2.1.18/lib/runExclusive.ts";
import { load } from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";
import { Md5 } from "https://raw.github.com/garronej/ts-md5/1.2.7/mod.ts";
import * as path from "https://deno.land/std/node/path.ts";

export class Cat implements interfaces.Cat {

    type = "CAT" as const;
    color = "BLACK" as const;
    gender = "FEMALE" as const;
    size = "SMALL" as const;

    testJsYaml() {
        return load('hello: world');
    }

    testMd5(){
        return Md5.hashStr("Foo bar");
    }


    spell = runExclusive.buildMethod(
        async (alphabet: [string], letter: string): Promise<void>=> {

            await new Promise<void>(resolve=>setTimeout(()=>resolve(), Math.random() * 100));

            alphabet[0]+= letter;

        }
    );

    spell2 = buildMethod(
        async (alphabet: [string], letter: string): Promise<void>=> {

            await new Promise<void>(resolve=> setTimeout(()=>resolve(), Math.random() * 100));

            alphabet[0]+= letter;

        }
    );

    pathJoin(...args: string[]): string{
        return path.join(...args);
    }

}

export function createCat(): interfaces.Cat {
    return {
        "type": "CAT",
        "color": "BLACK",
        "gender": "FEMALE",
        "size": "SMALL"
    };
}