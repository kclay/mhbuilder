import get from 'lodash/get'
import React from 'react'
import {assets} from "../../../utils";
import {DecorationSlots} from "./DecorationSlots";

type Props = {
    item?: Gear | Armor,
    small: boolean,
    kind: string
}
const ItemPreview = ({item, small = false, kind}: Props) => {
    const classNames = [
        'item-wrapper'
    ];
    if (small) classNames.push('item-small');
    const image = get(item, 'images.base', assets(`armors/${kind}.png`));

    return <div className={classNames.join(' ')}>
        <div className="item">
            <div className="img-wrapper">
                {item && item.slots && <DecorationSlots slots={item.slots}/>}
                {image && <img src={image} alt=""/>}
            </div>
            <div className="item-tooltip"/>
        </div>
    </div>

};
export {
    ItemPreview
}