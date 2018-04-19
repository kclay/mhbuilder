import React, {Component} from 'react'
import {connect} from "react-redux";
import {RootState} from "../../common";
import {searchResultsSelector} from "../../selectors/search";

type Props = {
    searchResults: any
}

export class UnconnectedSearchList extends Component<Props> {

    render() {

        console.log(this.props);
        return <div>Searching</div>
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        searchResults: searchResultsSelector(state)
    }
};

export const SearchList = connect(mapStateToProps)(UnconnectedSearchList);