
import * as interfaces from "./interfaces/index.ts";
import * as runExclusive from "https://raw.githubusercontent.com/garronej/run_exclusive/v2.2.13/deno_dist/mod.ts";
import { buildMethod } from "https://raw.githubusercontent.com/garronej/run_exclusive/v2.2.13/deno_dist/lib/runExclusive.ts";
import { load } from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";
import { Md5 } from "https://raw.githubusercontent.com/garronej/ts-md5/v1.2.7/deno_dist/mod.ts";
import * as path from "https://deno.land/std@0.65.0/node/path.ts";
import { EventEmitter } from "https://deno.land/std@0.65.0/node/events.ts";
import ipaddr from "https://jspm.dev/ipaddr.js@1.9.1";
import { dummyRender } from "./dummyRender.tsx";
import { leftPad as lp } from "../tools/leftPad.ts";
import { sha256, sha3_512 } from "./hash.ts";


console.assert(runExclusive.buildMethod === buildMethod );

export class Cat extends EventEmitter implements interfaces.Cat {

    type = "CAT" as const;
    color = "BLACK" as const;
    gender = "FEMALE" as const;
    size = "SMALL" as const;

    testJsYaml() {
        return load('hello: world');
    }

    testHash(type: "sha256" | "sha3" | "md5"){

        const input= "Hello World";

        switch(type){
            case "md5": return Md5.hashStr(input);
            case "sha256": return sha256(input);
            case "sha3": return sha3_512(input);
        }

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

    dummyRender() {
        return dummyRender({ "foo": "Hello Isomorphic React" });
    }

    testLeftPadWith10(str: string): string {
        return lp(str, 10);
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