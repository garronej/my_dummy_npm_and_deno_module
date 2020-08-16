
# my-dummy-npm-and-deno-module

A demo project that serve as a tutorial on how to setup [Denoify](https://github.com/garronej/denoify).

NOTE: For a new module name favor '\_' over '-' in the module name as it is
a deno requirement not to use '\_'

## Step 1: Provide port for dependencies.

This demo project depends on three modules:

- ``"js-yaml"``: Is is already known by denoify, it is present in : [known-ports.jsonc](https://github.com/garronej/denoify/blob/master/known-ports.jsonc),  
  There is nothing to do for ``js-yaml``. Let us assume however, for the sake of the tutorial that is is not know. We manually add an "denoPort" entry.
  in ``package.json`` pointing to the available port:

```json
"dependencies": {
    "js-yaml": "^3.13.1"
},
"denoPorts": {
    "js-yaml": "https://deno.land/x/js_yaml_port/js-yaml.js"
},
```

- ``"run-exclusive"``: We do not need to specify a deno port as [run-exclusive](https://github.com/garronej/run_exclusive) is a denoified module.

- ``"ts-md5"``: (It is in ``known-ports.json`` but let us assume it is not ) One way to support this module is to fork the home repo of ts-md5 and setup denoify on this fork. 
  We've done it [here](https://github.com/garronej/ts-md5). We can now specify our fork as a deno port.
```json
"dependencies": {
    "ts-md5": "^1.2.7"
}
"denoPorts": {
    "ts-md5": "garronej/ts-md5"
},
```

-  `react`, `react-dom`, `ipaddr.js`,: Denoify has builtin import statement replacer for these modules, [see here](https://github.com/garronej/denoify/tree/master/src/bin/replacer). We do not need to specify any custom port.

We can ignore the dev dependencies as they are not mandatory to run the module.

NOTE: `denoPorts` entry only accept urls of types `https://deno.land/x/...` or `https://raw.github.com/...`.
Github repo under the form of `<userOrOrg>/<repoName>` will only works with module that have been denoified ( like [garronej/tm-md5](https://github.com/garronej/ts-md5) )

If you want to use urls from Pika, jspm or UNPKG you can but you have to write custom replacers.

## Step 2: Edit tsconfig.json 

### Make sure you use the "outDir" option.

Denoify reads the "outDir" field of the ``tsconfig.json`` filed to determine where to put the de generated source so it must be completed.
The typical value to use is: 
```json
{
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

### Enable strict mode and fixes errors if any.

By default deno has all strict compiler options enabled so if you want your module to run on deno regardless of the context you must set: 

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
by:
```typescript
function myFun(this: any, a: any): number{
    this.doSomething(a);
}
```
If you don't know any better.  

For errors relating to something that can be null or undefined, replace:
```typescript
x.doSomething();
```
by:
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




### Explicitly excludes the deno files from compilation

``tsconfig.json``
```json
{

    "exclude": [
        "node_modules",
        "dist",
        "./deno_dist",
        "./mod.ts"
    ]
}
```

## Edit your ``npm`` scripts

First off, run ``$ npm install --save-dev denoify`` then add/edit
the ``npm`` scripts.

``package.json``
```json
    "devDependencies": {
        "denoify": "^4.0.1",
    }
    "scripts": {
        "build": "tsc && denoify",
    }
```

## Building

Now every time you will run `$ npm run build` the sources for deno will be updated in `/deno_dist/`

It is also a good idea to add scripts to run tests on node and on deno.
Note that in this repo we run the tests with the ``--allow-read`` because we use
``fs`` but if you module do not access files on the disk you don't need it.

## Create a new GitHub release every time you publish on npm.

Just after running ``$ npm publish`` got to your GitHub repo pages -> release -> create new release ( or draft ne release ) and tag version enter ``v0.2.9`` matching the current version in your ``package.json`` file.

## (Optional) Publish your module on deno.land

Navigate to [deno.land/x](https://deno.land/x), click ``Add a module`` then follow the instruction.
Use `deno_dist/` as subdirectory when asked.

# Accessing files on the disk.

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

# Conclusion

It is now possible to use your module on node using ( assuming you have published it with ``npm publish`` ):

``$ npm install --save my-dummy-npm-and-deno-module``
then: 
```typescript
import { Cat } from "my-dummy-npm-and-deno-module"
```

And on deno with:

```typescript
import { Cat } from "https://deno.land/x/my_dummy_npm_and_deno_module@v0.2.9/mod.ts";
```
or if you haven't published on Deno.land:

```typescript
import { Cat } from "https://raw.githubusercontent.com/garronej/my_dummy_npm_and_deno_module/v0.2.9/deno_dist/mod.ts";
```

On top of that this module can now be used as a dependency in other modules that uses ``denoify``.

If you want to avoid tracking the `deno_dist/` directory and automates the workflow checkout [denoify_ci](https://github.com/garronej/denoify_ci)
