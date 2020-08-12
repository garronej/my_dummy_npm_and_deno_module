//Not actual tests, just a place for you to experiment with the tool. 

import { Cat } from "../lib";
import { getPackageJsonName } from "../tools/getPackageJsonName";

console.log(`package.json "name" filed value ( to test some Node builtins ): ${getPackageJsonName()}`);

console.log(Buffer.byteLength(Buffer.from("hello")));

const cat = new Cat();

console.log(cat);

console.log(cat.testJsYaml());
console.log(cat.testMd5());

console.log(cat.pathJoin(".", "path", "to", "file.txt"));


{

    cat.on("sound", (sound: any) => console.log({ sound }));
    cat.makeSound();

}

console.log(cat.getIpV4Octets("192.168.1.1"));

(async () => {

    const alphabet: [string] = ["abc"];

    await cat.spell(alphabet, "d");

    console.log(alphabet);

    await cat.spell2(alphabet, "e");

    console.log(alphabet);

    console.log("\n\n\n");

})();

