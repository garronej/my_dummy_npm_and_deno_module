
import * as interfaces from "./interfaces";
import * as runExclusive from "run-exclusive";
import { buildMethod } from "run-exclusive/lib/runExclusive";
import { load } from "js-yaml";
import { Md5 } from "ts-md5";
import * as path from "path";
import { EventEmitter } from "events";
import * as ipaddr from "ipaddr.js";
import { dummyRender } from "./dummyRender";


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

    dummyRender() {
        return dummyRender({ "foo": "Hello Isomorphic React" });
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