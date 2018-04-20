import React from 'react'
import * as db from '../../../db'
import {Slot} from "../../../common";
import {GemSlot} from "../../GemSlot";

type Props = {
    id: string,
    slots: Slot[]
}


const getDescription = (slot: Slot) => {
    if (slot.decoration) {
        const skill = db.skills(slot.decoration.skill).head;
        return `<strong>${skill.name}</strong><p>${skill.description}</p>`;
    }
    return null;
};

const DecorationSlots = ({id, slots = []}: Props) => {
    return <div className="item-decoration-slots">
        <ul>
            {slots.map((slot, index) => {
                return slot.rank ?
                    <li key={`slot-${index}-${slot.rank}`}>
                        <GemSlot rank={slot.rank} id={`${id}-${index}-${slot.rank}`}
                                 description={getDescription(slot)}/>

                    </li>
                    : null;

            })}

        </ul>
    </div>

};
export {
    DecorationSlots
}