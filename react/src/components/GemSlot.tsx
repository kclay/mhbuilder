import React from 'react'
import ReactTooltip from 'react-tooltip'
import {Decoration} from "../common";
import * as db from '../db'
import {assets} from "../utils";

type Props = {
    rank: number,
    id: string,
    decoration?: Decoration
}

export const GemSlot = ({id, rank, decoration = null}: Props) => {
    const uuid = `gem-tooltip-${id}`;
    let description = '';
    let skill;
    // TODO : Highlight gem if decoration is set
    if (decoration) {

        skill = db.skills(decoration.skill).head;
        description = `<strong>${skill.name}</strong><p>${skill.description}</p>`;
    }
    return <React.Fragment>
        <img data-tip={description} data-multline="true" data-for={uuid}
             src={assets(`decorations/gem_level_${rank}.png`)}
             alt=""/>
        {description && <ReactTooltip className="gem-tooltip" html={true} multiline={true} id={uuid}/>}
    </React.Fragment>
};