import {flattenDeep, groupBy, orderBy, reduce, sumBy, values} from 'lodash'
import {Build, BuildSkill, Gear, GearSkill, Slot} from "../common";
import * as db from '../db';
import {collectAllGear, isCharmLike, skillImage} from "../utils";

interface SkillLevel {
    skillId: number,
    level: number,
    name: string
}


interface SkillHash {
    [index: string]: SkillLevel[]
}


const computeInheritedSkills = (collection: Gear[]): SkillHash => {

    return reduce(collection, (acc, gear: Gear) => {
        if (!gear || !gear.skills) return acc;
        return reduce(gear.skills, (acc, skill: GearSkill) => {
            const id = '' + skill.skill;
            if (!acc[id]) {
                acc[id] = [];
            }
            acc[id].push({
                skillId: skill.skill,
                level: skill.level,
                name: skill.skillName
            });
            return acc;
        }, acc)

    }, {});
};

const computeSkillsFromDecorations = (collection: Gear[]): SkillHash => {
    return reduce(collection, (acc, gear: Gear) => {
        if (!gear || isCharmLike(gear)) return acc;
        const slots = gear.attributes.slots;
        return reduce(slots, (acc, slot: Slot) => {
            if (!slot.decoration) return acc;
            const skill = db.skills(slot.decoration.skill).head;
            if (!skill) return acc;
            const id = '' + skill.id;
            if (!acc[id]) {
                acc[id] = [];
            }
            acc[id].push({
                skillId: skill.id,
                level: 1,
                name: skill.name
            });
            return acc;
        }, acc);

    }, {})
};
const resolveAllSkills = (buildOrGear: Build | Gear) => {
    const collection = collectAllGear(buildOrGear);
    const inherited = computeInheritedSkills(collection);
    const fromDecorations = computeSkillsFromDecorations(collection);
    const grouped = <any>groupBy(flattenDeep([values(inherited), values(fromDecorations)]), 'skillId');
    return <SkillHash>grouped;

};

export default function computeSkills(buildOrGear: Build | Gear, forSet: boolean = false): BuildSkill[] {
    const skills = resolveAllSkills(buildOrGear);
    const computed = reduce(skills, (acc, levels: SkillLevel[]) => {
        const skillId = levels[0].skillId;
        const skill = db.skills(skillId).head;
        const points = sumBy(levels, 'level');
        const max = skill.ranks.length;
        const completed = skill.ranks.length === points;
        return [...acc, {
            id: skillId,
            name: skill.name,
            image: skillImage(skill.color),
            points,
            max,
            completed
        }]
    }, []);
    return orderBy(computed, (skill: BuildSkill) => {
        return [skill.points]
    }, ['desc'])
}

