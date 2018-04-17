import axios from 'axios';
import actionCreatorFactory from 'typescript-fsa';
import {bindThunkAction} from 'typescript-fsa-redux-thunk';
import {Armor, Charm, Gear, MHItem, Skill} from "../common";
import * as t from '../constants/actionTypes'
import {assets} from "../utils";
import {loadBuild} from "./build";

const actionCreator = actionCreatorFactory();


class DB {
    armor: Armor[] = [];
    charms: Charm[] = [];
    decoration: any;
    skills: Skill[];
    weapons: any;
}

const database = new DB();
const loadAction = actionCreator.async(t.LOAD_DB);
const load = bindThunkAction(loadAction, async () => {
    const loaders = ['armor', 'decorations', 'skills', 'weapons', 'charms'].map(name => {
        return axios.get<Gear>(assets(`db/${name}.json`))
    });

    return Promise.all(loaders).then((responses) => {
        responses.forEach(resp => {
            const data = resp.data;
            const filename = resp.config.url!.split('/').pop();
            const name = filename!.split('.json')[0];
            database[name] = data;
        });
        return true;
    })

});

interface SearchResults<T> {
    head?: T
    results: T[]
}

type Query = string | number | object;

const search = <T extends MHItem>(records: T[], query: Query): SearchResults<T> => {
    let results: T[] = [];
    switch (typeof query) {
        case 'string': {
            results = records.filter(record => {
                return record.name.includes(<string>query)
            })
        }
            break;
        case 'number':
            results = records.filter(record => {
                return record.id === <number>query
            });
            break;
    }


    return {
        head: results.length ? results[0] : null,
        results
    }
};
export const armor = (query: Query): SearchResults<Armor> => {
    return search(database.armor, query);
};
export const charms = (query: Query): SearchResults<Charm> => {
    return search(database.charms, query);
};
export const skills = (query: Query): SearchResults<Skill> => {
    return search(database.skills, query);
};

const initAction = actionCreator.async(t.INIT_DB);
const init = bindThunkAction(initAction, async (params, dispatch) => {
    await dispatch(load());
    const build = {
        head: armor('Rathalos Helm Beta').head,
        chest: armor('Damascus Mail Beta').head,
        hands: armor('Diablos Nero Braces Beta').head,
        waist: armor('Bazel Coil Beta').head,
        legs: armor('Dodogama Greaves Beta').head,
        charm: charms('Earplugs Charm 3').head
    };
    return dispatch(loadBuild(build));
});
export {
    load,
    init
}