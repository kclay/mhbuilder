import React from 'react'
import {Gear} from "../../../common";
import {DefenseStatus} from "../../preview/status/DefenseStatus";
import {SearchItemPreview} from "./SearchItemPreview";
import {SearchItemSkills} from "./SearchItemSkills";

type Props = {
    gear: Gear
}

export const SearchItemDetails = ({gear}: Props) => {

    const displaySkills = (gear.skills || []).length > 0;
    return <div className="item-detail-wrapper">
        <div className="item-detail">
            <div className="item-title">
                <h3>{gear.name}</h3>
                <p className={`item-rarity rarity-${gear.rarity}`}>Rarity {gear.rarity}</p>
            </div>
            <SearchItemPreview gear={gear}/>
            <div className="item-informations">
                {displaySkills && <div className="item-informations-title">
                    Skill
                </div>}
                {displaySkills && <SearchItemSkills gear={gear}/>}
                <div className="item-informations-title">
                    Statistics
                </div>
                <DefenseStatus gear={gear} className="status-stats"/>
            </div>
        </div>
    </div>
};
