import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as search from '../../actions/search'
import {Dispatch, RootState} from "../../common";
import {allSearchFilterChoicesSelector} from "../../selectors/search";
import {SearchFilterChoice} from "./SearchItem";


type State = {
    showStats: boolean,
    showPreview: boolean
}

type Props = {
    choices: SearchFilterChoice[],
    actions: typeof search
}

export class UnconnectedSearchActiveFilters extends Component<Props, State> {

    state = {
        showStats: true,
        showPreview: false
    };

    removeSearchFilter = (choice: SearchFilterChoice) => {
        const {actions} = this.props;
        actions.updateSearchChoices({filter: choice.belongsTo, choice, add: false});
    };

    optionClass(value) {
        return value ? 'option-active' : 'option-inactive';
    }

    toggleShow(show) {
        this.setState({
            [show]: !this.state[show]
        })
    }

    render() {

        const {choices} = this.props;
        const {showStats, showPreview} = this.state;
        return <div className="active-filters-wrapper">
            <p className="active-filters">Active filters :
                {choices.map(choice => {
                    return <span key={choice.name} className="active-filter-item"
                                 onClick={() => this.removeSearchFilter(choice)}>{choice.name}</span>
                })}

            </p>
            <div className="display-options">
                <span className={`option ${this.optionClass(showStats)}`} onClick={() => this.toggleShow('showStats')}>Show Stats</span>
                <span className={`option ${this.optionClass(showPreview)}`}
                      onClick={() => this.toggleShow('showPreview')}>Preview</span>
            </div>
        </div>
    }
}


const mapStateToProps = (state: RootState) => {
    return {
        choices: allSearchFilterChoicesSelector(state)
    }
};
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        actions: bindActionCreators(search, dispatch)
    }
};

export const SearchActiveFilters = connect(mapStateToProps, mapDispatchToProps)(UnconnectedSearchActiveFilters);