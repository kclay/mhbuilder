import React, {Component} from 'react'
import computeSkills from "../../../compute/computeSkills";
import {SkillItem} from "./SkillItem";


type Props = {
    title: string;
    canExpand?: boolean;
    build: Build;
    forSet?: boolean
}

export class SkillsBreakdown extends Component<Props> {

    state = {
        expand: false
    };

    renderExpandControls() {
        const {canExpand} = this.props;
        if (!canExpand) return null;
        const {expand} = this.state;
        return <React.Fragment>
            {!expand && <a href="#" className="expand-list">Expand List</a>}
            {expand && <a href="#" className="reduce-list">Reduce List</a>}
        </React.Fragment>


    }

    render() {
        const {title, build, forSet = false} = this.props;
        const skills = computeSkills(build, forSet);

        return <div className="skills-informations skill-tab">
            <h2 className="title">{title}
                {this.renderExpandControls()}
            </h2>
            <div className="skill-list-wrapper">
                <ul className="skill-list">
                    {skills.map(skill => {
                        return <SkillItem key={`skill-${skill.id}`} skill={skill}/>
                    })}
                </ul>
            </div>
        </div>
    }
}

