import React from 'react'
import {Gear} from "../../../common";
import computeSkills from "../../../compute/computeSkills";


type Props = {
    gear: Gear
}
export const SearchItemSkills = ({gear}: Props) => {

    const skills = computeSkills(gear);
    return <ul className="item-skills">
        {skills.map(skill => {
            return <li key={`skill-${skill.id}`}>
                <img src={skill.image}/>
                <p>
                    {skill.name} x{skill.points}
                </p>

            </li>
        })}
    </ul>
};