import {SearchFilterType} from "../../components/search/SearchItem";
import {buildInitialState} from "../../reducers/search";
import * as search from '../search'


test('should build query for filtering against skills', () => {
    const state = buildInitialState();

    state.filters[SearchFilterType.Skills] = [
        {name: 'skill-1', value: 1},
        {name: 'skill-2', value: 2},
        {name: 'skill-3', value: 3}
    ];

    const query = search.computeQuery(state);
    const expected = {
        skills: {
            $elemMatch: {
                skill: {$any: [1, 2, 3]}
            }
        }
    };
    expect(query).toMatchObject(expected);

})

