import React from 'react'

const DecorationSlots = ({slots}) => {


    return <div className="item-decoration-slots">
        <ul>
            {[1, 2, 3].map(slot => {
                return slots[slot] ?
                    <li key={slot}><img src={`${process.env.PUBLIC_URL}/assets/decorations/gem_level_${slot}.png`} alt=""/></li>
                    : null;

            })}

        </ul>
    </div>

};
export {
    DecorationSlots
}