import React from 'react'
import {Slots} from "../../../common";
import {assets} from "../../../utils";

type Props = {
    slots: Slots
}


const DecorationSlots = ({slots = []}: Props) => {


    return <div className="item-decoration-slots">
        <ul>
            {[1, 2, 3].map(slot => {
                return slots[slot] ?
                    <li key={slot}><img src={assets(`decorations/gem_level_${slot}.png`)}
                                        alt=""/></li>
                    : null;

            })}

        </ul>
    </div>

};
export {
    DecorationSlots
}