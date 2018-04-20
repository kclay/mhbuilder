import React from 'react'
import {Gear} from "../../../common";
import {GemSlot} from "../../GemSlot";


type Props = {
    gear: Gear
}

export const DecorationStatus = ({gear}: Props) => {
    const slots = gear.attributes.slots || [];

    if (!slots.length) return null;
    return <li className="decoration-slots">
        <span className="status-name">Decorations</span>
        <span className="status-value">
            {slots.map((slot, index) => {
                return <div className={`decorations-lvl decorations-fit-${slots.length}`} key={`deco-slot-${index}`}>
                    <GemSlot rank={slot.rank} id={`${gear.id}-${slot.rank}`}/>
                </div>
            })}
         </span>
    </li>

};