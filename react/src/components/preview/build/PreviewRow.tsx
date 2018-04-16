import React from 'react'
import {Gear, GearType} from "../../../common";
import {ItemPreview} from "./ItemPreview";

type Row = {
    small: boolean,
    item: Gear,
    type: GearType
}
type Props = {
    rows: Row[],
    id: string;
}

const PreviewRow = ({rows, id}: Props) => {

    return <div className="preview-row" id={id}>
        {rows.map(({type, small = false, item}) => {
            return <ItemPreview key={type} small={small}
                                type={type}
                                item={item}
            />
        })}
    </div>

};
export {PreviewRow}