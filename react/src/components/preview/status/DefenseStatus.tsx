import React from 'react'
import {Build} from "../../../common";
import computeDefense from "../../../compute/computeDefense";

type Props = {
    build: Build
}
const renderValue = (value) => {
    return <span className={`status-value ${value < 0 ? 'negative-value' : ''}`}>
            {value}
            </span>
};
export const DefenseStatus = ({build}: Props) => {

    const computed = computeDefense(build);

    return <ul className="status-list">
        <li className="defense-raw">
            <span className="status-name">Defense</span>
            {renderValue(computed.defense)}
        </li>
        <li className="defense-fire">
            <span className="status-name">Vs. Fire</span>
            {renderValue(computed.fire)}
        </li>
        <li className="defense-water">
            <span className="status-name">Vs. Water</span>
            {renderValue(computed.water)}
        </li>
        <li className="defense-thunder">
            <span className="status-name">Vs. Thunder</span>
            {renderValue(computed.thunder)}
        </li>
        <li className="defense-ice">
            <span className="status-name">Vs. Ice</span>
            {renderValue(computed.ice)}
        </li>
        <li className="defense-dragon">
            <span className="status-name">Vs. Dragon</span>
            {renderValue(computed.dragon)}
        </li>
    </ul>
};