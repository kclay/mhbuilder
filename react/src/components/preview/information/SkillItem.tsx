import React from 'react'
import {range} from "../../../utils";
import {BuildSkill} from "../../../common";

type Props = {
    skill: BuildSkill
}

const SkillItem = ({skill}: Props) => {
    const points = range(1, skill.max);
    return <li className="skill-item">
        <div className="skill-img">
            <img src={skill.image}/>
        </div>
        <div className="skill-informations">
            <h2>{skill.name}</h2>
            <div className="skill-points">
                {points.map(point => {
                    return <li key={`skill-point-${point}`} className={point <= skill.points ? 'active' : ''}/>
                })}
            </div>
            <span>Level {skill.points}</span>
        </div>
    </li>
};
export {
    SkillItem
}