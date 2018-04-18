import {Armor, Charm, CharmLike, CharmRank, Gear} from "./common";

export const assets = (path) => {
    return `${process.env.PUBLIC_URL}assets/${path}`;
};
export const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

export function isArmor(gear: Gear): gear is Armor {

    return gear && 'defense' in gear.attributes;
}

export function isCharm(gear: Gear): gear is Charm {
    return gear && 'ranks' in gear
        && 'skills' in (<any>gear).ranks;
}

export function isCharmLike(gear): gear is CharmLike {
    return isCharm(gear) || isCharmRank(gear);
}


export function isCharmRank(gear: Gear): gear is CharmRank {
    return gear && !('attributes' in gear)
        && ('skills' in gear);
}