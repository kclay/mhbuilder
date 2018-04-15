import React from 'react'
import {DecorationSlots} from "./DecorationSlots";
import get from 'lodash/get'

const ItemPreview = ({item = {}, small = false, type}) => {
    const classNames = [
        'item-wrapper'
    ];
    if (small) classNames.push('item-small');
    const image = get(item, 'images.base', `${process.env.PUBLIC_URL}/assets/armors/${type}.png`);

    return <div className={classNames.join(' ')}>
        <div className="item">
            <div className="img-wrapper">
                {item.slots && <DecorationSlots slots={item.slots}/>}
                {image && <img src={image} alt=""/>}
            </div>
            <div className="item-tooltip"></div>
        </div>
    </div>

};
export {
    ItemPreview
}