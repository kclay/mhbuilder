import React, {Component} from 'react'
import {connect} from "react-redux";
import {RootState} from "../../common";
import {searchResultsSelector} from "../../selectors/search";
import {SearchItemDetails} from "./item/SearchItemDetails";

type Props = {
    searchResults: any
}

export class UnconnectedSearchList extends Component<Props> {

    render() {
        const {searchResults} = this.props;
        return <div className="search-list">
            <div className="search-item-wrapper">
                {searchResults.items.map(gear => {
                    return <SearchItemDetails
                        key={`details-${gear.id}`}
                        gear={gear}/>
                })}
            </div>
        </div>
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        searchResults: searchResultsSelector(state)
    }
};

export const SearchList = connect(mapStateToProps)(UnconnectedSearchList);