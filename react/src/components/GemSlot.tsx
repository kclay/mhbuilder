import React from 'react'
import ReactTooltip from 'react-tooltip'
import {assets} from "../utils";

type Props = {
    rank: number,
    id: string,
    description?: string
}
export const GemSlot = ({id, rank, description = ''}: Props) => {
    const uuid = `gem-tooltip-${id}`;

    return <React.Fragment>
        <img data-tip={description} data-multline="true" data-for={uuid}
             src={assets(`decorations/gem_level_${rank}.png`)}
             alt=""/>
        {description && <ReactTooltip className="gem-tooltip" html={true} multiline={true} id={uuid}/>}
    </React.Fragment>
};