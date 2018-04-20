import React from 'react'
import {Build, Gear} from "../../../common";
import computeDefense from "../../../compute/computeDefense";
import {DecorationStatus} from "./DecorationStatus";

type Props = {
    build?: Build,
    gear?: Gear
    className?: string

}
const renderValue = (value) => {
    return <span className={`status-value ${value < 0 ? 'negative-value' : ''}`}>
            {value}
            </span>
};
export const DefenseStatus = ({
                                  build = null,
                                  gear = null,
                                  className = 'status-list'

                              }: Props) => {

    const computed = computeDefense(build || gear);

    return <ul className={className}>
        {gear && <DecorationStatus gear={gear}/>}
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