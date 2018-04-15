import React, {Component} from 'react'


const Tabs = {
    Active: 'active',
    Set: 'set'
}


export class SkillsInformation extends Component {

    state = {
        tab: 'active'
    };

    onTabClicked = (tab) => {
        this.setState({
            tab: tab
        })
    };

    getTabProps(active) {
        const {tab} = this.state;
        return {
            className: `skills_tabs_item ${tab === active ? 'active' : ''}`,
            onClick: () => this.onTabClicked(active)
        }
    }

    render() {
        return <div className="skills-informations-wrapper">
            <div className="skills_tabs_buttons">
                <button {...this.getTabProps(Tabs.Active)}> Active Skills</button>
                <button {...this.getTabProps(Tabs.Set)}>Set Skills</button>
            </div>
            <div className="skills_tab_group">
            </div>
        </div>
    }
}

