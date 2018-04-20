import React from 'react'
import {connect} from "react-redux";
import {Build, RootState} from "../../../common";
import {PreviewRow} from "./PreviewRow";

type Props = {
    build: Build
}
export const UnconnectedBuildPreview = ({build}: Props) => {
    const rows = {
        'first-row': [
            {small: true, type: 'kinsect'},
            {
                type: 'head', item: build.head
            },
            {small: true, type: 'charm', item: build.charm}

        ],
        'second-row': [
            {type: 'weapon', item: build.weapon},
            {type: 'chest', item: build.chest},
            {type: 'gloves', item: build.gloves}
        ],
        'third-row': [
            {type: 'legs', item: build.legs},
            {type: 'waist', item: build.waist}
        ]
    };

    return <div className="preview-build">
        {Object.keys(rows).map(id => {
            return <PreviewRow key={id} id={id} rows={rows[id]}/>
        })}
    </div>
};
const mapStateToProps = (state: RootState) => {
    return {
        build: state.build.current
    }
};
const BuildPreview = connect(mapStateToProps)(UnconnectedBuildPreview);

export {
    BuildPreview
}