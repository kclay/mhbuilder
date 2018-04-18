import {flattenDeep, groupBy, orderBy, reduce, sumBy, values} from 'lodash'
import * as db from '../actions/db';
import {Build, BuildSkill, Gear, GearSkill, Slot} from "../common";
import {assets, isCharmLike} from "../utils";

interface SkillLevel {
    skillId: number,
    level: number,
    name: string
}


interface SkillHash {
    [index: string]: SkillLevel[]
}

const computeInheritedSkills = (build: Build): SkillHash => {
    return reduce(build, (acc, gear: Gear) => {
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

const computeSkillsFromDecorations = (build: Build): SkillHash => {
    return reduce(build, (acc, gear: Gear) => {
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
const resolveAllSkills = (build: Build) => {
    const inherited = computeInheritedSkills(build);
    const fromDecorations = computeSkillsFromDecorations(build);
    const grouped = <any>groupBy(flattenDeep([values(inherited), values(fromDecorations)]), 'skillId');
    return <SkillHash>grouped;

};

export default function computeSkills(build: Build, forSet: boolean): BuildSkill[] {

    const skills = resolveAllSkills(build);
    const computed = reduce(skills, (acc, levels: SkillLevel[]) => {
        const skillId = levels[0].skillId;
        const skill = db.skills(skillId).head;
        if (!skill) {
            console.log(levels);
        }
        const points = sumBy(levels, 'level');
        const max = skill.ranks.length;
        const completed = skill.ranks.length === points;
        return [...acc, {
            id: skillId,
            name: skill.name,
            image: assets(`skills/${skill.color ? skill.color : 'light-grey'}.png`),
            points,
            max,
            completed
        }]
    }, []);
    return orderBy(computed, (skill: BuildSkill) => {
        return [skill.points]
    }, ['desc'])
}

