/// <reference types="node" />
import * as interfaces from "./interfaces";
import { EventEmitter } from "events";
export declare class Cat extends EventEmitter implements interfaces.Cat {
    type: "CAT";
    color: "BLACK";
    gender: "FEMALE";
    size: "SMALL";
    testJsYaml(): any;
    testHash(type: "sha256" | "sha3" | "md5"): string | Int32Array;
    spell: (alphabet: [string], letter: string) => Promise<void>;
    spell2: (alphabet: [string], letter: string) => Promise<void>;
    pathJoin(...args: string[]): string;
    makeSound(): void;
    dummyRender(): string;
    testLeftPadWith10(str: string): string;
}
export declare function createCat(): interfaces.Cat;
