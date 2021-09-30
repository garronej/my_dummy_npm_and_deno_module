
import * as interfaces from "./interfaces";
import * as runExclusive from "run-exclusive";
import { buildMethod } from "run-exclusive/lib/runExclusive";
import { load } from "js-yaml";
import { Md5 } from "ts-md5";
import * as path from "path";
import { EventEmitter } from "events";
import { dummyRender } from "./dummyRender";
import * as lp from "left-pad";
import { sha256, sha3_512 } from "./hash";


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