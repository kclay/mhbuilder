import React from 'react'
import {PreviewRow} from "./PreviewRow";

const BuildPreview = (props) => {
    const rows = {
        'first-row': [
            {small: true, type: 'kinsect'},
            {
                type: 'head', item: {
                slots: {1: true, 3: true}
            }
            },
            {small: true, type: 'charm'}

        ],
        'second-row': [
            {type: 'weapon'},
            {type: 'chest'},
            {type: 'hands'}
        ],
        'third-row': [
            {type: 'legs'},
            {type: 'waist'}
        ]
    };

    return <div className="preview-build">
        {Object.keys(rows).map(id => {
            return <PreviewRow key={id} id={id} rows={rows[id]}/>
        })}
    </div>
};

export {
    BuildPreview
}