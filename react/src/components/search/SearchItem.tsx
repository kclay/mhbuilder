import React, {Component} from 'react'
import {connect} from "react-redux";
import {ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import {bindActionCreators} from "redux";
import * as search from '../../actions/search'
import {Dispatch} from "../../common";


export interface SearchFilterChoice {
    value: string | number | object,
    name: string
    belongsTo?: SearchFilterType
}

export enum SearchFilterType {
    Skills = 'skills',
    ArmorSlot = 'armor_slots',
    DecorationSlot = 'decoration_slot',
    Rarity = 'rarity',
    Status = 'status'

}

export interface SearchFilter {
    type: SearchFilterType,
    title: string,
    choices: SearchFilterChoice[]
}


type State = {
    opened: boolean,
    choices: SearchFilterChoice[]
}
type Props = {
    actions: typeof search,
    active: boolean,
    filter: SearchFilter,
    onClick: (type: SearchFilterType) => void
}

export class UnconnectedSearchItem extends Component<Props, State> {
    state = {
        opened: false,
        choices: []
    };

    onToggle = () => {
        const opened = !this.state.opened;
        this.setState({
            opened
        });

        if (opened) {
            this.onClick();
        }
    };
    onClick = () => {
        const {filter} = this.props;
        this.props.onClick(filter.type);

    };
    updateChoices = (choice: SearchFilterChoice) => {
        const {actions, filter} = this.props;
        const {choices} = this.state;
        const add = !choices.find(c => c.name === choice.name);
        actions.updateSearchChoices({filter: filter.type, choice, add});
        this.setState({
            choices: add ? [
                ...choices, choice
            ] : choices.filter(c => c.name !== choice.name)
        })
    };

    render() {

        const {filter} = this.props;
        return <div className="search-item">
            <ButtonDropdown isOpen={this.state.opened} toggle={this.onToggle}>
                <DropdownToggle className="search-dropdown">
                    {filter.title}
                </DropdownToggle>

                <DropdownMenu>
                    {filter.choices.map(choice => {
                        return <DropdownItem key={`search-source-${choice.name}`}

                                             onClick={() => this.updateChoices(choice)}>
                            {choice.name}

                        </DropdownItem>
                    })}

                </DropdownMenu>

            </ButtonDropdown>

        </div>
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        actions: bindActionCreators(search, dispatch)
    }
};
export const SearchItem = connect(null, mapDispatchToProps)(UnconnectedSearchItem);

