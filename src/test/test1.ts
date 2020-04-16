
import { Cat } from "../lib";

const cat = new Cat();

console.log(cat);

console.log(cat.testJsYaml());
console.log(cat.testMd5());

{

    const alphabet: [string] = ["abc"];

    cat.spell(alphabet, "d");

    console.log(alphabet);

    cat.spell2(alphabet, "e");

    console.log(alphabet);

}