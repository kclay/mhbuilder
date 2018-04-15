import React from 'react'
import {ItemPreview} from "./ItemPreview";

type Row = {
    small?: boolean,
    kind: string,
    item: Gear
}
type Props = {
    rows: Row[],
    id: string;
}
const PreviewRow = ({rows, id}: Props) => {

    return <div className="preview-row" id={id}>
        {rows.map(({kind, small = false, item}) => {
            return <ItemPreview key={kind} small={small}
                                kind={kind} item={item}
            />
        })}
    </div>

};
export {PreviewRow}