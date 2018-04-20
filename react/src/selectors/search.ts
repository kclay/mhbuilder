import {flatten, map, reduce, values} from 'lodash'
import {createSelector} from 'reselect'
import * as db from '../db'
import {RootState} from "../common";
import {SearchFilterChoice, SearchFilterType} from "../components/search/SearchItem";
import {SearchState} from "../reducers/search";

export const searchSelector = (state: RootState) => state.search;

export const allSearchFilterChoicesSelector = createSelector(searchSelector,
    (search: SearchState) => {
        // silly typing
        const mapped = map(search.filters,
            (choices: SearchFilterChoice[], belongsTo: string) => {
                return choices.map(choice => ({...choice, belongsTo: belongsTo}))
            });
        const flattened = flatten(values(mapped));

        return <SearchFilterChoice[]>(<any>flattened);

    });


const buildFilterQuery = (filter: SearchFilterType, choices: SearchFilterChoice[]) => {
    const $any = {$any: choices.map(choice => choice.value)}
    switch (filter) {
        case SearchFilterType.Skills: {
            return {
                skills: {
                    $elemMatch: {
                        skill: $any
                    }
                }
            }
        }
        case SearchFilterType.ArmorSlot: {
            return {
                type: $any
            }
        }
        case SearchFilterType.DecorationSlot: {
            return {
                attributes: {
                    slots: {
                        $elemMatch: {
                            rank: $any
                        }
                    }
                }
            }
        }
        case SearchFilterType.Rarity: {
            return {
                rarity: $any
            }
        }
        default:
            return {}
    }
};

export const computeQuery = (search: SearchState) => {
    return reduce(search.filters, (acc, choices: any[], filter: SearchFilterType) => {
        if (!choices.length) return acc;
        return {...acc, ...buildFilterQuery(filter, choices)}
    }, {});
};


export const computeSearchQuerySelector = createSelector(
    searchSelector,
    (search: SearchState) => computeQuery(search)
);
export const computeSearchResultsSelector = createSelector(
    computeSearchQuerySelector,
    (query) => {
        return db.all(query)
    });

const pageSelector = createSelector(searchSelector,
    (search: SearchState) => {
        return search.page
    });
const ITEMS_PER_PAGE = 12;
export const searchResultsSelector = createSelector(
    pageSelector,
    computeSearchResultsSelector,
    (page, results) => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const items = results.items.slice(start, end);
        return {
            head: items.length ? results[0] : null,
            items,
            page,
            total: results.total
        }
    }
);
