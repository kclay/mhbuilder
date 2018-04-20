import React from 'react'
import {Gear} from "../../../common";
import {assets} from "../../../utils";

type Props = {
    gear: Gear
}

export const resolveImages = (gear: Gear) => {
    const {male = '', female = '', base = ''} = gear.images || {};

    const images = [
        male, female
    ].filter(value => !!value);

    while (images.length < 2 && base) {
        images.push(base);
    }
    while (images.length < 2) {
        images.push(assets(`armors/${gear.type}.png`));
    }

    return images;
};

export const SearchItemPreview = ({gear}: Props) => {

    const images = resolveImages(gear);
    return <div className="item-preview">
        {images.map((image, index) => {
            return <div key={`${gear.name}-image-${index}`} className="item-preview-img">
                <img src={image}/>
            </div>
        })}

    </div>
}