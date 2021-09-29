# my-dummy-npm-and-deno-module

A demo project that serve as a tutorial on how to setup [Denoify](https://github.com/garronej/denoify).

NOTE: For a new module name favor '\_' over '-' in the module name as it is
a deno requirement not to use '\_'

## Step 1: Dealing with unsupported Node builtins

As mentioned [the support for Node builtins](https://deno.land/std@0.65.0/node) is incomplete. 
Many important modules like `net` or `https` are not currently available.  
To make the matter worse you might run into some issues even with the module that are supposed
to be supported as some port are incomplete and some types definition mismatches `@types/node`.  

The solution is to wrap the problematic API inside a separate module and provide a custom implementation
for Deno.

Let's say we need to compute a `sha256` hash. When we check in the [compatibility list](https://deno.land/std@0.65.0/node) 
we can see that the node builtin `crypto` is not yet supported. 
So what we do is we create [`hash.ts`](https://github.com/garronej/denoify/tree/master/src/lib/hash.ts) file where we put: 

```typescript
import * as crypto from "crypto";

export function sha256(input: string): string {
    return crypto
        .createHash("sha256")
        .update(input)
        .digest("hex");
}
```

And a another file [`hash.deno.ts`](https://github.com/garronej/denoify/tree/master/src/lib/hash.deno.ts) exposing the same function but with a Deno implementation:  

```typescript
import { Sha256 } from "https://deno.land/std@0.65.0/hash/sha256.ts";

export function sha256(input: string): string {

    return new Sha256()
        .update(input)
        .hex();

}
```


## Step 2: Enabling the module's hard dependencies to run on Deno

We need to examine one by one all the module listed as `dependencies` in the `package.json`
and provide a Deno port for the modules that requires it.
All the dev dependencies can be ignored as they are not required to actually run the module.

- ``"run-exclusive"``
  We do not need to specify a deno port for this module as [run-exclusive](https://github.com/garronej/run_exclusive) 
  is a denoified module.
  We can use this module in our node code and Denoify will automatically replace the import statements when 
  generating the Deno distribution.

- `sha3`
  The module is only used in a file ( [`hash.ts`](https://github.com/garronej/denoify/tree/master/src/lib/hash.ts) ) that has 
  a Deno counterpart ( [`hash.deno.ts`](https://github.com/garronej/denoify/tree/master/src/lib/hash.deno.ts) ) so we do not need
  a Deno port for this dependency.

- `react`, `react-dom` and `ipaddr.js`
  Denoify has builtin import statement replacer for these modules. We do not need to specify any custom port. 
  To know if a module is supported by default by Denoify you can check if there if there is [a import statement replacer for it](https://github.com/garronej/denoify/tree/master/src/bin/replacer) 
  or if the module name is present in the [known-ports.json](https://github.com/garronej/denoify/blob/master/known-ports.jsonc) file.
  **For the rest of the tutorial we will assume ``ts-md5`` and ``js-yaml`` are NOT known by Denoify.**

- ``"ts-md5"``
  One way to come up with a Deno port of a NPM module is to fork the home repo of the project, 
  here [cotag/ts-md5](https://github.com/cotag/ts-md5), and setup denoify on the fork. 
  We've done it [here](https://github.com/garronej/ts-md5). It is then possible to specify the fork as a `denoPort` of the module.  
`package.json`:
```json
"dependencies": {
    "ts-md5": "^1.2.7"
}
"denoify": {
    "ports": {
        "ts-md5": "garronej/ts-md5"
    }
}
```

- ``"js-yaml"``
  If you happen to know an existing port for a module you can directly provide the URL of the index. 

`package.json`:
```json
"dependencies": {
    "js-yaml": "^3.13.1"
},
"denoify": {
    "ports": {
        "js-yaml": "https://deno.land/x/js_yaml_port/js-yaml.js"
    }
}
```
Be aware though that only `deno.land/x` and `raw.githubusercontent.com` URLs are supported 
and this will only work if the Deno port exposes exactly the same way the NPM module does.
For example if the NPM module is supposed to be imported like that `import * as Xxx from "xxx"` but the Deno
port is supposed imported like this: `import Xxx from "xxx"` it won't work. 
If you know your module can be imported in Deno using a ``pika`` or ``jspm`` URL the solution
is to write a custom import statement replacer as shown in the next example. 

- `"left-pad"`
  Here we don't want to go into the trouble of porting such a simple module, 
  we can just create a local implementation of leftPad for Deno and ensure 
  it is imported in place of [`left-pad`](https://www.npmjs.com/package/left-pad) in the Deno distribution.

`src/tools/leftPad.deno.ts`:
```typescript
export function leftPad(str: string, maxLength: number){
    return str.padStart(maxLength);
}
```  
`src/bin/denoifyImportReplacer.ts`: 
A import statement replacer is a trap offered by Denoify to give you the chance to specify exactly by
what string you want the import/export statements to be replaced.
The function will be called against each external import/export, the string returned by the
function will replace the import statement in the deno dist. You should return `undefined` for the statements
that you don't want to manually replace.

[see file](https://github.com/garronej/my_dummy_npm_and_deno_module/blob/master/src/bin/customReplacer.ts)

`package.json`:
You need to tell denoify where to find your replacer function.
```json
"denoify": {
    "replacer": "dist/bin/customReplacer.js"
}
```

This specific custom replacer will make sure that when Denoify run against `import * as lb from "left-pad"` in 
`src/lib/Cat.ts` for example, the import statement be replaced by: `import { leftPad as lp } from "../tools/leftPad.ts";`  
As mentioned earlier, custom replacer can be used to leverage ``pika`` and ``jspm``.
For example Denoify replace:
```typescript
import * as ReactDOMServer from "react-dom";
```
by 
```typescript
// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react-dom/v16.13.1/server.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server.js";
```
The replacer that makes this happen can be found [here](https://github.com/garronej/denoify/blob/master/src/bin/replacer/react-dom.ts). The version number that is passed to the replacer is the version number of the module installed 
in the node_modules folder at the time Denoify is run.


## Step 3: Edit `tsconfig.json`

### Make sure you use the `"outDir"` compiler option.

Denoify reads the `"outDir"` field of the `tsconfig.json` filed to determine where to put the de generated source so it must be completed.
The typical value to use is: 
```json
{
    "compilerOptions": {
        "outDir": "dist/"
    }
}
```

In this case the deno distribution will be placed in `deno_dist/k`.

### Explicitly excludes the deno files from compilation

``tsconfig.json``
```json
{
    "exclude": [
        "node_modules",
        "dist/",
        "deno_dist/",
        "src/**/*.deno.ts",
        "src/**/*.deno.tsx",
    ]
}
```

### Enable strict mode and fixes errors if any.

By default Deno has all strict compiler options enabled so if you want your module to run on deno regardless of the context you must set: 

```json
{
    "compilerOptions": {
        "noUnusedLocals": true, 
        "noUnusedParameters": true, 
        "strict": true 
    }
}
```

It might rise a lot of error but they are all very easy to fix even if you are not familiar with the codebase. 

<details>
  <summary>Click to expand!</summary>

For errors related to ``this`` implicitly having an any type, replace:
```typescript
function myFun(a): number{
    this.doSomething(a);
}
```
by
```typescript
function myFun(this: any, a: any): number{
    this.doSomething(a);
}
```
if you don't know any better.  

For errors related to something that can be `null` or `undefined`, replace:
```typescript
x.doSomething();
```
by
```typescript
x!.doSomething();
```

For error related to uninitialized property, replace:
```typescript
class Foo {
    n: number;
}
```
by:
```typescript
class Foo {
    n!: number;
}
```

For errors relative to name that cannot be found: 

```typescript
describe(...)
```
```typescript
declare const describe: any;
describe(...)
```

For unused variables:

```typescript
const x=3;
```
```typescript
const x=3; x;
```
  
</details>


## Step 4: Edit your `npm` scripts

First off, run `$ npm install --save-dev denoify` then add/edit the ``npm`` scripts:

``package.json``:
```json
    "devDependencies": {
        "denoify": "^4.0.1",
    }
    "scripts": {
        "build": "tsc && denoify",
    }
```


## (OPTIONAL) Step 4.5: Specify the output directory

If you don't want your deno distribution to be generated in the `deno_dist/`
directory but rather in an other directory you can specify it in the `package.json`


``package.json``:
```json
    "denoify": {
        "out": "a/b/c/deno_lib"
    }
```

## Step 5: Chose what files you wish to include in the `deno_dist` directory.

By default, if present, the `README.md` and the `LICENSE` files are copied over 
the `deno_dist` directory. If you wish to includes other files you can use the
denoify `includes` option:
`package.json`

```json
"denoify": {
    "includes": [ ... ]
}
```

Have a look at the [`package.json`](https://github.com/garronej/my_dummy_npm_and_deno_module/blob/master/package.json) for a configuration example.

## Building

Now every time you will run `$ npm run build` the sources for deno will be updated in `deno_dist/`

It is also a good idea to add scripts to run tests on Node and on Deno.
Note that in this repo we run the tests with the ``--allow-read`` because we use
``fs`` but if you module do not access files on the disk you don't need it.

## Create a new GitHub release every time you publish on npm.

Just after running ``$ npm publish`` got to your GitHub repo pages -> release -> create new release ( or draft new release ) and tag version enter ``v0.4.2`` matching the current version in your ``package.json`` file.

## (Optional) Publish your module on deno.land

Navigate to [deno.land/x](https://deno.land/x), click ``Add a module`` then follow the instruction.
Use `deno_dist/` as subdirectory when asked.

# Accessing files on the disk

<details>
  <summary>Click to expand!</summary>

Keep in mind that in Deno there is no ``node_modules`` sitting on the disk at runtime.  

Let's assume for example that you would like to load a ``database.json`` file located 
at the root of your project. You would write something like this:  

``src/index.ts``
```typescript
import * as fs from "fs";
import * as path from "path";
import { TextDecoder } from "util";

export function getDatabase(): Record<string,any> {
    return JSON.parse(
        new TextDecoder("utf-8").decode(
            fs.readFileSync(
                path.join(
                    __dirname,
                    "..", "database.json"
                )
            ) as Uint8Array
        )
    );
}
```

This will work on both Node and Deno when you run your tests but once 
your module published this won’t work on Deno anymore for the same reason 
it won’t work in the Browser, the ``database.json`` file is present 
on the disk at runtime.  

</details>

# Conclusion

It is now possible to use your module on node using ( assuming you have published it with ``npm publish`` ):

``$ npm install --save my-dummy-npm-and-deno-module``
then: 
```typescript
import { Cat } from "my-dummy-npm-and-deno-module"
```

And on deno with:

```typescript
import { Cat } from "https://deno.land/x/my_dummy_npm_and_deno_module@v0.4.2/mod.ts";
```
or if you haven't published on [deno.land/x](https://deno.land/x):
```typescript
import { Cat } from "https://raw.githubusercontent.com/garronej/my_dummy_npm_and_deno_module/v0.4.2/deno_dist/mod.ts";
```

On top of that this module can now be used as a dependency in other modules that uses ``denoify``.

If you want to avoid tracking the `deno_dist/` directory and automates the publishing process checkout [denoify_ci](https://github.com/garronej/denoify_ci)
