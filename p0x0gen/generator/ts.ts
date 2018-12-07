import {ip0x0generator, p0x0generator} from "./generator";
import {p0x0} from "../../p0x0/p0x0";


export class ts extends p0x0generator {
    prepare(prototype: p0x0): string {
        return ``+
`/**
 * Class {prototype.constructor.name}
 */
export class Name {
    public a: string = '';
}
`;
    }

}

