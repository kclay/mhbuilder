import {each, get, sumBy} from 'lodash'
import {Build, Gear} from "../common";
import {collectAllGear} from "../utils";

class ComputeDefense {
    defense: number = 0;
    fire: number = 0;
    water: number = 0;
    thunder: number = 0;
    ice: number = 0;
    dragon: number = 0;
}

export enum ResistanceType {
    Fire = 'fire',
    Water = 'water',
    Thunder = 'thunder',
    Ice = 'ice',
    Dragon = 'dragon'

}

export enum DefenseType {
    Base = 'base',
    Max = 'max',
    Augmented = 'augmented'
}


export default function computeDefense(build: Build | Gear, defenseType: DefenseType = DefenseType.Augmented): ComputeDefense {
    const computed = new ComputeDefense();
    const collection = collectAllGear(build);
    each(ResistanceType, (name) => {
        computed[name] = sumBy(collection, (gear: Gear) => {
            return computeResistance(gear, name);
        })
    });

    computed.defense = sumBy(collection, (gear: Gear) => {
        return get(gear, `attributes.defense.${defenseType}`, 0);
    });

    return computed;
}


export const computeResistance = (gear: Gear, resistance: ResistanceType) => {
    const attrs = gear && gear.attributes || {};
    if (resistance in attrs) {
        return Number(attrs[resistance]);
    }
    return 0;
};