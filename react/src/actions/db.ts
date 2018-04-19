import axios from 'axios';
import {keyBy, uniqBy} from 'lodash'
import actionCreatorFactory from 'typescript-fsa';
import {bindThunkAction} from 'typescript-fsa-redux-thunk';
import {Armor, Charm, Decoration, Gear, MHItem, Skill, Weapon} from "../common";
import * as t from '../constants/actionTypes'
import {assets} from "../utils";
import {loadBuild} from "./build";

const actionCreator = actionCreatorFactory();


interface Lookup<T> {
    [key: string]: T
}

class DBStorage<T> {
    byName: Lookup<T> = {};
    byId: Lookup<T> = {};
    records: T[] = [];

    get names() {
        return Object.keys(this.byName);
    }
}


class DB {
    armor = new DBStorage<Armor>();
    charms = new DBStorage<Charm>();
    decorations = new DBStorage<Decoration>();
    skills = new DBStorage<Skill>();
    weapons = new DBStorage<Weapon>();

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
            const storage = database[name];
            storage.records = data;
            storage.byName = keyBy(data, 'name');
            storage.byId = keyBy(data, 'id');
        });
        return true;
    })

});

interface SearchResults<T> {
    head?: T
    results: T[]
}

type QueryTypes = string | number | object;

export enum SearchQuery {
    All = 'special_all'
}

type Query = QueryTypes | QueryTypes[] | SearchQuery


const clone = <T>(value: T): T => {
    return <T>JSON.parse(JSON.stringify(value));
}
const processQuery = <T extends MHItem>(storage: DBStorage<T>, query: Query): T[] => {
    let results: T[] = [];
    const lookupKey = String(query);
    switch (typeof query) {
        case 'string': {
            if (lookupKey === <any>SearchQuery.All) {
                results = storage.records;
            } else {
                results = storage.byName[lookupKey] ? [storage.byName[lookupKey]] : storage.records.filter(record => {
                    return record.name.includes(<string>query)
                })
            }
        }
            break;
        case 'number':
            results = storage.byId[lookupKey] ? [storage.byId[lookupKey]] : storage.records.filter(record => {
                return record.id === <number>query
            });
            break;
    }
    // filter out empty values and clone the instance so we dont mess up the
    // underlying item when attaching decos
    return results.filter(value => !!value).map(clone)
};
const search = <T extends MHItem>(records: DBStorage<T>, query: Query, unique: boolean = true): SearchResults<T> => {
    const queries = Array.isArray(query) ? query : [query];

    let results: T[] = <T[]>(queries.reduce<any>((acc, query) => {
        return [...acc, ...processQuery<T>(records, query)]
    }, []));

    if (unique) {
        results = uniqBy(results, 'id');
    }
    return {
        head: results.length ? results[0] : null,
        results
    }
};
type DBSearcher<T extends Gear> = (query: Query, unique?: boolean) => SearchResults<T>
export const armor = (query: Query, unique: boolean = true): SearchResults<Armor> => {
    return search(database.armor, query, unique);
};

export const charms = (query: Query, unique: boolean = true): SearchResults<Charm> => {
    return search(database.charms, query, unique);
};
export const skills = (query: Query, unique: boolean = true): SearchResults<Skill> => {
    return search(database.skills, query, unique);
};
export const decorations = (query: Query, unique: boolean = true): SearchResults<Decoration> => {
    return search(database.decorations, query, unique);
};

export const weapons = (query: Query, unique: boolean = false): SearchResults<Weapon> => {
    return search(database.weapons, query, unique);
};

const initAction = actionCreator.async(t.INIT_DB);

const buildItem = <T extends Gear>(backend: DBSearcher<T>, name: string, jewels: string[] = []): T => {
    const item = backend(name, true).head;
    attachDecorations(item, jewels);
    return <T>(<any>item);
};
const buildArmor = (name: string, jewels: string[] = []) => {
    return buildItem<Armor>(armor, name, jewels);
};
const attachDecorations = (gear: Gear, names: string[], canAdd: boolean = false) => {
    const decos = decorations(names, false).results;
    if (!gear.attributes.slots) {
        gear.attributes.slots = [];
    }
    const slots = gear.attributes.slots;
    decos.forEach((deco) => {
        let slot = slots.find(slot => !slot.decoration && slot.rank === deco.slot);
        if (!slot) {
            slot = slots.find(slot => !slot.decoration && slot.rank > deco.slot)
        }
        if (slot) {
            slot.decoration = deco;
        } else if (canAdd) {
            slots.push({rank: 1, decoration: deco})
        }
    })
};


const buildWeapon = (name: string, jewels: string[] = []) => {
    const weapon = weapons(name, true).head;
    attachDecorations(weapon, jewels, true);
    return weapon;


};
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
    return dispatch(loadBuild(build));
});
export {
    load,
    init
}