import React from 'react'
import {Build} from "../../../common";

type Props = {
    build: Build
}
export const HealthStatus = ({build}: Props) => {

    return <ul className="status-list">
        <li className="health">
            <span className="status-name">Health</span>
            <span className="status-value">100</span>
        </li>
        <li className="stamina">
            <span className="status-name">Stamina</span>
            <span className="status-value">100</span>
        </li>
    </ul>
};