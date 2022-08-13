import { Buffer } from "https://deno.land/std@0.152.0/node/buffer.ts";
//Not actual tests, just a place for you to experiment with the tool. 

import { Cat } from "../lib/index.ts";
import { getPackageJsonName } from "../tools/getPackageJsonName.ts";

console.log(`package.json "name" filed value ( to test some Node builtins ): ${getPackageJsonName()}`);

console.log(Buffer.byteLength(Buffer.from("hello")));

const cat = new Cat();

console.log(cat);

console.log(cat.testJsYaml());

console.log({
    "md5": cat.testHash("md5"),
    "sha256": cat.testHash("sha256"),
    "sha3": cat.testHash("sha3")
});

console.log(cat.pathJoin(".", "path", "to", "file.txt"));

{

    cat.on("sound", (sound: any) => console.log({ sound }));
    cat.makeSound();

}

console.log(cat.dummyRender());

console.log(`Left pad 10: =>${cat.testLeftPadWith10("abcd")}<=`);

(async () => {

    const alphabet: [string] = ["abc"];

    await cat.spell(alphabet, "d");

    console.log(alphabet);

    await cat.spell2(alphabet, "e");

    console.log(alphabet);

    console.log("\n\n\n");

})();

