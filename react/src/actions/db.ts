import axios from 'axios';
import {keyBy} from 'lodash'
import actionCreatorFactory from 'typescript-fsa';
import {bindThunkAction} from 'typescript-fsa-redux-thunk';
import {Gear} from "../common";
import * as t from '../constants/actionTypes'
import {buildArmor, buildWeapon, charms, database} from '../db'
import {assets} from "../utils";
import {loadBuild} from "./build";
import {initSearch} from "./search";

const actionCreator = actionCreatorFactory();
const loadAction = actionCreator.async(t.LOAD_DB);
const load = bindThunkAction(loadAction, async (params, dispatch) => {
    const loaders = ['armor', 'decorations', 'skills', 'weapons', 'charms'].map(name => {
        return axios.get<Gear>(assets(`db/${name}.json`))
    });

    return Promise.all(loaders).then((responses) => {
        responses.forEach(resp => {
            const data = resp.data;
            const filename = resp.config.url!.split('/').pop();
            const name = filename!.split('.json')[0];
            const storage = database[name];
            storage.records = data;
            storage.byName = keyBy(data, 'name');
            storage.byId = keyBy(data, 'id');
        });

        return true;
    })

});


const initAction = actionCreator.async(t.INIT_DB);
const init = bindThunkAction(initAction, async (params, dispatch) => {
    await dispatch(load());
    const build = {
        weapon: buildWeapon('Diablos Tyrannis 2', ['Vitality']),
        head: buildArmor('Rathalos Helm Beta', ['Vitality']),
        chest: buildArmor('Damascus Mail Beta', ['Artillery Jewel 1', 'Artillery Jewel 1', 'Artillery Jewel 1']),
        hands: buildArmor('Diablos Nero Braces Beta', ['Elementless', 'Vitality']),
        waist: buildArmor('Bazel Coil Beta', ['Sharp']),
        legs: buildArmor('Dodogama Greaves Beta', ['Attack']),
        charm: charms('Earplugs Charm').head.ranks[2],

    };
    dispatch(initSearch());
    return dispatch(loadBuild(build));
});
export {
    load,
    init
}