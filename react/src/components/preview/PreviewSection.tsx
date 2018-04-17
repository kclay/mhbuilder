import React from 'react'
import {BuildPreview} from "./build/BuildPreview";
import {PreviewInformation} from "./skill/PreviewInformation";

const PreviewSection = (props: any) => {
    return <section className="preview-section">
        <div className="container preview-container">
            <BuildPreview/>
            <PreviewInformation/>
        </div>
    </section>
};
export {PreviewSection}