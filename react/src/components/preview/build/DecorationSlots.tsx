import React from 'react'
import {Slot} from "../../../common";
import {assets} from "../../../utils";

type Props = {
    slots: Slot[]
}


const DecorationSlots = ({slots = []}: Props) => {

    return <div className="item-decoration-slots">
        <ul>
            {slots.map((slot, index) => {
                return slot.rank ?
                    <li key={`slot-${index}-${slot.rank}`}><img src={assets(`decorations/gem_level_${slot.rank}.png`)}
                                                                alt=""/></li>
                    : null;

            })}

        </ul>
    </div>

};
export {
    DecorationSlots
}