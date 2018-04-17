import React from 'react'
import {connect} from "react-redux";
import {Build, RootState} from "../../../common";
import {AttackStatus} from "./AttackStatus";
import {DefenseStatus} from "./DefenseStatus";
import {HealthStatus} from "./HeathStatus";


type Props = {
    build: Build
}

export const UnconnectedStatusBreakdown = ({build}: Props) => {

    return <div className="status-informations">
        <h2 className="title">Status</h2>
        <HealthStatus build={build}/>
        <h3>Attack Status</h3>              
        <AttackStatus build={build}/>
        <h3>Defense Status</h3>
        <DefenseStatus build={build}/>
    </div>
};

const mapStateToProps = (state: RootState) => {
    return {
        build: state.build.current
    }
};
export const StatusBreakdown = connect(mapStateToProps)(UnconnectedStatusBreakdown);