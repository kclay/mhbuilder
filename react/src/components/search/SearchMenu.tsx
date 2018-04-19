import React, {Component} from 'react'
import * as db from '../../actions/db'
import {SearchQuery} from '../../actions/db'
import {SearchField, SearchFieldType, SearchItem} from "./SearchItem";

type State = {
    activeField: SearchFieldType
}

export class SearchMenu extends Component<any, State> {
    fields: SearchField[];

    state = {
        activeField: null
    };

    constructor(props) {
        super(props);
        this.fields = this.getSearchFields();
    }


    getSearchFields() {
        return [
            this.getSkillsSearchField(),
            this.getArmorSlotSearchField(),
            this.getDecorationSlotSearchField(),
            this.getRaritySearchField()
        ]
    }

    getSkillsSearchField() {
        return {
            type: SearchFieldType.Skills,
            title: 'Skills',
            choices: db.skills(SearchQuery.All).results.map(skill => {
                return {name: skill.name, value: skill.id}
            })
        }
    }

    getArmorSlotSearchField() {
        return {
            type: SearchFieldType.ArmorSlot,
            title: 'Armor Slot',
            choices: ['1 Slot', '2 Slots', '3 Slots'].map((name, index) => {
                return {name, value: index + 1}
            })
        }
    }

    getDecorationSlotSearchField() {
        return {
            type: SearchFieldType.DecorationSlot,
            title: 'Decoration Slot',
            choices: ['1 Slot', '2 Slots', '3 Slots'].map((name, index) => {
                return {name, value: index + 1}
            })
        }
    }

    getRaritySearchField() {
        return {
            type: SearchFieldType.Rarity,
            title: 'Rarity',
            choices: [1, 2, 3, 4, 5, 6, 7, 8].map(name => {
                return {name: String(name), value: name}
            })
        }
    }

    getStatusSearchField() {
        return {
            type: SearchFieldType.Status,
            title: 'Status',
            choices: []
        }
    }

    onSearchItemClicked = (type: SearchFieldType) => {
        this.setState({
            activeField: type
        })
    };

    render() {
        const {activeField} = this.state;

        return <div className="search-menu">
            {this.fields.map(field => {
                return <SearchItem key={field.type}
                                   active={activeField === field.type}
                                   field={field}
                                   onClick={this.onSearchItemClicked}/>
            })}
        </div>
    }
}
