import actionCreatorFactory from 'typescript-fsa';
import {SearchFilterChoice, SearchFilterType} from "../components/search/SearchItem";
import * as t from '../constants/actionTypes'

const actionCreator = actionCreatorFactory();
export const updateSearchChoices = actionCreator<{
    filter: SearchFilterType,
    choice: SearchFilterChoice, add: boolean
}>(t.UPDATE_SEARCH_FIELD_CHOICE);

export const updateSearchPage = actionCreator<number>(t.UPDATE_SEARCH_PAGE)
export const initSearch = actionCreator(t.INIT_SEARCH);



