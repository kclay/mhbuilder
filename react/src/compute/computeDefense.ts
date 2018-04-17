import {each, get, sumBy, values} from 'lodash'
import {Build, Gear} from "../common";

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

export default function computeDefense(build: Build, defenseType: DefenseType = DefenseType.Augmented): ComputeDefense {
    const computed = new ComputeDefense();
    each(ResistanceType, (name) => {
        computed[name] = sumBy(values(build), (gear: Gear) => {
            return computeResistance(gear, name);
        })
    });

    computed.defense = sumBy(values(build), (gear: Gear) => {
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