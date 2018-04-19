import {reducerWithInitialState} from "typescript-fsa-reducers";
import {updateSearchChoices} from "../actions/search";
import {SearchFilterChoice, SearchFilterType} from "../components/search";


interface SearchFilterChoices {
    [key: string]: SearchFilterChoice[]
}

export interface SearchState {
    filters: SearchFilterChoices,
    term: string
    page: number
}

export function buildInitialState(): SearchState {
    return {
        filters: {
            [SearchFilterType.Skills]: [],
            [SearchFilterType.ArmorSlot]: [],
            [SearchFilterType.DecorationSlot]: [],
            [SearchFilterType.Rarity]: []
        },
        term: '',
        page: 1

    }
};

const INITIAL_STATE: SearchState = buildInitialState();

export type UpdateSearchChoicePayload = {
    filter: SearchFilterType,
    choice: SearchFilterChoice, add: boolean
}
const updateSearchChoicesHandler = (state: SearchState, {filter, choice, add}: UpdateSearchChoicePayload) => {

    const {filters} = state;
    return {
        ...state, filters: {
            [filter]: add ? [
                ...filters[filter], choice
            ] : filters[filter].filter(c => c.value !== choice.value)
        }
    }

};


const reducer = reducerWithInitialState(INITIAL_STATE)
    .case(updateSearchChoices, updateSearchChoicesHandler)
    .build();
export default reducer
