import {orderBy, reduce, sumBy} from 'lodash'
import * as db from '../actions/db';
import {Build, BuildSkill, Gear, GearSkill} from "../common";
import {assets} from "../utils";

interface SkillHash {
    [key: string]: GearSkill[]
}

export default function computeSkills(build: Build, forSet: boolean): BuildSkill[] {

    const skills: SkillHash = reduce(build, (acc, gear: Gear) => {
        if (gear && gear.skills) {
            acc = reduce(gear.skills, (acc, skill: GearSkill) => {
                if (!acc[skill.skillName]) {
                    acc[skill.skillName] = [];
                }
                acc[skill.skillName].push(skill);
                return acc;
            }, acc)
        }
        return acc;
    }, {});
    const computed = reduce(skills, (acc, skills: GearSkill[], name: string) => {
        const skillId = skills[0].skill;
        const skill = db.skills(skillId).head;
        const points = sumBy(skills, 'level');
        const max = skill.ranks.length;
        const completed = skill.ranks.length === points;
        return [...acc, {
            id: skillId,
            name,
            image: assets('skills/ice-attack-skill-mhw.png'),
            points,
            max,
            completed
        }]
    }, []);
    return orderBy(computed, (skill: BuildSkill) => {
        return skill.points + skill.max
    }).reverse()
}

