
import * as crypto from "crypto";
//@ts-ignore
import { SHA3 } from "sha3";

export function sha256(input: string): string {

    return crypto
        .createHash("sha256")
        .update(input)
        .digest("hex");

}

export function sha3_512(input: string): string {

    return new SHA3(512)
        .update(input)
        .digest('hex');

}