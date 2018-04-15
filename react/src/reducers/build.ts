import {reducerWithInitialState} from 'typescript-fsa-reducers'

const INITIAL_STATE: Build = {
    head: null,
    charm: null,
    chest: null,
    hands: null,
    legs: null,
    waist: null
};


const reducer = reducerWithInitialState(INITIAL_STATE);
export default reducer;
