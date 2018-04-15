import * as t from '../constants/actionTypes'
import actionCreatorFactory from 'typescript-fsa';
import axios from 'axios';
import {assets} from "../utils";
import {bindThunkAction} from 'typescript-fsa-redux-thunk';

const actionCreator = actionCreatorFactory();


class DB {
    armor: Armor[] = [];
    decoration: any;
    skills: any;
    weapons: any;
}

const database = new DB();
const loadAction = actionCreator.async(t.LOAD_DB);
const load = bindThunkAction(loadAction, async () => {
    const loaders = ['armor', 'decorations', 'skills', 'weapons'].map(name => {
        return axios.get<Gear>(assets(`assets/db/${name}.json`))
    });

    return Promise.all(loaders).then((resp) => {
        resp.forEach(resp => {
            const data = resp.data;
            const filename = resp.config.url!.split('/').pop();
            const name = filename!.split('.json')[0];
            database[name] = data;
        });
        return true;
    })

});

export {
    load
}