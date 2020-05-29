//Not actual tests, just a place for you to experiment with the tool. 

import { Cat } from "../lib/index.ts";
import { getPackageJsonName } from "../tools/getPackageJsonName.ts";

console.log(`package.json "name" filed value ( to test some Node builtins ): ${getPackageJsonName()}`);

const cat = new Cat();

console.log(cat);

console.log(cat.testJsYaml());
console.log(cat.testMd5());

console.log(cat.pathJoin(".", "path", "to", "file.txt"));


{

    cat.on("sound", (sound: any) => console.log({ sound }));
    cat.makeSound();

}


(async () => {

    const alphabet: [string] = ["abc"];

    await cat.spell(alphabet, "d");

    console.log(alphabet);

    await cat.spell2(alphabet, "e");

    console.log(alphabet);

    console.log("\n\n\n");

})();

