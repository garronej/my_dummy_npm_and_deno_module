
import * as interfaces from "./interfaces/index.ts";
import * as runExclusive from "https://raw.githubusercontent.com/garronej/run_exclusive/v2.1.12/mod.ts";
import { buildMethod } from "https://raw.githubusercontent.com/garronej/run_exclusive/v2.1.12/deno_dist/lib/runExclusive.ts";
import { load } from "https://deno.land/x/js_yaml_port@3.13.1/js-yaml.js";
import { Md5 } from "https://raw.githubusercontent.com/garronej/ts-md5/v1.2.7/mod.ts";

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

}

export function createCat(): interfaces.Cat {
    return {
        "type": "CAT",
        "color": "BLACK",
        "gender": "FEMALE",
        "size": "SMALL"
    };
}