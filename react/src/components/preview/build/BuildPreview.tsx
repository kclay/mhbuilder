import React from 'react'
import {connect} from "react-redux";
import {PreviewRow} from "./PreviewRow";

type Props = {
    build: Build
}
export const UnconnectedBuildPreview = ({build}: Props) => {
    const rows = {
        'first-row': [
            {small: true, kind: 'kinsect'},
            {
                kind: 'head', item: {
                slots: {1: true, 3: true}
            }
            },
            {small: true, kind: 'charm'}

        ],
        'second-row': [
            {kind: 'weapon'},
            {kind: 'chest'},
            {kind: 'hands'}
        ],
        'third-row': [
            {kind: 'legs'},
            {kind: 'waist'}
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
        build: state.build
    }
};
const BuildPreview = connect(mapStateToProps)(UnconnectedBuildPreview);

export {
    BuildPreview
}