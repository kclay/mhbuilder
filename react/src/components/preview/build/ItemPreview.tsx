import get from 'lodash/get'
import React from 'react'
import {Gear, GearType} from "../../../common";
import {assets} from "../../../utils";
import {DecorationSlots} from "./DecorationSlots";

type Props = {
    item?: Gear,
    type: GearType,
    small: boolean

}

const ItemPreview = ({type, item, small = false}: Props) => {
    const classNames = [
        'item-wrapper'
    ];
    if (small) classNames.push('item-small');
    const image = get(item, 'images.male',
        get(item, 'images.base', assets(`armors/${type}.png`))
    );

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