import React from 'react'
import {BuildPreview} from "./build/BuildPreview";

const PreviewSection = (props) => {
    return <section className="preview-section">
        <div className="container preview-container">
            <BuildPreview/>
        </div>
    </section>
};
export {PreviewSection}