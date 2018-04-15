import React, {Component} from 'react'
import {SkillsBreakdown} from "./SkillsBreakdown";


const Tabs = {
    Active: 'active',
    Set: 'set'
};
type State = {
    tab: string
}


export class SkillsInformation extends Component<any, State> {

    state = {
        tab: 'active'
    };

    onTabClicked = (tab: string) => {
        this.setState({
            tab: tab
        })
    };

    isActive(tab) {
        return this.state.tab === tab;
    }

    getTabProps(active: string) {
        const {tab} = this.state;
        return {
            className: `skills_tabs_item ${tab === active ? 'active' : ''}`,
            onClick: () => this.onTabClicked(active)
        }
    }

    render() {
        const build: Build = {};
        return <div className="skills-informations-wrapper">
            <div className="skills_tabs_buttons">
                <button {...this.getTabProps(Tabs.Active)}> Active Skills</button>
                <button {...this.getTabProps(Tabs.Set)}>Set Skills</button>
            </div>
            <div className="skills_tab_group">
                {this.isActive(Tabs.Active) && <SkillsBreakdown title="Active Skills"
                                                                canExpand={true}
                                                                build={build}/>}
                {this.isActive(Tabs.Set) && <SkillsBreakdown title="Set Skills"
                                                             forSet={true}
                                                             build={build}/>}
            </div>
        </div>
    }
}

