import {Armor, Gear} from "./common";

export const assets = (path) => {
    return `${process.env.PUBLIC_URL}assets/${path}`;
};
export const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

export function isArmor(gear: Gear): gear is Armor {

    return gear && 'defense' in gear.attributes;
}