
import * as interfaces from "./interfaces/index.ts";
import * as runExclusive from "https://raw.githubusercontent.com/garronej/run_exclusive/v2.2.13/deno_dist/mod.ts";
import { buildMethod } from "https://raw.githubusercontent.com/garronej/run_exclusive/v2.2.13/deno_dist/lib/runExclusive.ts";
import { load } from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";
import { Md5 } from "https://raw.githubusercontent.com/garronej/ts-md5/v1.2.7/deno_dist/mod.ts";
import * as path from "https://deno.land/std@0.64.0/node/path.ts";
import { EventEmitter } from "https://deno.land/std@0.64.0/node/events.ts";
import ipaddr from "https://jspm.dev/ipaddr.js@1.9.1";

console.assert(runExclusive.buildMethod === buildMethod );

export class Cat extends EventEmitter implements interfaces.Cat {

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

            await new Promise<void>(
                resolve=>setTimeout(()=>resolve(), 
                Math.random() * 100)
            );

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

    makeSound(){
        this.emit("sound", "meow");
    }

    getIpV4Octets(ip: string) {
        return ipaddr.IPv4.parse(ip).octets;
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