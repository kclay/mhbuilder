import {groupBy, map, reduce} from 'lodash'
import * as db from '../actions/db'
import {Build, Gear} from "../common";

export enum Affects {
    Health = 'health',
    Stamina = 'stamina',
    Attack = 'attack',
    Affinity = 'affinity'
}

export default function computeAffects(build: Build, affects: Affects) {
    const skillIds = reduce(build, (acc, gear: Gear) => {
        if (!gear) return acc;
        return [...acc, map(gear.skills, 'id')]
    }, []);
    const results = db.skills(skillIds, true);
    const skills = results.items || [];
    const skillByGroup = groupBy(skills, 'id')
    return 0;

}

export function computeGearAffects(gear: Gear, affects: Affects) {
    /* if (isArmor(gear)) {
         const skillIds = map(gear.skills, 'id');
         const results = db.skills(skillIds, true);

     }*/
    return 0;
}
