import { Sha256 } from "https://deno.land/std@0.65.0/hash/sha256.ts";
import { Sha3_512 } from "https://deno.land/std@0.65.0/hash/sha3.ts";

export function sha256(input: string): string {

    return new Sha256()
        .update(input)
        .hex();

}

export function sha3_512(input: string): string {

    return new Sha3_512()
        .update(input)
        .toString("hex");

}