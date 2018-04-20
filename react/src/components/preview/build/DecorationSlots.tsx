import React from 'react'
import * as db from '../../../db'
import {Slot} from "../../../common";
import {GemSlot} from "../../GemSlot";

type Props = {
    id: string,
    slots: Slot[]
}




const DecorationSlots = ({id, slots = []}: Props) => {
    return <div className="item-decoration-slots">
        <ul>
            {slots.map((slot, index) => {
                return slot.rank ?
                    <li key={`slot-${index}-${slot.rank}`}>
                        <GemSlot rank={slot.rank} id={`${id}-${index}-${slot.rank}`}
                                 decoration={slot.decoration}
                                 />

                    </li>
                    : null;

            })}

        </ul>
    </div>

};
export {
    DecorationSlots
}