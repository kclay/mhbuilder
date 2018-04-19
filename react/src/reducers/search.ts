import {reducerWithInitialState} from "typescript-fsa-reducers";
import {updateSearchChoices} from "../actions/search";
import {SearchChoice, SearchFieldType} from "../components/search";


interface SearchFieldChoices {
    [key: string]: any[]
}

export interface SearchState {
    fields: SearchFieldChoices,
    term: string
}

const INITIAL_STATE: SearchState = {
    fields: {
        [SearchFieldType.Skills]: [],
        [SearchFieldType.ArmorSlot]: [],
        [SearchFieldType.DecorationSlot]: [],
        [SearchFieldType.Rarity]: []
    },
    term: ''
};
export type UpdateSearchChoicePayload = {
    field: SearchFieldType,
    choice: SearchChoice, add: boolean
}
const updateSearchChoicesHandler = (state: SearchState, {field, choice, add}: UpdateSearchChoicePayload) => {

    const {fields} = state;
    return {
        ...state, fields: {
            [field]: add ? [
                ...fields[field], choice.value
            ] : fields[field].filter(value => value !== choice.value)
        }
    }

};


const reducer = reducerWithInitialState(INITIAL_STATE)
    .case(updateSearchChoices, updateSearchChoicesHandler)
    .build();
export default reducer