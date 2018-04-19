import actionCreatorFactory from 'typescript-fsa';
import {SearchChoice, SearchFieldType} from "../components/search/SearchItem";
import * as t from '../constants/actionTypes'

const actionCreator = actionCreatorFactory();
export const updateSearchChoices = actionCreator<{
    field: SearchFieldType,
    choice: SearchChoice, add: boolean
}>(t.UPDATE_SEARCH_FIELD_CHOICE);
