import React from 'react'
import {BuildSkill} from "../../../common";
import {range} from "../../../utils";

type Props = {
    skill: BuildSkill
}

const SkillItem = ({skill}: Props) => {
    const points = range(1, skill.max + 1);
    return <li className="skill-item">
        <div className="skill-img">
            <img src={skill.image}/>
        </div>
        <div className="skill-informations">
            <h2>{skill.name}</h2>
            <div className="skill-points">
                <ul>
                    {points.map(point => {
                        return <li key={`skill-point-${point}`} className={point <= skill.points ? 'active' : ''}></li>
                    })}
                </ul>
                <span className={`${skill.completed ? 'complete' : ''}`}>Level {skill.points}</span>
            </div>

        </div>
    </li>
};
export {
    SkillItem
}