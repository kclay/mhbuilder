import {uniqBy} from 'lodash'
import {Armor, Charm, Decoration, Gear, MHItem, Skill, Weapon} from "./common";
import Searcher from './query'



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


export enum GearTypes {
    Head = 'head',
    Charm = 'charm',
    Chest = 'chest',
    Gloves = 'gloves',
    Legs = 'legs',
    Waist = 'waist'
}

class DB {
    armor = new DBStorage<Armor>();
    charms = new DBStorage<Charm>();
    decorations = new DBStorage<Decoration>();
    skills = new DBStorage<Skill>();
    weapons = new DBStorage<Weapon>();

    private _all = new DBStorage<Gear>();
    get all() {
        if (!this._all.records.length) {
            this._all.records = ['armor', 'decorations', 'skills', 'weapons', 'charms'].reduce((acc, name) => {
                return [...acc, ...this[name].records]
            }, [])
        }
        return this._all;
    }

}

export const database = new DB();


export interface SearchResults<T> {
    head?: T
    items: T[],
    page?: number,
    total: number
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
        case 'object':
            results = <T[]>Searcher.query(storage.records, query);
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
        items: results,
        total: results.length
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

export const all = (query: Query): SearchResults<Gear> => {
    return search(database.all, query)
};


const buildItem = <T extends Gear>(backend: DBSearcher<T>, name: string, jewels: string[] = []): T => {
    const item = backend(name, true).head;
    attachDecorations(item, jewels);
    return <T>(<any>item);
};
export const buildArmor = (name: string, jewels: string[] = []) => {
    return buildItem<Armor>(armor, name, jewels);
};
const attachDecorations = (gear: Gear, names: string[], canAdd: boolean = false) => {
    const decos = decorations(names, false).items;
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


export const buildWeapon = (name: string, jewels: string[] = []) => {
    const weapon = weapons(name, true).head;
    attachDecorations(weapon, jewels, true);
    return weapon;


};
