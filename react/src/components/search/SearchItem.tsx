import React, {Component} from 'react'
import {connect} from "react-redux";
import {ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap'
import {bindActionCreators} from "redux";
import * as search from '../../actions/search'
import {Dispatch} from "../../common";


export interface SearchChoice {
    value: string | number | object,
    name: string
}

export enum SearchFieldType {
    Skills = 'skills',
    ArmorSlot = 'armor_slots',
    DecorationSlot = 'decoration_slot',
    Rarity = 'rarity',
    Status = 'status'

}

export interface SearchField {
    type: SearchFieldType,
    title: string,
    choices: SearchChoice[]
}


type State = {
    opened: boolean,
    choices: SearchChoice[]
}
type Props = {
    actions: typeof search,
    active: boolean,
    field: SearchField,
    onClick: (type: SearchFieldType) => void
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
        const {field} = this.props;
        this.props.onClick(field.type);

    };
    updateChoices = (choice: SearchChoice) => {
        const {actions, field} = this.props;
        const {choices} = this.state;
        const add = !choices.find(c => c.name === choice.name);
        actions.updateSearchChoices({field: field.type, choice, add});
        this.setState({
            choices: add ? [
                ...choices, choice
            ] : choices.filter(c => c.name !== choice.name)
        })
    };

    render() {

        const {field} = this.props;
        return <div className="search-item">
            <ButtonDropdown isOpen={this.state.opened} toggle={this.onToggle}>
                <DropdownToggle className="search-dropdown">
                    {field.title}
                </DropdownToggle>

                <DropdownMenu>
                    {field.choices.map(choice => {
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

