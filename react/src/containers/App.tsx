import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {dbActions} from '../actions'
import {Dispatch, RootState} from "../common";
import {NavBar} from "../components/NavBar";

import {PreviewSection} from "../components/preview";
import '../styles/css/style.css';

type Props = {
    actions: typeof dbActions,
    loading: boolean
}

type State = {
    loading: boolean
}

class UnconnectedApp extends Component<Props, State> {
    state = {
        loading: true
    };

    componentDidMount() {
        const {actions} = this.props;
        actions.init();
    }

    render() {
        const {loading} = this.props;
        if (loading) return <div>Loading...</div>;

        return <React.Fragment>
            <NavBar/>
            <PreviewSection/>
        </React.Fragment>
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        loading: state.build.loading
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        actions: bindActionCreators(dbActions, dispatch)
    }
};

const App = connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
export default App;