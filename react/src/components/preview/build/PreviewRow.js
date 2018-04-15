import React from 'react'
import {ItemPreview} from "./ItemPreview";

const PreviewRow = ({rows, id}) => {

    return <div className="preview-row" id={id}>
        {rows.map((row) => {
            return <ItemPreview key={row.type} small={row.small}
                                type={row.type} item={row.item}
            />
        })}
    </div>

};
export {PreviewRow}