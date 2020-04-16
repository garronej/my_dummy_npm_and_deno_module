
import { Cat } from "../lib/index.ts";

const cat = new Cat();

console.log(cat);

console.log(cat.testJsYaml());
console.log(cat.testMd5());

(async () => {

    const alphabet: [string] = ["abc"];

    await cat.spell(alphabet, "d");

    console.log(alphabet);

    await cat.spell2(alphabet, "e");

    console.log(alphabet);

    console.log("\n\n\n");

})();

