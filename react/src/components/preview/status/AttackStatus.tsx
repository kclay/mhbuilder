import React from 'react'
import {Build} from "../../../common";

type Props = {
    build: Build
}
export const AttackStatus = ({build}: Props) => {

    return <ul className="status-list">
        <li className="attack-raw">
            <span className="status-name">Attack</span>
            <span className="status-value">488</span>
        </li>
        <li className="attack-affinity">
            <span className="status-name">Affinity</span>
            <span className="status-value">0%</span></li>
        <li className="attack-element">
            <span className="status-name">Element</span>
            <span className="status-value disabled element-water">120</span>
        </li>
    </ul>
};