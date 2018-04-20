import {map} from 'lodash'
import React, {Component} from 'react'
import * as db from '../../db'
import {GearTypes, SearchQuery} from '../../db'
import {SearchFilter, SearchFilterType, SearchItem} from "./SearchItem";

type State = {
    activeFilter: SearchFilterType
}

export class SearchMenu extends Component<any, State> {
    filters: SearchFilter[];

    state = {
        activeFilter: null
    };

    constructor(props) {
        super(props);
        this.filters = this.getSearchFilters();
    }

    getSearchFilters() {
        return [
            this.getSkillsSearchFilter(),
            this.getArmorSlotSearchFilter(),
            this.getDecorationSlotSearchFilter(),
            this.getRaritySearchFilter()
        ]
    }

    getSkillsSearchFilter() {
        return {
            type: SearchFilterType.Skills,
            title: 'Skills',
            choices: db.skills(SearchQuery.All).items.map(skill => {
                return {name: skill.name, value: skill.id}
            })
        }
    }

    getArmorSlotSearchFilter() {
        return {
            type: SearchFilterType.ArmorSlot,
            title: 'Armor Slot',
            choices: map(GearTypes, (value, name) => {
                return {name, value}
            })
        }
    }

    getDecorationSlotSearchFilter() {
        return {
            type: SearchFilterType.DecorationSlot,
            title: 'Decoration Slot',
            choices: ['1 Slot', '2 Slots', '3 Slots'].map((name, index) => {
                return {name, value: index + 1}
            })
        }
    }

    getRaritySearchFilter() {
        return {
            type: SearchFilterType.Rarity,
            title: 'Rarity',
            choices: [1, 2, 3, 4, 5, 6, 7, 8].map(name => {
                return {name: `Rarity ${name}`, value: name}
            })
        }
    }

    getStatusSearchField() {
        return {
            type: SearchFilterType.Status,
            title: 'Status',
            choices: []
        }
    }

    onSearchItemClicked = (type: SearchFilterType) => {
        this.setState({
            activeFilter: type
        })
    };

    render() {
        const {activeFilter} = this.state;

        return <div className="search-menu">
            {this.filters.map(filter => {
                return <SearchItem key={filter.type}
                                   active={activeFilter === filter.type}
                                   filter={filter}
                                   onClick={this.onSearchItemClicked}/>
            })}
        </div>
    }
}
