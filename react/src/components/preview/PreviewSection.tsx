import React from 'react'
import {BuildPreview} from "./build/BuildPreview";
import {SkillsInformation} from "./skill/SkillsInformation";
import {StatusOverview} from "./status/StatusOverview";

const PreviewSection = (props: any) => {
    return <section className="preview-section">
        <div className="container preview-container">
            <BuildPreview/>
            <div className="preview-informations">
                <SkillsInformation/>
                <StatusOverview/>
            </div>


        </div>
    </section>
};
export {PreviewSection}