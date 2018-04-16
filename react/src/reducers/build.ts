import {reducerWithInitialState} from 'typescript-fsa-reducers'
import {loadBuild} from "../actions/build";
import {Build, BuildState} from "../common";


const INITIAL_STATE: BuildState = {
    loading: true,
    current: {
        head: null,
        charm: null,
        chest: null,
        hands: null,
        legs: null,
        waist: null
    }
};


const loadBuildHandler = (state: BuildState, build: Build) => {
    return {...state, current: build, loading: false}
};

const reducer = reducerWithInitialState(INITIAL_STATE)
    .case(loadBuild, loadBuildHandler)
    .build();

export default reducer;

